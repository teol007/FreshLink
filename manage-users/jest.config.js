module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['./tests/setup.ts'], // Point to your setup file
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};