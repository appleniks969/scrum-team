// jest.setup.js
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  })
}));

// Mock environment variables
process.env = {
  ...process.env,
  USE_MOCK_DATA: 'true',
  NEXT_PUBLIC_API_URL: 'http://localhost:3000/api'
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Add test IDs to all non-named elements for easier testing
window.HTMLElement.prototype.dataset = window.HTMLElement.prototype.dataset || {};
