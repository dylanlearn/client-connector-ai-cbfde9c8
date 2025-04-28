
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { VisualStateProvider } from '@/contexts/VisualStateContext';
import { DesignProcessProvider } from '@/contexts/design-process/DesignProcessProvider';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
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

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Global providers for the entire application
 * Sets up query client and other global contexts
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <AuthProvider>
          <VisualStateProvider>
            <DesignProcessProvider>
              <CollaborationProvider>
                {children}
                <Toaster richColors position="top-right" />
              </CollaborationProvider>
            </DesignProcessProvider>
          </VisualStateProvider>
        </AuthProvider>
      </ProfileProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
