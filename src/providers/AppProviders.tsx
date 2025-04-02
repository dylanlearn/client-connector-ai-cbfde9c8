
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface AppProvidersProps {
  children: ReactNode;
  /**
   * Options for configuring the QueryClient
   */
  queryClientOptions?: {
    /**
     * Default stale time for queries in milliseconds
     * @default 5 * 60 * 1000 (5 minutes)
     */
    defaultStaleTime?: number;
    /**
     * Default cache time for queries in milliseconds
     * @default 10 * 60 * 1000 (10 minutes)
     */
    defaultCacheTime?: number;
    /**
     * Whether to retry failed queries
     * @default true
     */
    retryOnError?: boolean;
  };
}

/**
 * Application-wide providers wrapper component
 * Centralizes all context providers for better organization and testability
 */
export const AppProviders = ({ 
  children,
  queryClientOptions = {}
}: AppProvidersProps) => {
  const { 
    defaultStaleTime = 5 * 60 * 1000, // 5 minutes
    defaultCacheTime = 10 * 60 * 1000, // 10 minutes
    retryOnError = true
  } = queryClientOptions;
  
  // Create a client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: defaultStaleTime,
        gcTime: defaultCacheTime,
        retry: retryOnError,
        refetchOnWindowFocus: true,
      },
    },
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster />
        <SonnerToaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
};
