
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';

export interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      {children}
      <Toaster />
    </BrowserRouter>
  );
};
