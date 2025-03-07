module.exports = {
  // Use ts-jest for TypeScript files
  preset: 'ts-jest',

  // Use jsdom to simulate a browser environment
  testEnvironment: 'jsdom',

  // Match test files (files ending with .test.tsx or .spec.tsx)
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],

  // Setup files to run before each test file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Transform files using babel-jest
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  // Mock CSS/SCSS modules (to avoid errors when importing styles)
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Collect code coverage
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],

  // Verbose output for debugging
  verbose: true,
};