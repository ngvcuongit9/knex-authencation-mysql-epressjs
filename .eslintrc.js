module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'linebreak-style': ['error', process.env.NODE_ENV === 'prod' ? 'unix' : 'windows'],
  },
};
