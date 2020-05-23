module.exports = {
  // transform: { '^.+\\.ts?$': 'ts-jest' },
  testEnvironment: 'node',
  testRegex: '/test/.*\\.(test|spec)?\\.(js)$',
  moduleFileExtensions: ['ts',  'js', 'json', 'node'],
  "transformIgnorePatterns": [
    "<rootDir>/node_modules/(?!lodash-es)"
  ]
};