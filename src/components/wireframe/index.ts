
// Re-export specific types and functions without duplication
export * from './renderers/ComponentRenderer';
export * from './WireframeFlow';

// Export components that were missing
export { default as WireframeVisualizer } from './WireframeVisualizer';
export { default as WireframeDataVisualizer } from './WireframeDataVisualizer';
export { default as AdvancedWireframeGenerator } from './AdvancedWireframeGenerator';

// Only export specific functions from component-registry to avoid ambiguous exports
export { 
  registerComponent,
  getAllComponentDefinitions,
  getComponentDefinition
} from './registry/component-registry';

// Export types from component-types using 'export type' syntax for isolatedModules
export type { 
  ComponentField,
  ComponentVariant,
  ComponentDefinition,
  ComponentLibrary,
  StyleConfig,
  ResponsiveConfig
} from './registry/component-types';

// Export device breakpoints and utilities as values
export { 
  deviceBreakpoints,
  getDeviceStyles,
  styleOptionsToTailwind
} from './registry/component-types';

// Initialize the component registry
export { initializeComponentRegistry } from './registry/register-components';
