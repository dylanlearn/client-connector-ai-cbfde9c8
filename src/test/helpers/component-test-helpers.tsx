
import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create mock functions that match Jest's API but use Vitest under the hood
const mockVi = {
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
    const mockFn = mockVi.fn();
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
        object[method] = mockVi.fn();
      }
    };
  }
};

// Make mockVi available globally for tests
(global as any).vi = mockVi;

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
  const mockSupabaseFrom = mockVi.fn();
  const mockSupabaseSelect = mockVi.fn();
  const mockSupabaseInsert = mockVi.fn();
  const mockSupabaseUpdate = mockVi.fn();
  const mockSupabaseDelete = mockVi.fn();
  const mockSupabaseEq = mockVi.fn();
  const mockSupabaseOrder = mockVi.fn();
  const mockSupabaseLimit = mockVi.fn();
  const mockSupabaseSingle = mockVi.fn().mockImplementation(() => mockApiResponse({}));
  
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
