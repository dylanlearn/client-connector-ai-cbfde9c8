
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import WireframeStudioPage from './pages/WireframeStudioPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WireframeStudioPage />} />
      <Route path="/wireframe-studio" element={<WireframeStudioPage />} />
      <Route path="/wireframe-studio/:projectId" element={<WireframeStudioPage />} />
      <Route path="/project/:projectId/wireframe-studio" element={<WireframeStudioPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
