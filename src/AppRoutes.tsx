import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdvancedWireframeGeneratorPage from './pages/project-detail/AdvancedWireframeGeneratorPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/project/:projectId/advanced-wireframe" replace />} />
      <Route path="/project/:projectId/advanced-wireframe" element={<AdvancedWireframeGeneratorPage />} />
      {/* Keep any other existing routes */}
    </Routes>
  );
};

export default AppRoutes;
