// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier', 'plugin:react-native/all'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['prettier', 'react', 'react-native'],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    'react-native/no-inline-styles': 'warn',
    'react-native/no-unused-styles': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { caughtErrorsIgnorePattern: '^_' },
    ],
    'react/prop-types': 'off',
    'no-console': ['warn', { allow: ['error'] }],
    quotes: ['error', 'single'],
  },
  ignorePatterns: ['/dist/*'],
  env: {
    browser: true,
    node: true,
    es2021: true,
    'react-native/react-native': true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
