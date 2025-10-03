const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

function webpack(config, env) {
  if (env === 'production') {
    config.devtool = false;

    config.optimization = {
      ...config.optimization,
      minimizer: [
        ...(config.optimization?.minimizer || []),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
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
          debugProtection: true,
          debugProtectionInterval: 4000,
          disableConsoleOutput: true,
          domainLock: ['marksgroup.ru', 'www.marksgroup.ru'],
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
}

function devServer(configFunction) {
  return (proxy, allowedHost) => {
    const config = configFunction(proxy, allowedHost);
    config.client = { ...config.client, overlay: false };
    config.allowedHosts = 'all';
    return config;
  };
}

module.exports = { webpack, devServer };
