
import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create mock functions that match Jest's API but use Vitest under the hood
const mockVi = {
  fn: (implementation?: any) => function mockFn(...args: any[]) {
    return implementation ? implementation(...args) : undefined;
  },
  mock: (moduleName: string) => ({
    moduleName
  }),
  spyOn: (object: any, method: string) => {
    const original = object[method];
    object[method] = mockVi.fn();
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
  const mockSupabaseFrom = mockVi.fn().mockReturnThis();
  const mockSupabaseSelect = mockVi.fn().mockReturnThis();
  const mockSupabaseInsert = mockVi.fn().mockReturnThis();
  const mockSupabaseUpdate = mockVi.fn().mockReturnThis();
  const mockSupabaseDelete = mockVi.fn().mockReturnThis();
  const mockSupabaseEq = mockVi.fn().mockReturnThis();
  const mockSupabaseOrder = mockVi.fn().mockReturnThis();
  const mockSupabaseLimit = mockVi.fn().mockReturnThis();
  const mockSupabaseSingle = mockVi.fn().mockImplementation(() => mockApiResponse({}));
  
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
