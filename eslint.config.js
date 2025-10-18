// eslint.config.js
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // игнорируем служебные папки/файлы
  { ignores: ['dist/**', 'node_modules/**'] },

  // базовые рекомендованные правила ESLint (flat)
  js.configs.recommended,

  // перенос "старых" пресетов в flat-формат
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'prettier',
  ),

  // ==== Код приложения (браузер) ====
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      // вместо env: { browser: true }
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: { version: '18.0' },
      'import/resolver': { node: { extensions: ['.js', '.jsx'] } },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      prettier: prettierPlugin, 
    },
    rules: {
      // Preact/JSX
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'prettier/prettier': 'warn', 
      // Импорты
      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external', 'internal'],
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      // Мелочи
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // ==== Конфиги Node в ESM (например, webpack.config.js) ====
  {
    files: ['**/webpack.config.js', '**/*.config.js', '**/*.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // вместо env: { node: true }
      globals: {
        ...globals.node,
      },
    },
  },

  // ==== CommonJS-конфиги (.cjs) ====
  {
    files: ['**/*.config.cjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
];
