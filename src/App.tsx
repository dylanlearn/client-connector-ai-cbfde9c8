
import React from 'react';
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import router from './routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from './providers/QueryProvider';
import { ProfileProvider } from './contexts/ProfileContext';

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>
          <ProfileProvider>
            <TooltipProvider>
              <RouterProvider router={router} />
              <Toaster />
            </TooltipProvider>
          </ProfileProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
