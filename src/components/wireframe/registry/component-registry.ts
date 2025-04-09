
import { DeviceType } from '@/components/wireframe/preview/DeviceInfo';
import { ComponentDefinition, ComponentVariant } from './component-types';
import { v4 as uuidv4 } from 'uuid';

export type { ComponentDefinition, ComponentVariant };

export interface ComponentRegistryProps {
  deviceType?: DeviceType;
}

// Store for all registered components
const componentRegistry: Record<string, ComponentDefinition> = {};

/**
 * Register a component with the registry
 */
export function registerComponent(component: ComponentDefinition): void {
  if (!component || !component.type) {
    console.error('Invalid component definition', component);
    return;
  }
  
  componentRegistry[component.type] = component;
  console.log(`Component registered: ${component.name} (${component.type})`);
}

/**
 * Get all registered component definitions
 */
export function getAllComponentDefinitions(): ComponentDefinition[] {
  return Object.values(componentRegistry);
}

/**
 * Get a specific component definition by type
 */
export function getComponentDefinition(type: string): ComponentDefinition | null {
  return componentRegistry[type] || null;
}

/**
 * Create a new section instance with default data
 */
export function createSectionInstance(componentType: string, variantId?: string): any {
  const componentDef = getComponentDefinition(componentType);
  if (!componentDef) return null;
  
  // Find the requested variant or use the first one
  let variant: ComponentVariant | undefined;
  if (variantId && componentDef.variants) {
    variant = componentDef.variants.find(v => v.id === variantId);
  }
  
  if (!variant && componentDef.variants && componentDef.variants.length > 0) {
    variant = componentDef.variants[0];
  }
  
  return {
    id: uuidv4(),
    type: componentType,
    componentVariant: variant?.id || null,
    ...componentDef.defaultData,
  };
}

// Export ComponentRegistry for any components that need it
const ComponentRegistry = () => {
  return null;
};

export default ComponentRegistry;
