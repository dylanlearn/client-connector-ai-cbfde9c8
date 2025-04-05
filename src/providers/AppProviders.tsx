
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { AuthContext, AuthProvider } from '@/contexts/AuthContext';

export interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};
