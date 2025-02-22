module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[t]s'],
    coverageDirectory: './coverage',
    collectCoverage: true,
  };
  