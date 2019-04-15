module.exports = {
  transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*smooth-.*).*$'],
  testPathIgnorePatterns: ['node_modules', 'lib'],
  moduleNameMapper: {
    '__smooth_(.*)$': '<rootDir>/packages/smooth/__fixtures__/__smooth/$1',
  },
  verbose: false,
}
