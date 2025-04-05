
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from './QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ProfileProvider } from '@/contexts/ProfileContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <ProfileProvider>
            {children}
          </ProfileProvider>
          <Toaster />
          <SonnerToaster position="top-right" />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  );
};
