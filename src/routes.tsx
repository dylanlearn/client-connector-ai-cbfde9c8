
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
import WebsiteAnalyzer from './pages/design-analysis/WebsiteAnalyzer';

// Create a unified router with all routes
const router = createBrowserRouter([
  // Landing page (home)
  {
    path: '/',
    element: <Home />,
  },
  
  // System pages
  {
    path: '/responsive-system',
    element: <Layout><ResponsiveSystemPage /></Layout>,
  },
  {
    path: '/visual-states',
    element: <Layout><VisualStatesSystemPage /></Layout>,
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
    element: <DashboardLayout><Dashboard /></DashboardLayout>,
  },
  {
    path: '/projects',
    element: <DashboardLayout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Projects</h1></div></DashboardLayout>,
  },
  {
    path: '/wireframes',
    element: <DashboardLayout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Wireframes</h1></div></DashboardLayout>,
  },
  {
    path: '/wireframe-generator',
    element: <DashboardLayout><WireframeGenerator /></DashboardLayout>,
  },
  {
    path: '/clients',
    element: <DashboardLayout><Clients /></DashboardLayout>,
  },
  {
    path: '/client-hub',
    element: <DashboardLayout><ClientHub /></DashboardLayout>,
  },
  {
    path: '/analytics',
    element: <DashboardLayout><Analytics /></DashboardLayout>,
  },
  {
    path: '/feedback-analysis',
    element: <DashboardLayout><FeedbackAnalysis /></DashboardLayout>,
  },
  {
    path: '/design-process',
    element: <DashboardLayout><DesignProcessPage /></DashboardLayout>,
  },
  {
    path: '/ai-suggestions',
    element: <DashboardLayout><AIDesignSuggestions /></DashboardLayout>,
  },
  {
    path: '/website-analyzer',
    element: <DashboardLayout><WebsiteAnalyzer /></DashboardLayout>,
  },
  {
    path: '/settings',
    element: <DashboardLayout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Settings</h1></div></DashboardLayout>,
  },

  // Not found
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
