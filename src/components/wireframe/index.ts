
// Re-export specific types and functions without duplication
export * from './renderers/ComponentRenderer';
export * from './WireframeVisualizer';
export * from './WireframeFlow';
export * from './WireframeDataVisualizer';
export * from './WireframeEditor';
export * from './AdvancedWireframeGenerator';

// Only export specific types from component-registry to avoid ambiguous exports
export { 
  registerComponent,
  getComponentDefinition,
  getComponentVariant,
  getAllComponentDefinitions
} from './registry/component-registry';

// Export types from component-types directly
export {
  ComponentField,
  ComponentVariant,
  ComponentDefinition,
  ComponentLibrary,
  StyleConfig,
  ResponsiveConfig,
  deviceBreakpoints,
  getDeviceStyles,
  styleOptionsToTailwind
} from './registry/component-types';

// Initialize the component registry
export { initializeComponentRegistry } from './registry/register-components';
