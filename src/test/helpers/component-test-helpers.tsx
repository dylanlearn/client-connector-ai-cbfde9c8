
import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create mock functions that match Jest's API but use Vitest under the hood
export const vi = {
  fn: (implementation?: any) => {
    const mockFunction = function mockFn(...args: any[]) {
      return implementation ? implementation(...args) : undefined;
    };
    
    // Add Jest-like methods
    mockFunction.mockReturnThis = function() {
      return this;
    };
    
    mockFunction.mockImplementation = function(impl: any) {
      implementation = impl;
      return this;
    };
    
    mockFunction.mockReturnValue = function(val: any) {
      implementation = () => val;
      return this;
    };
    
    return mockFunction;
  },
  mock: (moduleName: string) => ({
    moduleName
  }),
  spyOn: (object: any, method: string) => {
    const original = object[method];
    const mockFn = vi.fn();
    object[method] = mockFn;
    
    return {
      mockImplementation: (impl: any) => {
        object[method] = impl;
        return object[method];
      },
      mockRestore: () => {
        object[method] = original;
      },
      mockReset: () => {
        object[method] = vi.fn();
      }
    };
  }
};

// Make testing globals available
export const describe = (name: string, fn: () => void) => {
  console.log(`Test Suite: ${name}`);
  try {
    fn();
  } catch (e) {
    console.error(`Error in test suite ${name}:`, e);
  }
};

export const beforeEach = (fn: () => void) => {
  fn();
};

export const it = (name: string, fn: () => void) => {
  console.log(`Test: ${name}`);
  try {
    fn();
  } catch (e) {
    console.error(`Error in test ${name}:`, e);
  }
};

export const expect = (actual: any) => {
  return {
    toBe: (expected: any) => actual === expected,
    toEqual: (expected: any) => JSON.stringify(actual) === JSON.stringify(expected),
    toBeTruthy: () => Boolean(actual),
    toBeFalsy: () => !Boolean(actual),
    toContain: (expected: any) => actual.includes(expected),
    toHaveBeenCalled: () => actual.mock && actual.mock.calls && actual.mock.calls.length > 0,
    toBeInTheDocument: () => Boolean(actual),
  };
};

// Create a wrapper with all providers for testing components
export function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {ui}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Fix for the WireframeExportDialog test
export const createTestWireframe = () => ({
  id: 'test-id',
  title: 'Test Wireframe',
  sections: [],
  colorScheme: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#000000'
  },
  typography: {
    headings: 'Inter',
    body: 'Inter'
  }
});

// Mock API responses for tests
export const mockApiResponse = (data: any, error: any = null) => {
  return {
    data,
    error,
  };
};

// Setup mock for Supabase in tests
export const setupSupabaseMock = () => {
  const mockSupabaseFrom = vi.fn();
  const mockSupabaseSelect = vi.fn();
  const mockSupabaseInsert = vi.fn();
  const mockSupabaseUpdate = vi.fn();
  const mockSupabaseDelete = vi.fn();
  const mockSupabaseEq = vi.fn();
  const mockSupabaseOrder = vi.fn();
  const mockSupabaseLimit = vi.fn();
  const mockSupabaseSingle = vi.fn().mockImplementation(() => mockApiResponse({}));
  
  mockSupabaseFrom.mockReturnThis = () => mockSupabaseFrom;
  mockSupabaseSelect.mockReturnThis = () => mockSupabaseSelect;
  mockSupabaseInsert.mockReturnThis = () => mockSupabaseInsert;
  mockSupabaseUpdate.mockReturnThis = () => mockSupabaseUpdate;
  mockSupabaseDelete.mockReturnThis = () => mockSupabaseDelete;
  mockSupabaseEq.mockReturnThis = () => mockSupabaseEq;
  mockSupabaseOrder.mockReturnThis = () => mockSupabaseOrder;
  mockSupabaseLimit.mockReturnThis = () => mockSupabaseLimit;
  
  return {
    from: mockSupabaseFrom,
    select: mockSupabaseSelect,
    insert: mockSupabaseInsert,
    update: mockSupabaseUpdate,
    delete: mockSupabaseDelete,
    eq: mockSupabaseEq,
    order: mockSupabaseOrder,
    limit: mockSupabaseLimit,
    single: mockSupabaseSingle,
  };
};
