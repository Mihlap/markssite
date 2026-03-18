const JavaScriptObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const os = require('os');
const path = require('path');

module.exports = {
  webpack: (config, env) => {
    const isProd = env === 'production';

    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
      cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
      compression: 'gzip',
    };

    if (isProd) {
      config.devtool = false;

      config.plugins = (config.plugins || []).filter(
        (p) => (p && p.constructor && p.constructor.name) !== 'ESLintWebpackPlugin'
      );

      const splitChunksConfig = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
          },
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
            chunks: 'all',
            priority: 30,
          },
          three: {
            name: 'three',
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            chunks: 'all',
            priority: 25,
          },
        },
      };

      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: splitChunksConfig,
        minimizer: [
          new TerserPlugin({
            parallel: os.cpus().length - 1,
            extractComments: false,
            terserOptions: {
              compress: {
                passes: 2,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'], // Явное удаление console
              },
              mangle: {
                safari10: true,
              },
              format: {
                comments: false,
              },
            },
          }),
          new CssMinimizerPlugin({
            parallel: os.cpus().length - 1,
            minimizerOptions: {
              preset: [
                'default',
                {
                  discardComments: { removeAll: true },
                  normalizeWhitespace: true,
                },
              ],
            },
          }),
        ],
      };

      const OBFUSCATOR_EXCLUDES = [
        '**/static/js/*.chunk.js',
        '**/static/js/runtime-*.js',
        '**/static/js/vendors~*.js',
        '**/static/js/vendor*.js',
        '**/*.map',
        '**/static/js/*mapbox*.js',
        '**/static/js/*react-map-gl*.js',
        '**/static/js/*three*.js',
        '**/static/js/*mediapipe*.js',
        '**/static/js/*katex*.js',
        '**/static/js/*quill*.js',
      ];

      config.plugins.push(
        new JavaScriptObfuscator(
          {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            debugProtectionInterval: 0,
            disableConsoleOutput: true,
            mangle: true,
            domainLock: ['marksgroup.ru', 'www.marksgroup.ru'],
            rotateStringArray: false,
            selfDefending: false,
            stringArray: false,
            unicodeEscapeSequence: false,
          },
          OBFUSCATOR_EXCLUDES
        )
      );
    }

    return config;
  },

  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      config.allowedHosts = 'all';
      config.client = { ...(config.client || {}), overlay: false };
      return config;
    };
  },
};
