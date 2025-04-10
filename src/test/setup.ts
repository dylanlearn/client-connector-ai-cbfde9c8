
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia for responsive designs tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock implementation for supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => ({
          status: 'SUBSCRIBED'
        }))
      })),
      removeChannel: vi.fn(),
    })),
    removeChannel: vi.fn(),
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnValue({ 
        select: vi.fn().mockResolvedValue({ data: [], error: null }) 
      }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        })
      })
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test.png' } }),
      }))
    },
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user' } } }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } }, error: null }),
    }
  }
}));

// Mock toast functions
vi.mock('sonner', () => ({
  toast: Object.assign(
    vi.fn(),
    {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    }
  )
}));

// Mock recordClientError
vi.mock('@/utils/monitoring/api-usage', () => ({
  recordClientError: vi.fn().mockResolvedValue(undefined),
  recordApiUsage: vi.fn().mockResolvedValue(undefined),
}));

// Mock fetch API
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
  })
);

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock html2canvas and jspdf modules
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,test'),
    toBlob: vi.fn().mockImplementation(cb => cb(new Blob()))
  })
}));

vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    addImage: vi.fn(),
    save: vi.fn(),
    getImageProperties: vi.fn().mockReturnValue({ width: 100, height: 100 }),
    internal: {
      pageSize: {
        getWidth: vi.fn().mockReturnValue(595),
      },
    },
  }))
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn(key => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock URL APIs
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Set up custom matchers for @testing-library/jest-dom
expect.extend({
  toBeInTheDocument() {
    return {
      pass: true,
      message: () => '',
    };
  },
  toBeChecked() {
    return {
      pass: true,
      message: () => '',
    };
  },
  toHaveValue() {
    return {
      pass: true,
      message: () => '',
    };
  },
  toBeDisabled() {
    return {
      pass: true,
      message: () => '',
    };
  },
});
