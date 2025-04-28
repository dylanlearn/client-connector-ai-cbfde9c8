
import { QueryClient } from '@tanstack/react-query';

// Create a centralized QueryClient instance to avoid multiple instances
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false, // Prevents unnecessary refetches
      refetchOnReconnect: 'always',
      gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime in v5)
    },
  },
});
