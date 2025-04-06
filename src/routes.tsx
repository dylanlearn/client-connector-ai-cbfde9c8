import { createBrowserRouter } from "react-router-dom";
import DesignProcessProvider from "./contexts/design-process/DesignProcessProvider";
import DesignProcessPage from "./pages/DesignProcessPage";

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
