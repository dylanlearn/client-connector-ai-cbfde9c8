
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AIProvider } from '@/contexts/ai/AIProvider';
import { MemoryProvider } from '@/contexts/ai/MemoryContext';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Settings from '@/pages/Settings';
import IntakeForm from '@/pages/IntakeForm';
import QuestionnaireResults from '@/pages/QuestionnaireResults';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AIProvider>
        <MemoryProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout>{/* Layout will render Outlet */}</Layout>}>
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="settings" element={<Settings />} />
                <Route path="intake" element={<IntakeForm />} />
                <Route path="results" element={<QuestionnaireResults />} />
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </MemoryProvider>
      </AIProvider>
    </QueryClientProvider>
  );
}

export default App;
