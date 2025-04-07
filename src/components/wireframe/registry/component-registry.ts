
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export interface ComponentField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'color' | 'image' | 'array';
  description?: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ComponentVariant {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
}

export interface ComponentDefinition {
  type: string;
  name: string;
  description?: string;
  category: 'layout' | 'content' | 'navigation' | 'media' | 'form' | 'commerce' | 'misc';
  icon?: string;
  variants: ComponentVariant[];
  fields: ComponentField[];
  defaultData: Partial<WireframeSection>;
}

// Store for all registered components
const componentRegistry: Record<string, ComponentDefinition> = {};

/**
 * Register a new component type
 */
export const registerComponent = (definition: ComponentDefinition): void => {
  componentRegistry[definition.type] = definition;
};

/**
 * Get a component definition by type
 */
export const getComponentDefinition = (type: string): ComponentDefinition | undefined => {
  return componentRegistry[type];
};

/**
 * Get all registered component definitions
 */
export const getAllComponentDefinitions = (): ComponentDefinition[] => {
  return Object.values(componentRegistry);
};

/**
 * Get all components of a specific category
 */
export const getComponentsByCategory = (category: ComponentDefinition['category']): ComponentDefinition[] => {
  return Object.values(componentRegistry).filter(
    (component) => component.category === category
  );
};

/**
 * Get a variant by its ID for a specific component type
 */
export const getComponentVariant = (componentType: string, variantId: string): ComponentVariant | undefined => {
  const component = getComponentDefinition(componentType);
  return component?.variants.find((variant) => variant.id === variantId);
};

/**
 * Create a new section instance with default data
 */
export const createSectionInstance = (componentType: string, variantId?: string): Partial<WireframeSection> => {
  const definition = getComponentDefinition(componentType);
  if (!definition) return {};
  
  const variant = variantId 
    ? definition.variants.find((v) => v.id === variantId) 
    : definition.variants[0];
  
  return {
    ...definition.defaultData,
    sectionType: componentType,
    componentVariant: variant?.id
  };
};
