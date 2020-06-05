module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    jest: true,
  },
  rules: {
    'max-len': ['error', { code: 140 }],
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'comma-dangle': 'off',
    'no-return-assign': 'off',
    'no-underscore-dangle': 'off',
    'react/no-array-index-key': 'off'
  },
  globals: {
    fetch: false
  }
};
