
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResponsiveSystemPage from './pages/ResponsiveSystemPage';
import VisualStatesSystemPage from './pages/VisualStatesSystemPage';
import Layout from './components/layout/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <ResponsiveSystemPage />
          </Layout>
        } />
        <Route path="/visual-states" element={
          <Layout>
            <VisualStatesSystemPage />
          </Layout>
        } />
        <Route path="/projects" element={
          <Layout>
            <div>Projects Page</div>
          </Layout>
        } />
        <Route path="/projects/:projectId" element={
          <Layout>
            <div>Project Detail Page</div>
          </Layout>
        } />
        <Route path="/wireframes" element={
          <Layout>
            <div>Wireframes Page</div>
          </Layout>
        } />
        <Route path="/wireframes/:wireframeId" element={
          <Layout>
            <div>Wireframe Detail Page</div>
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <div>Settings Page</div>
          </Layout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
