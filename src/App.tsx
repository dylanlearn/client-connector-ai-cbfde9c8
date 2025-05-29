
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

// Import pages with consistent lowercase casing for index
import HomePage from '@/pages/index';  // Changed from Index to index
import PerformanceMonitoringPage from '@/pages/performance-monitoring';
import ClientsPage from '@/pages/Clients';
import DashboardPage from '@/pages/Dashboard';
import AnalyticsPage from '@/pages/Analytics';
import AIDesignSuggestions from '@/pages/AIDesignSuggestions';
import IntakePage from '@/pages/intake';
import ClientAccess from '@/pages/ClientAccess';
import ClientHubPage from '@/pages/ClientHub';
import LoginPage from '@/pages/Login';
import SettingsPage from '@/pages/Settings';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RegisterPage from '@/pages/RegisterPage';
import WebsiteAnalyzer from '@/pages/design-analysis/WebsiteAnalyzer';
import NotFoundPage from '@/pages/NotFound';
import CollaborativeDocumentPage from '@/pages/CollaborativeDocumentPage';
import SignupConfirmation from '@/pages/SignupConfirmation';
import DesignPicker from '@/pages/DesignPicker';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/client-access" element={<ClientAccess />} />
        <Route path="/signup-confirmation" element={<SignupConfirmation />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wireframe-editor" element={<DesignPicker />} />
          <Route path="/wireframe-generator" element={<DesignPicker />} />
          <Route path="/performance-monitoring" element={<PerformanceMonitoringPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/ai-suggestions" element={<AIDesignSuggestions />} />
          <Route path="/intake-form" element={<IntakePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/website-analyzer" element={<WebsiteAnalyzer />} />
          <Route path="/collaborative-document" element={<CollaborativeDocumentPage />} />
          <Route path="/design-picker" element={<DesignPicker />} />
        </Route>
        
        {/* Client Hub Route - Special case as it may need a specific auth check */}
        <Route path="/client-hub" element={<ClientHubPage />} />
        
        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
