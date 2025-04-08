
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import AdvancedWireframeGenerator from './components/wireframe/AdvancedWireframeGenerator';

function App() {
  // Generate a valid project ID for demonstration purposes
  const demoProjectId = uuidv4();
  
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
