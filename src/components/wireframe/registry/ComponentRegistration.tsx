
import React, { useEffect } from 'react';
import { defaultComponents } from './default-components';
import { registerComponent } from './component-registry';

/**
 * Component that registers all default components
 * This should be mounted near the root of the application
 */
export function ComponentRegistration() {
  useEffect(() => {
    // Register all default components
    defaultComponents.forEach(component => {
      registerComponent(component);
    });
    
    console.log('Registered default components:', defaultComponents.length);
  }, []);
  
  // This is a utility component that doesn't render anything
  return null;
}

/**
 * Hook to ensure components are registered
 */
export function useComponentRegistry() {
  useEffect(() => {
    // Register all default components if not already registered
    defaultComponents.forEach(component => {
      registerComponent(component);
    });
  }, []);
}
