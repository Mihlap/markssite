const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  webpack: (config, env) => {
    const isProd = env === 'production';

    config.cache = { type: 'filesystem' };

    if (isProd) {
      process.env.GENERATE_SOURCEMAP = 'false';
      config.devtool = false;

      const EXCLUDES = [
        '**/static/js/*.js',
        '!**/static/js/main.*.js',
        '**/*.map',
        '**/static/js/*mapbox*.js',
        '**/static/js/*react-map-gl*.js',
        '**/static/js/runtime-*.js',
        '**/static/js/vendors~*.js',
        '**/static/js/vendor*.js',
      ];

      config.plugins.push(
        new JavaScriptObfuscator(
          {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: true,
            debugProtectionInterval: 0,
            disableConsoleOutput: true,
            domainLock: ['marksgroup.ru', 'www.marksgroup.ru'],
            mangle: true,
            rotateStringArray: false,
            selfDefending: false,
            stringArray: true,
            stringArrayEncoding: ['base64'],
            stringArrayThreshold: 0.2,
            unicodeEscapeSequence: false,
          },
          EXCLUDES
        )
      );
    }

    return config;
  },

  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      config.allowedHosts = 'all';
      return config;
    };
  },
};
