module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  rules: {
    'brace-style': [2, 'stroustrup', { allowSingleLine: true }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-mutating-props': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
