import { defineConfig, loadEnv, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import JavaScriptObfuscator from 'javascript-obfuscator';
import path from 'path';
import { fileURLToPath } from 'url';

function treatJsFilesAsJsx() {
  return {
    name: 'treat-js-files-as-jsx',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\/src\/.*\.js$/.test(id)) return null;
      return transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic',
      });
    },
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function reactAppEnvDefine(mode) {
  const env = loadEnv(mode, __dirname, 'REACT_APP_');
  const define = {};
  for (const [key, value] of Object.entries(env)) {
    define[`process.env.${key}`] = JSON.stringify(value);
  }
  return define;
}

const PRODUCTION_DOMAINS = ['marksgroup.ru', 'www.marksgroup.ru'];
const LOCAL_PREVIEW_DOMAINS = ['localhost', '127.0.0.1'];

function getObfuscatorOptions() {
  const enableDomainLock = process.env.OBFUSCATOR_DOMAIN_LOCK === '1';
  const options = {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: true,
    mangle: true,
    rotateStringArray: false,
    selfDefending: false,
    stringArray: false,
    unicodeEscapeSequence: false,
  };

  if (enableDomainLock) {
    options.domainLock = [...PRODUCTION_DOMAINS, ...LOCAL_PREVIEW_DOMAINS];
  }

  return options;
}

const OBFUSCATOR_CHUNK_SKIP =
  /(?:^|\/)(three|editor|mediapipe|vendor|index)-[a-zA-Z0-9]+\.js$/;

function obfuscateOutputChunks() {
  return {
    name: 'obfuscate-output-chunks',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk' || !fileName.endsWith('.js')) continue;
        if (OBFUSCATOR_CHUNK_SKIP.test(fileName)) continue;
        chunk.code = JavaScriptObfuscator.obfuscate(chunk.code, getObfuscatorOptions()).getObfuscatedCode();
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const env = loadEnv(mode, __dirname, 'REACT_APP_');
  const apiTarget = env.REACT_APP_SERVER_HOST || 'http://localhost:3002';

  return {
    envPrefix: 'REACT_APP_',
    define: reactAppEnvDefine(mode),
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.[jt]sx?$/,
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [
      treatJsFilesAsJsx(),
      react({ include: /\.(jsx|js|tsx|ts)$/ }),
      svgr({
        include: '**/*.svg?react',
      }),
      isProd && process.env.OBFUSCATOR === '1' && obfuscateOutputChunks(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      devSourcemap: !isProd,
      modules: {
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        scss: {
          loadPaths: [path.resolve(__dirname, 'src')],
        },
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      open: false,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      cssMinify: isProd,
      minify: isProd ? 'terser' : false,
      terserOptions: isProd
        ? {
            compress: {
              passes: 2,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
            },
            mangle: {
              safari10: true,
            },
            format: {
              comments: false,
            },
          }
        : undefined,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/[name]-[hash].js',
        },
      },
      chunkSizeWarningLimit: 3500,
    },
  };
});
