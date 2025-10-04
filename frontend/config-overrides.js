const JavaScriptObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  webpack: (config, env) => {
    const isProd = env === 'production';
    config.cache = { type: 'filesystem' };

    if (isProd) {
      // process.env.GENERATE_SOURCEMAP = 'false';
      config.devtool = false;

      config.plugins = (config.plugins || []).filter(
        (p) => (p && p.constructor && p.constructor.name) !== 'ESLintWebpackPlugin'
      );

      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          new TerserPlugin({
            parallel: true,
            extractComments: false,
            terserOptions: {
              compress: { passes: 1, drop_console: true, drop_debugger: true },
              mangle: true,
              format: { comments: false },
            },
          }),
          new CssMinimizerPlugin({
            parallel: true,
            minimizerOptions: { preset: ['default', { discardComments: { removeAll: true } }] },
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
