
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdvancedWireframeGeneratorPage from './pages/project-detail/AdvancedWireframeGeneratorPage';
import WireframeGenerator from './pages/wireframe-generator';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WireframeGenerator />} />
      <Route path="/wireframe" element={<WireframeGenerator />} />
      <Route path="/project/:projectId/advanced-wireframe" element={<AdvancedWireframeGeneratorPage />} />
      {/* Keep any other existing routes */}
    </Routes>
  );
};

export default AppRoutes;
