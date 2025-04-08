
import { ComponentDefinition } from './component-types';
import { v4 as uuidv4 } from 'uuid';

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

/**
 * Create a section instance based on component type and variant
 */
export function createSectionInstance(componentType: string, variantId?: string): any {
  const definition = getComponentDefinition(componentType);
  if (!definition) return null;
  
  // Find variant or use first available
  const variant = variantId 
    ? definition.variants.find(v => v.id === variantId) 
    : (definition.variants.length > 0 ? definition.variants[0] : null);
  
  if (!variant) {
    console.warn(`No variant found for component type ${componentType} with variant ID ${variantId}`);
    return null;
  }
  
  // Create section instance with sensible defaults
  return {
    id: uuidv4(),
    name: definition.name,
    sectionType: definition.type,
    description: definition.description,
    components: [],
    layout: { type: 'flex', direction: 'column' },
    // Add variant specific content if available
    ...(variant.defaultContent ? { content: variant.defaultContent } : {}),
    componentVariant: variant.id
  };
}

export type { ComponentDefinition };
