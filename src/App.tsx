import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
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

// Add the new import for DesignCanvasPage
import DesignCanvasPage from './pages/design-canvas/DesignCanvasPage';

function App() {
  const { isLoggedIn, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Router>
        <Routes>
          <Route path="/" element={<SiteLayout><LandingPage /></SiteLayout>} />
          <Route path="/pricing" element={<SiteLayout><PricingPage /></SiteLayout>} />
          <Route path="/docs" element={<SiteLayout><DocsPage /></SiteLayout>} />
          <Route path="/help" element={<SiteLayout><HelpPage /></SiteLayout>} />
          <Route path="/terms" element={<SiteLayout><TermsPage /></SiteLayout>} />
          <Route path="/privacy" element={<SiteLayout><PrivacyPage /></SiteLayout>} />
          
          <Route
            path="/login"
            element={
              <AuthLayout>
                {isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />}
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                {isLoggedIn ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
              </AuthLayout>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <DashboardPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isLoggedIn ? (
                <SettingsPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/project/:projectId"
            element={
              isLoggedIn ? (
                <ProjectDetailsPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/wireframe/:projectId?"
            element={
              isLoggedIn ? (
                <WireframeStudioPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          {/* Public routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
          {/* Development routes */}
          <Route
            path="/dev"
            element={
              
                <div className="container mx-auto p-4">
                  <h1 className="text-3xl font-bold">Development Playground</h1>
                  <p className="text-muted-foreground">
                    This is a development playground for testing components and features.
                  </p>
                  
                  <div className="mt-4">
                    <Toast />
                  </div>
                </div>
              
            }
          />
          
          {/* Add the new route for DesignCanvasPage */}
          <Route
            path="/design-canvas/:id?"
            element={<DesignCanvasPage />}
          />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
