// Test setup for Jest
import { jest } from '@jest/globals';

// Global test timeout
jest.setTimeout(30000);

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_for_jest';
process.env.MONGODB_URI = 'mongodb://localhost:27017/jharufy_test';

// Mock console methods if needed
global.console = {
  ...console,
  // Uncomment to disable logs in tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Setup global test utilities if needed
global.testHelpers = {
  // Add any global test helpers here
};
