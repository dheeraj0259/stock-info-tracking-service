module.exports = {
  extends: [
      "eslint:recommended",
      "@serverless/eslint-config/node",
      "plugin:import/errors",
      "plugin:import/warnings"
  ],
  "env": {
      "mocha": true,
      "node": true,
      "browser": true,
      "es6": true
  },
  "parserOptions": {
      "ecmaVersion": 2017,
      "sourceType": "module",
      "ecmaFeatures": {
      }
  },
  "plugins": [
      "import",
  ],
  "globals": {
      "should": true,
      "sinon": true
  },
  rules: {
      'max-len': [1, 120, 2, { ignoreComments: true }],
      'object-curly-newline':              ["error", { 'multiline': true }],
      'arrow-parens':                      ["error", "as-needed"],
      'indent':                            ['error', 4, { SwitchCase: 1 }],
      'key-spacing':                       ['error', { 'align': 'value' }],
      'linebreak-style':                   ['error', 'unix'],
      'quotes':                            ['error', 'double'],
      'semi':                              ['error', 'always'],
      'comma-dangle':                      ['error', 'always-multiline'],
      'import/no-extraneous-dependencies': ["error", {"devDependencies": true}],
      'no-multi-spaces':                   [
          'error', {
              exceptions: {
                  'ImportDeclaration':  true,
                  'VariableDeclarator': true,
              },
          }
      ],
      "no-mixed-spaces-and-tabs": "off",
      "no-unused-vars": "off",
      "no-console": "off"
  }
};