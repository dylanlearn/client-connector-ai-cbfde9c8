
import { useEffect } from 'react';
import { initializeComponentRegistry } from './index';

export function useComponentRegistry() {
  useEffect(() => {
    initializeComponentRegistry();
  }, []);
}

const ComponentRegistration = () => {
  useComponentRegistry();
  return null;
};

export { ComponentRegistration };
