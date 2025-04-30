
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PerformanceMonitoringProvider } from '@/components/performance/PerformanceMonitoringProvider';

// Import your pages - using direct import without aliasing to avoid case sensitivity issues
import Home from '../src/pages/index'; // Import directly without using alias
import WireframeGeneratorPage from '@/pages/wireframe-generator';
import PerformanceMonitoringPage from '@/pages/performance-monitoring';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceMonitoringProvider enabled={true}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wireframe-editor" element={<WireframeGeneratorPage />} />
          <Route path="/performance-monitoring" element={<PerformanceMonitoringPage />} />
        </Routes>
        <Toaster />
      </PerformanceMonitoringProvider>
    </QueryClientProvider>
  );
}

export default App;
