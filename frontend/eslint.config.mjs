// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import pluginImport from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Что игнорим
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.next/**', 'coverage/**', '*.min.js'],
  },

  // База: JS + JSX + браузерные глобалы
  {
    name: 'base',
    files: ['**/*.{js,mjs,cjs,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // лёгкая гигиена
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      eqeqeq: ['error', 'always'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'warn',
    },
  },

  // React рекомендации (официальный пресет)
  pluginReact.configs.flat.recommended,

  // React Hooks (официальные правила)
  {
    name: 'react-hooks',
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn', // на CI можно 'error'
    },
  },

  // Fast Refresh (Vite/CRA) — предупреждает про экспорт не-компонентов по умолчанию
  {
    name: 'react-refresh',
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': 'warn',
    },
  },

  // Импорты
  {
    name: 'imports',
    plugins: { import: pluginImport },
    rules: {
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/no-self-import': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // Промисы (async/await гигиена)
  {
    name: 'promises',
    plugins: { promise: pluginPromise },
    extends: ['plugin:promise/recommended'],
    rules: {
      'promise/no-nesting': 'off', // включай, если хочешь строже
      'promise/no-multiple-resolved': 'error',
    },
  },

  // Тесты (включи нужный блок)
  // Jest
  {
    name: 'tests-jest',
    files: ['**/*.test.{js,jsx}', '**/__tests__/**'],
    languageOptions: { globals: globals.jest },
  },
  // Vitest
  {
    name: 'tests-vitest',
    files: ['**/*.test.{js,jsx}', 'src/**/__tests__/**'],
    languageOptions: { globals: { ...globals.node, ...globals.vitest } },
  },

  // Prettier: отключает конфликтующие форматные правила ESLint
  {
    name: 'prettier',
    extends: [prettier],
  },
]);
