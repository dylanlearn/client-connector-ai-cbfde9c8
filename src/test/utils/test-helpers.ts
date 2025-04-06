
import { vi } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

/**
 * Creates a wrapped test query client for testing hooks that use react-query
 * @returns The query client and wrapper function
 */
export function createTestQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Silent in tests to avoid noise
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, wrapper };
}

/**
 * Create mock for Supabase client with common operations
 */
export function createMockSupabaseClient() {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation(callback => {
        return Promise.resolve(callback({ data: [], error: null }));
      }),
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signIn: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      }),
    },
  };
}

/**
 * Mock timing functions with controllable time advancement
 */
export function setupMockTimer() {
  vi.useFakeTimers();
  
  const advanceTimersByTime = (ms: number) => {
    vi.advanceTimersByTime(ms);
  };
  
  const advanceTimersToNextTimer = () => {
    vi.runOnlyPendingTimers();
  };
  
  const resetTimer = () => {
    vi.useRealTimers();
  };
  
  return { advanceTimersByTime, advanceTimersToNextTimer, resetTimer };
}

/**
 * Create a mock for window.fetch that returns customizable responses
 */
export function mockFetch(responseData: any = {}, status = 200) {
  return vi.spyOn(global, 'fetch').mockImplementation(
    () =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(responseData),
        text: () => Promise.resolve(JSON.stringify(responseData)),
      }) as Promise<Response>
  );
}
