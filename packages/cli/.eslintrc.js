module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    semi: ['error', 'never'],
    'no-unused-vars': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'no-param-reassign': 'off',
    'no-console': 'off',
  },
}
