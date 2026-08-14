import { defineConfig, loadEnv, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import JavaScriptObfuscator from 'javascript-obfuscator';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Нужен, пока в src есть .js с JSX (issueIcons.js, categories.js и др.) */
function treatJsFilesAsJsx() {
  return {
    name: 'treat-js-files-as-jsx',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\/src\/.*\.js$/.test(id)) return null;
      return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
    },
  };
}

function craEnvDefine(mode) {
  const env = loadEnv(mode, __dirname, 'REACT_APP_');
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
  );
}

const PRODUCTION_DOMAINS = ['marksgroup.ru', 'www.marksgroup.ru'];
const LOCAL_PREVIEW_DOMAINS = ['localhost', '127.0.0.1'];

function getObfuscatorOptions() {
  const options = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.35,
    deadCodeInjection: false,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: false,
    stringArray: false,
    splitStrings: false,
    transformObjectKeys: false,
    unicodeEscapeSequence: false,
  };

  if (process.env.OBFUSCATOR_DOMAIN_LOCK === '1') {
    options.domainLock = [...PRODUCTION_DOMAINS, ...LOCAL_PREVIEW_DOMAINS];
  }

  return options;
}

const OBFUSCATOR_CHUNK_SKIP =
  /(?:^|\/)(three|editor|mediapipe|vendor|react-katex|swiper|motion|dnd\.esm|browser-image-compression|slick-theme|Notifications?|ScrollTrigger)-[a-zA-Z0-9_-]+\.js$/i;

function isAppChunk(fileName, chunk) {
  if (OBFUSCATOR_CHUNK_SKIP.test(fileName)) return false;
  const modules = chunk.moduleIds || [];
  if (modules.length === 0) return true;
  const fromSrc = modules.some((id) => /[\\/]src[\\/]/.test(id));
  const mostlyVendor = modules.every(
    (id) => /node_modules/.test(id) || id.startsWith('\0'),
  );
  return fromSrc && !mostlyVendor;
}

function obfuscateOutputChunks() {
  return {
    name: 'obfuscate-output-chunks',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const options = getObfuscatorOptions();
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk' || !fileName.endsWith('.js')) continue;
        if (!isAppChunk(fileName, chunk)) continue;
        chunk.code = JavaScriptObfuscator.obfuscate(chunk.code, options).getObfuscatedCode();
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    envPrefix: 'REACT_APP_',
    define: craEnvDefine(mode),
    optimizeDeps: {
      esbuildOptions: {
        loader: { '.js': 'jsx' },
      },
    },
    plugins: [
      treatJsFilesAsJsx(),
      react({ include: /\.(jsx|js|tsx|ts)$/ }),
      svgr({ include: '**/*.svg?react' }),     
      isProd && process.env.OBFUSCATOR === '1' && obfuscateOutputChunks(),
    ].filter(Boolean),
    css: {
      devSourcemap: !isProd,
      modules: { localsConvention: 'camelCase' },
      preprocessorOptions: {
        scss: { loadPaths: [path.resolve(__dirname, 'src')] },
      },
    },
    server: {
      host: process.env.DOCKER === '1' ? '0.0.0.0' : undefined,
      port: 3000,
      strictPort: true,
      open: false,
      watch:
        process.env.CHOKIDAR_USEPOLLING === 'true'
          ? { usePolling: true, interval: 1000 }
          : undefined,
    },
    preview: {
      port: 3000,
      strictPort: true,
    },
    build: {
      outDir: 'build',
      emptyOutDir: true,
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
            mangle: { safari10: true },
            format: { comments: false },
          }
        : undefined,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/[name]-[hash].js',
          manualChunks: {
            react: ['react', 'react-dom', 'react-router'],
            gsap: ['gsap', '@gsap/react'],
            swiper: ['swiper', 'swiper/react', 'swiper/modules'],
            redux: ['redux', 'react-redux', '@reduxjs/toolkit'],
            'react-query': ['@tanstack/react-query'],
          },
        },
      },
      chunkSizeWarningLimit: 3500,
    },
  };
});
