
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/dashboard';
import { Settings } from './pages/settings';
import { NotFound } from './pages/not-found';
import { ProjectDetailPage } from './pages/project-detail/ProjectDetailPage';
import AdvancedWireframeGeneratorPage from './pages/project-detail/AdvancedWireframeGeneratorPage';

export const router = createBrowserRouter([
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
