
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ResponsiveSystemPage from './pages/ResponsiveSystemPage';
import VisualStatesSystemPage from './pages/VisualStatesSystemPage';
import { NotFound } from './pages/not-found';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><ResponsiveSystemPage /></Layout>,
  },
  {
    path: '/visual-states',
    element: <Layout><VisualStatesSystemPage /></Layout>,
  },
  {
    path: '/projects',
    element: <Layout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Projects</h1></div></Layout>,
  },
  {
    path: '/wireframes',
    element: <Layout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Wireframes</h1></div></Layout>,
  },
  {
    path: '/settings',
    element: <Layout><div className="container mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Settings</h1></div></Layout>,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
