require('@testing-library/jest-dom')

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.location.reload more carefully
if (!window.location) {
  Object.defineProperty(window, 'location', {
    value: {
      reload: jest.fn(),
      href: 'http://localhost',
    },
    writable: true,
    configurable: true,
  })
} else {
  window.location.reload = jest.fn()
}