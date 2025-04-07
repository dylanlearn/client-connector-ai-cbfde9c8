
import { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Global providers for the entire application
 * Sets up query client and other global contexts
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
};
