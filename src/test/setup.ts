
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
    rpc: vi.fn(() => Promise.resolve()),
  }
}));

// Mock toast functions
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }
}));
