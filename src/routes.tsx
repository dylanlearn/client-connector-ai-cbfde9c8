
import React from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
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
import ProtectedRoute from './components/auth/ProtectedRoute';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';

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

  // Dashboard routes (protected)
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/projects',
    element: <ProtectedRoute><DashboardLayout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Projects</h1></div></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/wireframes',
    element: <ProtectedRoute><DashboardLayout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Wireframes</h1></div></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/wireframe-generator',
    element: <ProtectedRoute><DashboardLayout><WireframeGenerator /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/clients',
    element: <ProtectedRoute><DashboardLayout><Clients /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/client-hub',
    element: <ProtectedRoute><DashboardLayout><ClientHub /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/analytics',
    element: <ProtectedRoute><DashboardLayout><Analytics /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/feedback-analysis',
    element: <ProtectedRoute><DashboardLayout><FeedbackAnalysis /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/design-process',
    element: <ProtectedRoute><DashboardLayout><DesignProcessPage /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/ai-suggestions',
    element: <ProtectedRoute><DashboardLayout><AIDesignSuggestions /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/website-analyzer',
    element: <ProtectedRoute><DashboardLayout><WebsiteAnalyzer /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>,
  },

  // Not found
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
