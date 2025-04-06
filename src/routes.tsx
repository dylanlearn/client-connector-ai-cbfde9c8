
import { createBrowserRouter } from "react-router-dom";
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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
