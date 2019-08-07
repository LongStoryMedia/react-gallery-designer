module.exports = {
  "extends": [
    "plugin:react/recommended"
  ],
  "env": {
    "es6": true,
    "node": true
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 9,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "react/prop-types": "off",
    "no-implied-eval": 1,
    "no-unused-expressions": 1,
    "no-extra-bind": 1,
    "default-case": 1,
    "class-methods-use-this": 1
  }
}
