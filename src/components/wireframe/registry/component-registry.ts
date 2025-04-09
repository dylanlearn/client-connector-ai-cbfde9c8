
import { ComponentDefinition } from './component-types';
import { v4 as uuidv4 } from 'uuid';
import { DeviceType } from '@/components/wireframe/utils/responsive-utils';

// Store for registered component types
const componentRegistry: Record<string, ComponentDefinition> = {};

// Store for component transformers (to transform components for different devices)
const componentTransformers: Record<string, (component: any, device: DeviceType) => any> = {};

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
 * Register a component transformer function
 */
export function registerComponentTransformer(
  componentType: string, 
  transformer: (component: any, device: DeviceType) => any
): void {
  componentTransformers[componentType] = transformer;
  console.log(`Registered component transformer for: ${componentType}`);
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
 * Get all component definitions by category
 */
export function getComponentsByCategory(category: string): ComponentDefinition[] {
  return Object.values(componentRegistry).filter(comp => comp.category === category);
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
    componentVariant: variant.id,
    // Add responsive data
    responsive: {
      mobile: { visible: true },
      tablet: { visible: true },
      desktop: { visible: true }
    }
  };
}

/**
 * Transform component for a specific device type
 */
export function transformComponentForDevice(component: any, device: DeviceType): any {
  if (!component || !component.sectionType) return component;
  
  const transformer = componentTransformers[component.sectionType];
  if (!transformer) return component;
  
  return transformer(component, device);
}

/**
 * Get all component categories
 */
export function getAllComponentCategories(): string[] {
  const categories = new Set<string>();
  
  Object.values(componentRegistry).forEach(comp => {
    if (comp.category) {
      categories.add(comp.category);
    }
  });
  
  return Array.from(categories);
}

/**
 * Register multiple components at once
 */
export function registerComponents(components: ComponentDefinition[]): void {
  components.forEach(component => registerComponent(component));
}

/**
 * Check if a component type is registered
 */
export function isComponentRegistered(type: string): boolean {
  return !!componentRegistry[type];
}

export type { ComponentDefinition };
