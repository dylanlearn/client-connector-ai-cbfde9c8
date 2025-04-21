
import { Route } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load components to improve initial load performance
const ResponsiveWireframeEnhancements = lazy(() => import('./ResponsiveWireframeEnhancements'));
const ResponsiveEnhancementsDashboard = lazy(() => import('./ResponsiveEnhancementsDashboard'));

export const wireframeRoutes = (
  <>
    <Route path="/wireframe-enhancements" element={<ResponsiveWireframeEnhancements />} />
    <Route path="/wireframe-dashboard" element={<ResponsiveEnhancementsDashboard />} />
  </>
);

export default wireframeRoutes;
