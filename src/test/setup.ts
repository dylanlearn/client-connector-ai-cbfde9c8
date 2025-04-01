
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia for responsive designs tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {
      return false;
    },
  };
};

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
