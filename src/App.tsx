
import React from 'react';
import { GlobalErrorBoundary } from './components/error-handling/GlobalErrorBoundary';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { useEffect } from 'react';
import { initializeErrorHandling } from '@/utils/monitoring/error-handling';
import { ClientErrorLogger } from '@/utils/monitoring/client-error-logger';
import router from '@/routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { AIProvider } from '@/contexts/ai/ai-provider';

// Create a simple QueryClient for React Query
import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient();

function App() {
  // Initialize error handling on mount
  useEffect(() => {
    initializeErrorHandling();
    ClientErrorLogger.initialize();
    
    // Clean up on unmount
    return () => {
      ClientErrorLogger.cleanup();
    };
  }, []);

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <AIProvider>
            <RouterProvider router={router} />
            <Toaster />
            <SonnerToaster position="top-right" closeButton richColors />
          </AIProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
