
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthLayout } from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ResponsiveSystemPage from './pages/ResponsiveSystemPage';
import VisualStatesSystemPage from './pages/VisualStatesSystemPage';
import { NotFound } from './pages/not-found';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SignupConfirmation from './pages/SignupConfirmation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Analytics from './pages/Analytics';
import FeedbackAnalysis from './pages/FeedbackAnalysis';
import AIDesignSuggestions from './pages/AIDesignSuggestions';
import WireframeGenerator from './pages/wireframe-generator';
import DesignProcessPage from './pages/DesignProcessPage';
import ClientHub from './pages/ClientHub';

// Create a unified router with all routes
const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <Layout><ResponsiveSystemPage /></Layout>,
  },
  {
    path: '/visual-states',
    element: <Layout><VisualStatesSystemPage /></Layout>,
  },
  {
    path: '/home',
    element: <Home />,
  },

  // Auth routes
  {
    path: '/login',
    element: <AuthLayout><LoginPage /></AuthLayout>,
  },
  {
    path: '/register',
    element: <AuthLayout><RegisterPage /></AuthLayout>,
  },
  {
    path: '/signup/confirmation',
    element: <AuthLayout><SignupConfirmation /></AuthLayout>,
  },
  {
    path: '/signup',
    element: <Navigate to="/register" replace />,
  },

  // Dashboard routes
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/projects',
    element: <Layout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Projects</h1></div></Layout>,
  },
  {
    path: '/wireframes',
    element: <Layout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Wireframes</h1></div></Layout>,
  },
  {
    path: '/wireframe-generator',
    element: <WireframeGenerator />,
  },
  {
    path: '/clients',
    element: <Clients />,
  },
  {
    path: '/client-hub',
    element: <ClientHub />,
  },
  {
    path: '/analytics',
    element: <Analytics />,
  },
  {
    path: '/feedback-analysis',
    element: <FeedbackAnalysis />,
  },
  {
    path: '/design-process',
    element: <DesignProcessPage />, // The provider is now in AppProviders
  },
  {
    path: '/ai-suggestions',
    element: <AIDesignSuggestions />,
  },
  {
    path: '/settings',
    element: <Layout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Settings</h1></div></Layout>,
  },

  // Not found
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
