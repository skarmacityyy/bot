import globals from 'globals';

export default [{
  files: ['**/*.js'],
  languageOptions: {
    sourceType: 'module',
    ecmaVersion: 2023,
    globals: globals.node
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
}];
