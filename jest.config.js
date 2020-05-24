module.exports = {
  transform: { '^.+\\.ts?$': 'ts-jest' },
  testEnvironment: 'node',
  testRegex: '/test/.*\\.(test|spec)?\\.(ts)$',
  moduleFileExtensions: ['ts',  'js', 'json', 'node'],
  "transformIgnorePatterns": [
    "<rootDir>/node_modules/(?!lodash-es)"
  ],
  setupFiles: ["dotenv/config"],
  preset: "@shelf/jest-mongodb"
};