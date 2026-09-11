module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  ignorePatterns: ['node_modules/', 'db/', 'images/', 'sessions/'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off', // Отключить предупреждение для вызовов console.log()
    'consistent-return': 'off', // Отключить обязательное правило для return в каждой ветке функции
    // Спорные правила стиля Airbnb, отключены чтобы не ломать рабочую логику
    'no-restricted-syntax': 'off', // for...of / for...in / генераторы
    'no-continue': 'off', // continue в циклах
    'no-await-in-loop': 'off', // последовательные await с транзакциями БД
    'no-nested-ternary': 'off', // вложенные тернарники
    'no-restricted-globals': 'off', // isNaN и другие глобальные (меняет поведение для строк)
    radix: 'off', // parseInt без radix (поведение не меняется)
    'no-plusplus': 'off', // i++ вместо i += 1
    'no-unused-vars': 'off', // неиспользуемые импорты/переменные
    'no-use-before-define': 'off', // вызовы функций до объявления (JS-hoisting)
    'no-param-reassign': 'off', // присваивание параметру функции
    'no-empty': 'off', // пустые блоки catch
  },
};
