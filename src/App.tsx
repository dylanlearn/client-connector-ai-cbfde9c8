
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PerformanceMonitoringProvider } from '@/components/performance/PerformanceMonitoringProvider';

// Import your pages
import Home from './pages/index';
import WireframeGeneratorPage from './pages/wireframe-generator';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceMonitoringProvider enabled={true}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wireframe-editor" element={<WireframeGeneratorPage />} />
        </Routes>
        <Toaster />
      </PerformanceMonitoringProvider>
    </QueryClientProvider>
  );
}

export default App;
