// config-overrides.js
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = function override(config, env) {
  // Найти секцию с плагинами в конфигурации
  const plugins = config.plugins;

  // Добавить JavaScriptObfuscator в список плагинов
  plugins.push(
    new JavaScriptObfuscator({
      compact: true,
      controlFlowFlattening: false,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: true,
      disableConsoleOutput: true,
      domainLock: ['example.com'],
      log: false,
      mangle: true,
      renameGlobals: false,
      rotateStringArray: true,
      selfDefending: true,
      stringArray: true,
      stringArrayEncoding: 'base64',
      stringArrayThreshold: 0.75,
      unicodeEscapeSequence: false
    })
  );

  // Вернуть обновленную конфигурацию
  return config;
};
