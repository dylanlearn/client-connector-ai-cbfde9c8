
import { registerComponent } from './component-registry';
import { defaultComponents } from './default-components';

/**
 * Initialize and register all default components
 */
export const initializeComponentRegistry = () => {
  defaultComponents.forEach(component => {
    registerComponent(component);
  });
  
  console.log('Wireframe component registry initialized with default components');
};
