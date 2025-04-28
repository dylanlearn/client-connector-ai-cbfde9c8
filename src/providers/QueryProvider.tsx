import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// This provider is now deprecated - we've moved the QueryClientProvider to AppProviders.tsx
// Keeping this file to prevent import breaks, but it should not be used directly

interface QueryProviderProps {
  children: React.ReactNode;
}

// Reusing the queryClient from AppProviders to avoid creating multiple instances
import { queryClient } from '@/lib/react-query';

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  console.warn('QueryProvider is deprecated. AppProviders now includes the QueryClientProvider');
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
