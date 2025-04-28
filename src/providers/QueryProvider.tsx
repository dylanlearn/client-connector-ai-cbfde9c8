import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// This provider is now deprecated - we've moved the QueryClientProvider to AppProviders.tsx
// Keeping this file to prevent import breaks, but it should not be used directly

interface QueryProviderProps {
  children: React.ReactNode;
}

// Create a client - this is now duplicate and should use the one in AppProviders instead
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      gcTime: 5 * 60 * 1000,
    },
  },
});

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  console.warn('QueryProvider is deprecated. AppProviders now includes the QueryClientProvider');
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
