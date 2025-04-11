
import { createBrowserRouter, matchPath } from "react-router-dom";
import { DesignProcessProvider } from "@/contexts/design-process/DesignProcessProvider";
import DesignProcessPage from "./pages/DesignProcessPage";
import Dashboard from "./pages/Dashboard";
import { Settings } from "./pages/settings";
import { ProjectDetailPage } from "./pages/project-detail/ProjectDetailPage";
import NotFound from "./pages/NotFound";
import DesignPicker from "./pages/DesignPicker";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import AdminPanel from "./pages/AdminPanel";
import AdminAnalytics from "./pages/AdminAnalytics";
import Projects from "./pages/Projects";
import IntakeForm from "./pages/IntakeForm";
import WebsiteAnalyzer from "./pages/design-analysis/WebsiteAnalyzer";
import FeedbackAnalysis from "./pages/FeedbackAnalysis";
import AIDesignSuggestions from "./pages/AIDesignSuggestions";
import Analytics from "./pages/Analytics";
import Clients from "./pages/Clients";
import { v4 as uuidv4 } from 'uuid';
import WireframeStudioPage from "./pages/WireframeStudioPage";
import Layout from "@/components/layout/Layout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import RegisterPage from "@/pages/RegisterPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import DesignCanvasPage from "./pages/design-canvas/DesignCanvasPage";
import { Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Header from "./components/layout/Header";

// Admin routes check function
interface WindowWithAdminRoutes extends Window {
  checkAdminRoutes?: () => void;
}

if (typeof window !== 'undefined') {
  (window as WindowWithAdminRoutes).checkAdminRoutes = () => {
    console.log('Admin routes check:');
    const adminRoutes = ['/admin', '/admin/analytics', '/admin/supabase-audit', '/admin/audit-and-monitoring'];
    adminRoutes.forEach(route => {
      console.log(`Can access ${route}:`, matchPath(route, window.location.pathname));
    });
  };
}

const getDemoProjectId = (): string => {
  const storedId = typeof localStorage !== 'undefined' ? localStorage.getItem('demoProjectId') : null;
  
  if (storedId) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(storedId)) {
      return storedId;
    }
  }
  
  const newId = uuidv4();
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('demoProjectId', newId);
  }
  return newId;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Index /></Layout>,
  },
  {
    path: "/login",
    element: <AuthLayout><Login /></AuthLayout>,
  },
  {
    path: "/register",
    element: <AuthLayout><RegisterPage /></AuthLayout>,
  },
  {
    path: "/dashboard",
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: "/settings",
    element: <Layout><Settings /></Layout>,
  },
  {
    path: "/project/:projectId",
    element: <Layout><ProjectDetailPage /></Layout>,
  },
  {
    path: "/wireframe/:projectId?",
    element: <Layout><WireframeStudioPage /></Layout>,
  },
  {
    path: "/design-canvas/:id?",
    element: <Layout><DesignCanvasPage /></Layout>,
  },
  {
    path: "/design-process",
    element: (
      <Layout>
        <DesignProcessProvider>
          <DesignProcessPage />
        </DesignProcessProvider>
      </Layout>
    ),
  },
  {
    path: '/projects',
    element: <Layout><Projects /></Layout>,
  },
  {
    path: '/project/:projectId/wireframe-studio',
    element: <Layout><WireframeStudioPage /></Layout>,
  },
  {
    path: '/wireframe-studio',
    element: <Layout><WireframeStudioPage /></Layout>,
  },
  {
    path: '/wireframe-studio/:projectId',
    element: <Layout><WireframeStudioPage /></Layout>,
  },
  {
    path: '/design-picker',
    element: <Layout><DesignPicker /></Layout>,
  },
  {
    path: '/intake-form',
    element: <Layout><IntakeForm /></Layout>,
  },
  {
    path: '/website-analyzer',
    element: <Layout><WebsiteAnalyzer /></Layout>,
  },
  {
    path: '/feedback-analysis',
    element: <Layout><FeedbackAnalysis /></Layout>,
  },
  {
    path: '/ai-suggestions',
    element: <Layout><AIDesignSuggestions /></Layout>,
  },
  {
    path: '/analytics',
    element: <Layout><Analytics /></Layout>,
  },
  {
    path: '/clients',
    element: <Layout><Clients /></Layout>,
  },
  {
    path: '/privacy',
    element: <Layout><PrivacyPage /></Layout>,
  },
  {
    path: '/admin',
    element: <AdminRoute><Layout><AdminPanel /></Layout></AdminRoute>,
  },
  {
    path: '/admin/analytics',
    element: <AdminRoute><Layout><AdminAnalytics /></Layout></AdminRoute>,
  },
  {
    path: '/admin/supabase-audit',
    element: <AdminRoute><Layout><AdminAnalytics /></Layout></AdminRoute>,
  },
  {
    path: '/admin/audit-and-monitoring',
    element: <AdminRoute><Layout><AdminAnalytics /></Layout></AdminRoute>,
  },
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
  },
]);

export default router;
