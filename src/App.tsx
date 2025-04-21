
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ResponsiveWireframeEnhancements from './pages/wireframe/ResponsiveWireframeEnhancements';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/wireframe-enhancements" replace />} />
        <Route path="/wireframe-enhancements" element={<ResponsiveWireframeEnhancements />} />
        <Route path="*" element={<Navigate to="/wireframe-enhancements" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
