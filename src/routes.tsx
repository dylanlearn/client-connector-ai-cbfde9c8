
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthLayout } from './components/layout/AuthLayout';
import ResponsiveWireframeEnhancements from './pages/wireframe/ResponsiveWireframeEnhancements';
import ResponsiveEnhancementsDashboard from './pages/wireframe/ResponsiveEnhancementsDashboard';
import WireframeEditorDemo from './pages/WireframeEditorDemo';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SignupConfirmation from './pages/SignupConfirmation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
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
import SupabaseAuditDashboard from './pages/admin/SupabaseAuditDashboard';
import { MonitoringDashboard } from './components/admin/monitoring';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ResponsiveSystemPage from './pages/ResponsiveSystemPage';
import VisualStatesSystemPage from './pages/VisualStatesSystemPage';
import DesignPicker from './pages/DesignPicker';
import IntakeForm from './pages/IntakeForm';

// Create a unified router with all routes
const router = createBrowserRouter([
  // Landing page (home)
  {
    path: '/',
    element: <Home />,
  },
  
  // Wireframe routes
  {
    path: '/wireframe-enhancements',
    element: <Layout><ResponsiveWireframeEnhancements /></Layout>,
  },
  {
    path: '/wireframe-dashboard',
    element: <Layout><ResponsiveEnhancementsDashboard /></Layout>,
  },
  {
    path: '/wireframe-editor-demo',
    element: <Layout><WireframeEditorDemo /></Layout>,
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
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
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
    element: <ProtectedRoute><WireframeGenerator /></ProtectedRoute>,
  },
  {
    path: '/clients',
    element: <ProtectedRoute><Clients /></ProtectedRoute>,
  },
  {
    path: '/client-hub',
    element: <ProtectedRoute><ClientHub /></ProtectedRoute>,
  },
  {
    path: '/analytics',
    element: <ProtectedRoute><Analytics /></ProtectedRoute>,
  },
  {
    path: '/feedback-analysis',
    element: <ProtectedRoute><FeedbackAnalysis /></ProtectedRoute>,
  },
  {
    path: '/design-process',
    element: <ProtectedRoute><DesignProcessPage /></ProtectedRoute>,
  },
  {
    path: '/ai-suggestions',
    element: <ProtectedRoute><AIDesignSuggestions /></ProtectedRoute>,
  },
  {
    path: '/website-analyzer',
    element: <ProtectedRoute><WebsiteAnalyzer /></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: '/design-picker',
    element: <ProtectedRoute><DesignPicker /></ProtectedRoute>,
  },
  {
    path: '/intake-form',
    element: <ProtectedRoute><IntakeForm /></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>,
  },
  // Admin routes
  {
    path: '/admin/supabase-audit',
    element: <ProtectedRoute adminOnly={true}><SupabaseAuditDashboard /></ProtectedRoute>,
  },
  {
    path: '/admin/audit-and-monitoring',
    element: <ProtectedRoute adminOnly={true}>
      <DashboardLayout>
        <div className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">System Audit & Monitoring</h1>
          <MonitoringDashboard />
        </div>
      </DashboardLayout>
    </ProtectedRoute>,
  },
  {
    path: '/admin/analytics',
    element: <ProtectedRoute adminOnly={true}><AdminAnalytics /></ProtectedRoute>,
  },
  {
    path: '/user/profile',
    element: <ProtectedRoute><DashboardLayout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">User Profile</h1></div></DashboardLayout></ProtectedRoute>,
  },

  // Not found
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
