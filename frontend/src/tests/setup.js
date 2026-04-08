// Test setup file for frontend tests
// No @testing-library/* needed as tests are API integration tests, not component tests

// Mock environment variables
process.env.VITE_API_BASE_URL = 'http://localhost';
process.env.VITE_WS_BASE_URL = '';

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

if (!globalThis.window) {
  globalThis.window = globalThis;
}

if (!globalThis.document) {
  globalThis.document = { cookie: '' };
}

Object.defineProperty(globalThis.window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

// Mock fetch for API calls
global.fetch = vi.fn();
