import { ComponentDefinition } from './component-registry';
import { heroComponents } from './components/hero-components';

/**
 * Default components that are registered with the wireframe editor
 */
export const defaultComponents: ComponentDefinition[] = [
  heroComponents,
  // Add other component types here as you develop them
];
