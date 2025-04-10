
import React from 'react';
import Layout from '@/components/layout/Layout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import PricingPage from '@/pages/PricingPage';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import WireframeStudioPage from '@/pages/WireframeStudioPage';
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import { useAuth } from '@/hooks/useAuth';
import { Toast } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { LandingPage } from '@/pages/LandingPage';
import { DocsPage } from '@/pages/DocsPage';
import { HelpPage } from '@/pages/HelpPage';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import DesignCanvasPage from './pages/design-canvas/DesignCanvasPage';
import { RouterProvider } from 'react-router-dom';
import router from './routes';

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
