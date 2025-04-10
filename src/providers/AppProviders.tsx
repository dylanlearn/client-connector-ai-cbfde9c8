
import { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';

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
      <AuthProvider>
        <ProfileProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ProfileProvider>
      </AuthProvider>
    </QueryProvider>
  );
};

