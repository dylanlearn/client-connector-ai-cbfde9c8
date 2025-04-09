
import { createBrowserRouter, matchPath } from "react-router-dom";
import { DesignProcessProvider } from "@/contexts/design-process/DesignProcessProvider";
import DesignProcessPage from "./pages/DesignProcessPage";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import { Settings } from "./pages/settings";
import { ProjectDetailPage } from "./pages/project-detail/ProjectDetailPage";
import NotFound from "./pages/NotFound";
import DesignPicker from "./pages/DesignPicker";
import Login from "./pages/Login";
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
import Index from "./pages/Index";

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

const demoProjectId = getDemoProjectId();

const router = createBrowserRouter([
  {
    path: "/design-process",
    element: (
      <DesignProcessProvider>
        <DesignProcessPage />
      </DesignProcessProvider>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: '/settings',
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
      {
        path: '/projects',
        element: <ProtectedRoute><Projects /></ProtectedRoute>,
      },
      {
        path: '/project/:projectId',
        element: <ProtectedRoute><ProjectDetailPage /></ProtectedRoute>,
      },
      {
        path: '/project/:projectId/wireframe-studio',
        element: <ProtectedRoute><WireframeStudioPage /></ProtectedRoute>,
      },
      {
        path: '/wireframe-studio',
        element: <WireframeStudioPage />,
      },
      {
        path: '/wireframe-studio/:projectId',
        element: <WireframeStudioPage />,
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
        path: '/website-analyzer',
        element: <ProtectedRoute><WebsiteAnalyzer /></ProtectedRoute>,
      },
      {
        path: '/feedback-analysis',
        element: <ProtectedRoute><FeedbackAnalysis /></ProtectedRoute>,
      },
      {
        path: '/ai-suggestions',
        element: <ProtectedRoute><AIDesignSuggestions /></ProtectedRoute>,
      },
      {
        path: '/analytics',
        element: <ProtectedRoute><Analytics /></ProtectedRoute>,
      },
      {
        path: '/clients',
        element: <ProtectedRoute><Clients /></ProtectedRoute>,
      },
      {
        path: '/admin',
        element: <AdminRoute><AdminPanel /></AdminRoute>,
      },
      {
        path: '/admin/analytics',
        element: <AdminRoute><AdminAnalytics /></AdminRoute>,
      },
      {
        path: '/admin/supabase-audit',
        element: <AdminRoute><AdminAnalytics /></AdminRoute>,
      },
      {
        path: '/admin/audit-and-monitoring',
        element: <AdminRoute><AdminAnalytics /></AdminRoute>,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
