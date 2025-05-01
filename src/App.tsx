
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PerformanceMonitoringProvider } from '@/components/performance/PerformanceMonitoringProvider';

// Import pages
import HomePage from '@/pages/index';  // Use the correct case that matches the actual file
import WireframeGeneratorPage from '@/pages/wireframe-generator';
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

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceMonitoringProvider enabled={true}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/client-access" element={<ClientAccess />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/wireframe-editor" element={<WireframeGeneratorPage />} />
            <Route path="/performance-monitoring" element={<PerformanceMonitoringPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/ai-suggestions" element={<AIDesignSuggestions />} />
            <Route path="/intake-form" element={<IntakePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          {/* Client Hub Route - Special case as it may need a specific auth check */}
          <Route path="/client-hub" element={<ClientHubPage />} />
        </Routes>
        <Toaster />
      </PerformanceMonitoringProvider>
    </QueryClientProvider>
  );
}

export default App;
