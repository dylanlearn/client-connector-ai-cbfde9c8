
import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock implementation of vi for tests
const mockVi = {
  fn: (implementation?: any) => jest.fn(implementation),
  mock: (moduleName: string) => jest.mock(moduleName),
  spyOn: (object: any, method: string) => jest.spyOn(object, method)
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
  // Using jest syntax instead of vitest
  const mockSupabaseFrom = jest.fn().mockReturnThis();
  const mockSupabaseSelect = jest.fn().mockReturnThis();
  const mockSupabaseInsert = jest.fn().mockReturnThis();
  const mockSupabaseUpdate = jest.fn().mockReturnThis();
  const mockSupabaseDelete = jest.fn().mockReturnThis();
  const mockSupabaseEq = jest.fn().mockReturnThis();
  const mockSupabaseOrder = jest.fn().mockReturnThis();
  const mockSupabaseLimit = jest.fn().mockReturnThis();
  const mockSupabaseSingle = jest.fn().mockImplementation(() => mockApiResponse({}));
  
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
