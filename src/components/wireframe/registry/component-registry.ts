
import { v4 as uuidv4 } from 'uuid';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';

// Define component definition interface
export interface ComponentDefinition {
  id: string;
  type: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  icon?: string;
  variants?: ComponentVariant[];
  defaultProps?: Record<string, any>;
  responsiveOptions?: Record<string, any>;
}

// Define variant interface
export interface ComponentVariant {
  id: string;
  name: string;
  description?: string;
  previewImageUrl?: string;
  defaultContent?: any;
}

// Registry to store component definitions
const componentRegistry: Record<string, ComponentDefinition> = {};

// Register a component definition
export function registerComponent(component: ComponentDefinition): void {
  if (!component.id) {
    component.id = uuidv4();
  }
  
  componentRegistry[component.type] = component;
}

// Get a component definition by type
export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return componentRegistry[type];
}

// Get all registered component definitions
export function getAllComponentDefinitions(): ComponentDefinition[] {
  return Object.values(componentRegistry);
}

// Get component definitions by category
export function getComponentsByCategory(category: string): ComponentDefinition[] {
  return Object.values(componentRegistry).filter(
    (component) => component.category === category
  );
}

// Create a new instance of a component
export function createComponentInstance(type: string, variantId?: string): WireframeComponent {
  const definition = getComponentDefinition(type);
  
  if (!definition) {
    throw new Error(`Component type '${type}' not found in registry`);
  }
  
  // Find the variant if specified
  let variant = undefined;
  if (variantId && definition.variants) {
    variant = definition.variants.find((v) => v.id === variantId);
  }
  
  // Create the component instance
  const component: WireframeComponent = {
    id: uuidv4(),
    type: definition.type,
    // Use variant content if available, or default props from definition
    ...definition.defaultProps,
    ...(variant?.defaultContent || {}),
  };
  
  return component;
}

// Create a new section instance based on a component type
export function createSectionInstance(componentType: string, variantId?: string): any {
  const definition = getComponentDefinition(componentType);
  
  if (!definition) {
    throw new Error(`Component type '${componentType}' not found in registry`);
  }
  
  // Find the variant if specified
  let variant = undefined;
  if (variantId && definition.variants) {
    variant = definition.variants.find((v) => v.id === variantId);
  }
  
  // Create basic section data
  const section = {
    name: definition.name,
    description: definition.description || '',
    sectionType: componentType,
    componentVariant: variantId,
    // Ensure copySuggestions is always an array
    copySuggestions: [] as any[],
    components: [createComponentInstance(componentType, variantId)]
  };
  
  return section;
}
