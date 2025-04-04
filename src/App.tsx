
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Settings from '@/pages/Settings';
import IntakeForm from '@/pages/IntakeForm';
import QuestionnaireResults from '@/pages/QuestionnaireResults';
import ClientHub from '@/pages/ClientHub';
import ClientAccess from '@/pages/ClientAccess';
import AdminPanel from '@/pages/AdminPanel';
import DesignPicker from '@/pages/DesignPicker';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import AIDesignSuggestions from '@/pages/AIDesignSuggestions';
import FeedbackAnalysisPage from '@/pages/FeedbackAnalysisPage';
import WebsiteAnalyzer from '@/pages/design-analysis/WebsiteAnalyzer';
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
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="intake-form" element={<IntakeForm />} />
          <Route path="results" element={<QuestionnaireResults />} />
          <Route path="client-hub" element={<ClientHub />} />
          <Route path="client-access" element={<ClientAccess />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="design-picker" element={<DesignPicker />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="ai-suggestions" element={<AIDesignSuggestions />} />
          <Route path="feedback-analysis" element={<FeedbackAnalysisPage />} />
          <Route path="website-analyzer" element={<WebsiteAnalyzer />} />
        </Routes>
      </Layout>
      <Toaster />
    </AppProviders>
  );
}

export default App;
