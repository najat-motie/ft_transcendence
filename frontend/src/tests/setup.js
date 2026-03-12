// Test setup file for frontend tests
// No @testing-library/* needed as tests are API integration tests, not component tests

// Mock environment variables
process.env.VITE_API_BASE_URL = 'http://localhost:3000';

// Mock localStorage
const localStorageMock = {
  getItem: (key) => {
    const store = {};
    return store[key] || null;
  },
  setItem: (key, value) => {
    const store = {};
    store[key] = value.toString();
  },
  removeItem: (key) => {
    const store = {};
    delete store[key];
  },
  clear: () => {
    const store = {};
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch for API calls
global.fetch = vi.fn();
