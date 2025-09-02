const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  { ignores: ['node_modules', 'dist', 'build', '.expo', 'android', 'ios', 'web-build'] },
  ...expo,
  {
    plugins: { import: require('eslint-plugin-import') },
    settings: {
      'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
        node: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'] },
      },
    },
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^firebase/auth/react-native$'] }],
    },
  },
  prettier,
]);
