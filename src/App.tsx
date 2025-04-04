
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import Projects from '@/pages/Projects';
import Settings from '@/pages/Settings';
import IntakeForm from '@/pages/IntakeForm';
import QuestionnaireResults from '@/pages/QuestionnaireResults';
import Index from '@/pages/Index';
import './App.css';
import { AppProviders } from '@/providers/AppProviders';

function App() {
  return (
    <AppProviders>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="projects" element={<Projects />} />
          <Route path="settings" element={<Settings />} />
          <Route path="intake" element={<IntakeForm />} />
          <Route path="results" element={<QuestionnaireResults />} />
        </Routes>
      </Layout>
      <Toaster />
    </AppProviders>
  );
}

export default App;
