import React from 'react';
import { GlobalErrorBoundary } from './components/error-handling/GlobalErrorBoundary';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { useEffect } from 'react';
import { initializeErrorHandling } from '@/utils/monitoring/error-handling';
import { ClientErrorLogger } from '@/utils/monitoring/client-error-logger';
import { AppRoutes } from '@/routes';
import { AuthProvider } from '@/contexts/auth/auth-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { AIProvider } from '@/contexts/ai/ai-provider';

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
          <AuthProvider>
            <AIProvider>
              <AppRoutes />
              <Toaster />
              <SonnerToaster position="top-right" closeButton richColors />
            </AIProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
