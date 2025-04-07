
import { createBrowserRouter, matchPath } from "react-router-dom";
import DesignProcessProvider from "./contexts/design-process/DesignProcessProvider";
import DesignProcessPage from "./pages/DesignProcessPage";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import { Settings } from "./pages/settings";
import { ProjectDetailPage } from "./pages/project-detail/ProjectDetailPage";
import AdvancedWireframeGeneratorPage from "./pages/project-detail/AdvancedWireframeGeneratorPage";
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

// Define type augmentation for window object
interface WindowWithAdminRoutes extends Window {
  checkAdminRoutes?: () => void;
}

// Add debug helper
if (typeof window !== 'undefined') {
  (window as WindowWithAdminRoutes).checkAdminRoutes = () => {
    console.log('Admin routes check:');
    const adminRoutes = ['/admin', '/admin/analytics', '/admin/supabase-audit', '/admin/audit-and-monitoring'];
    adminRoutes.forEach(route => {
      console.log(`Can access ${route}:`, matchPath(route, window.location.pathname));
    });
  };
}

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
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
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
        path: '/project/:projectId/advanced-wireframe',
        element: <ProtectedRoute><AdvancedWireframeGeneratorPage /></ProtectedRoute>,
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
        path: '/admin',
        element: <ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>,
      },
      {
        path: '/admin/analytics',
        element: <ProtectedRoute adminOnly={true}><AdminAnalytics /></ProtectedRoute>,
      },
      {
        path: '/admin/supabase-audit',
        element: <ProtectedRoute adminOnly={true}><AdminAnalytics /></ProtectedRoute>,
      },
      {
        path: '/admin/audit-and-monitoring',
        element: <ProtectedRoute adminOnly={true}><AdminAnalytics /></ProtectedRoute>,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
