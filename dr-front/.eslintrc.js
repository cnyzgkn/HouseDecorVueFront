module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'standard',
    "eslint:recommended",
    "plugin:vue/recommended"
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': [1, 2, { 'SwitchCase': 1 }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['vue', 'html', 'import', 'node', 'promise'],
  "globals": {
    "qt": false
  }
}
