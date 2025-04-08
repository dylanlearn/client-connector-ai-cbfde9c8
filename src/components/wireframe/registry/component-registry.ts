
import { v4 as uuidv4 } from 'uuid';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { ComponentField, StyleConfig, ResponsiveConfig } from './component-types';

// Define component definition interface
export interface ComponentDefinition {
  id?: string;
  type: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  icon?: string;
  variants?: ComponentVariant[];
  fields?: ComponentField[]; // Field definitions for property editors
  defaultProps?: Record<string, any>;
  defaultData?: any; // Default component data
  responsiveOptions?: Record<string, any>;
  baseStyles?: any;
  responsiveConfig?: ResponsiveConfig;
  styleConfig?: StyleConfig; // Style configuration
  editorConfig?: {
    defaultWidth?: number;
    defaultHeight?: number;
    minWidth?: number;
    minHeight?: number;
    aspectRatio?: number | null;
    resizable?: boolean;
    movable?: boolean;
  };
}

// Define variant interface
export interface ComponentVariant {
  id: string;
  name: string;
  description?: string;
  previewImageUrl?: string;
  defaultContent?: any;
  thumbnail?: string;
}

// Registry to store component definitions
const componentRegistry: Record<string, ComponentDefinition> = {};

// Register a component definition
export function registerComponent(component: ComponentDefinition): void {
  if (!component.id) {
    component.id = uuidv4();
  }
  
  // Ensure fields array exists
  if (!component.fields) {
    component.fields = [];
  }
  
  // Ensure variants array exists
  if (!component.variants) {
    component.variants = [];
  }
  
  componentRegistry[component.type] = component;
  console.log(`Registered component: ${component.name} (${component.type})`);
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
  
  // Create section data from default data
  const defaultData = definition.defaultData || {};
  
  // Create basic section data
  const section = {
    id: uuidv4(),
    name: definition.name,
    description: definition.description || '',
    sectionType: componentType,
    componentVariant: variantId,
    // Ensure copySuggestions is always an array
    copySuggestions: [] as any[],
    data: { ...defaultData, ...(variant?.defaultContent || {}) },
    components: [createComponentInstance(componentType, variantId)],
    // Add position and dimension information for canvas
    position: { x: 50, y: 50 },
    dimensions: { 
      width: definition.editorConfig?.defaultWidth || 800, 
      height: definition.editorConfig?.defaultHeight || 200 
    },
    // Add style properties
    styleProperties: {
      backgroundStyle: 'light',
      spacing: 'medium',
      alignment: 'center'
    }
  };
  
  return section;
}

// Get field definition for a component type
export function getComponentFields(type: string): ComponentField[] {
  const definition = getComponentDefinition(type);
  if (!definition || !definition.fields) {
    return [];
  }
  return definition.fields;
}

// Get style config for a component type
export function getComponentStyleConfig(type: string): StyleConfig | undefined {
  const definition = getComponentDefinition(type);
  return definition?.styleConfig;
}

// Update component registry with enhanced properties
export function enhanceComponentRegistry(enhancements: Record<string, Partial<ComponentDefinition>>): void {
  // Loop through enhancements and update registry
  Object.keys(enhancements).forEach(type => {
    const definition = componentRegistry[type];
    if (definition) {
      componentRegistry[type] = {
        ...definition,
        ...enhancements[type]
      };
    }
  });
}
