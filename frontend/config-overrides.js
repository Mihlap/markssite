const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = function override(config, env) {
  if (env === 'production') {

    config.devtool = false;
    
    config.optimization = {
      ...config.optimization,
      minimizer: [
        ...(config.optimization.minimizer || []),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
          parallel: true,
        }),
      ],
    };

    config.plugins.push(
      new JavaScriptObfuscator(
        {
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: false,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: true,
          debugProtectionInterval: 4000,
          disableConsoleOutput: true,
          domainLock: ['marksgroup.ru', 'www.marksgroup.ru'],
          log: false,
          mangle: true,
          renameGlobals: false,
          rotateStringArray: true,
          selfDefending: true,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false,
        },
        []
      )
    );
  }
  return config;
};
