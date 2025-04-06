
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Create a new QueryClient for testing purposes
 */
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

/**
 * Set up providers for testing components that require context
 * @param children React component to render with providers
 */
export function renderWithProviders(children: React.ReactNode) {
  const testQueryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={testQueryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
}

/**
 * Mock the useAuth hook for testing
 * @returns Mocked useAuth values
 */
export function mockUseAuth() {
  // Return a mock implementation of useAuth
  // This can be expanded as needed for different test scenarios
  return {
    user: { id: 'test-user-id' },
    profile: { 
      id: 'test-user-id',
      role: 'user',
      subscription_status: 'free'
    },
    isLoading: false,
    isAuthenticated: true,
    signIn: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn()
  };
}

/**
 * Mock the useAuthorization hook for testing
 * @returns Mocked useAuthorization values
 */
export function mockUseAuthorization() {
  return {
    can: jest.fn().mockReturnValue(true),
    canAny: jest.fn().mockReturnValue(true),
    canAll: jest.fn().mockReturnValue(true),
    isAdmin: jest.fn().mockReturnValue(false),
    hasPaidSubscription: jest.fn().mockReturnValue(false),
    permissions: []
  };
}
