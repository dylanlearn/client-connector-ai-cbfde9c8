
import { ComponentDefinition } from './component-types';

// Store for registered component types
const componentRegistry: Record<string, ComponentDefinition> = {};

/**
 * Register a component type in the registry
 */
export function registerComponent(component: ComponentDefinition): void {
  if (!component || !component.type) {
    console.error('Invalid component definition provided to registerComponent');
    return;
  }
  
  componentRegistry[component.type] = component;
  console.log(`Registered component type: ${component.type}`);
}

/**
 * Get a component definition from the registry by type
 */
export function getComponentDefinition(type: string): ComponentDefinition | null {
  return componentRegistry[type] || null;
}

/**
 * Get all registered component definitions
 */
export function getAllComponentDefinitions(): ComponentDefinition[] {
  return Object.values(componentRegistry);
}

/**
 * Get a component variant from a component type
 */
export function getComponentVariant(componentType: string, variantId: string): any {
  const definition = getComponentDefinition(componentType);
  if (!definition || !definition.variants) return null;
  
  return definition.variants.find(v => v.id === variantId) || null;
}

export type { ComponentDefinition };
