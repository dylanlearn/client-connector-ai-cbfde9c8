
import React, { useEffect } from 'react';
import { initializeComponentRegistry } from './register-components';
import { registerFeedbackProcessors } from './register-feedback-processors';

export const ComponentRegistration: React.FC = () => {
  useEffect(() => {
    // Register all components when the component mounts
    initializeComponentRegistry();
    registerFeedbackProcessors();
    console.log('All wireframe components and feedback processors registered successfully');
  }, []);

  // This component doesn't render anything visible
  return null;
};
