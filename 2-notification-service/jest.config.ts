import type { Config } from '@jest/types';

// Jest configuration options
const jestConfig: Config.InitialOptions = {
  preset: 'ts-jest', // Use the ts-jest preset for TypeScript support
  testEnvironment: 'node', // Use the Node.js environment for running tests
  verbose: true, // Display detailed information during test execution
  coverageDirectory: 'coverage', // Directory to store coverage reports
  collectCoverage: true, // Enable code coverage collection
  testPathIgnorePatterns: ['/node_modules'], // Ignore test files in the node_modules directory
  transform: {
    '^.+\\.ts?$': 'ts-jest' // Transform TypeScript files using ts-jest
  },
  testMatch: ['<rootDir>/src/**/test/*.ts'], // Match test files using the specified pattern
  collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'], // Collect coverage from TypeScript files, excluding test files and node_modules
  coverageThreshold: {
    global: {
      branches: 1, // Minimum coverage required for branches is 100%
      functions: 1, // Minimum coverage required for functions is 100%
      lines: 1, // Minimum coverage required for lines is 100%
      statements: 1 // Minimum coverage required for statements is 100%
    }
  },
  coverageReporters: ['text-summary', 'lcov'], // Generate coverage reports in text-summary and lcov formats
  moduleNameMapper: {
    '@notifications/(.*)': ['<rootDir>/src/$1'] // Map module paths starting with '@notifications' to the 'src' directory
  }
};

export default jestConfig;
