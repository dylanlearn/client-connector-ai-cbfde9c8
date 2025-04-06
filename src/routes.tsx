
import { createBrowserRouter } from "react-router-dom";
import DesignProcessProvider from "./contexts/design-process/DesignProcessProvider";
import DesignProcessPage from "./pages/DesignProcessPage";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import { Settings } from "./pages/settings";
import { ProjectDetailPage } from "./pages/project-detail/ProjectDetailPage";
import AdvancedWireframeGeneratorPage from "./pages/project-detail/AdvancedWireframeGeneratorPage";
import NotFound from "./pages/NotFound";

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
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/project/:projectId',
        element: <ProjectDetailPage />,
      },
      {
        path: '/project/:projectId/advanced-wireframe',
        element: <AdvancedWireframeGeneratorPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
