
import React from 'react';
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import router from './routes';

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
