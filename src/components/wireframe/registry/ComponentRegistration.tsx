
import React, { useEffect } from 'react';
import { initializeComponentRegistry } from './register-components';

export const ComponentRegistration: React.FC = () => {
  useEffect(() => {
    // Register all components when the component mounts
    initializeComponentRegistry();
    console.log('All wireframe components registered successfully');
  }, []);

  // This component doesn't render anything visible
  return null;
};
