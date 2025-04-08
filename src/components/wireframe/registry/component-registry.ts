import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { ComponentStyleOptions, ResponsiveConfig } from './component-types';

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
  baseStyles?: ComponentStyleOptions;
  responsiveConfig?: ResponsiveConfig;
}

export interface ComponentDefinition {
  type: string;
  name: string;
  description?: string;
  category: 'layout' | 'content' | 'navigation' | 'media' | 'form' | 'commerce' | 'misc';
  icon?: string;
  variants: ComponentVariant[];
  fields: ComponentField[];
  baseStyles?: ComponentStyleOptions;
  responsiveConfig?: ResponsiveConfig;
  defaultData: Partial<WireframeSection>;
}

// Store for all registered components
const componentRegistry: Record<string, ComponentDefinition> = {};

/**
 * Register a new component type
 */
export const registerComponent = (definition: ComponentDefinition): void => {
  // Ensure the definition has the required fields
  if (!definition.variants || !Array.isArray(definition.variants) || definition.variants.length === 0) {
    console.warn(`Component definition for ${definition.type} must have at least one variant`);
    definition.variants = [{
      id: 'default',
      name: 'Default'
    }];
  }
  
  // If baseStyles is not defined, create default
  if (!definition.baseStyles) {
    definition.baseStyles = {
      padding: '4',
      layout: 'stack',
      gap: '4'
    };
  }
  
  // Register the component
  componentRegistry[definition.type] = definition;
  console.log(`Registered component: ${definition.name} (${definition.type})`);
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
    componentVariant: variant?.id,
    // Always ensure copySuggestions is initialized as an array
    copySuggestions: []
  };
};

// Utility to get responsive config for a component and variant
export const getComponentResponsiveConfig = (componentType: string, variantId?: string): ResponsiveConfig | undefined => {
  const component = getComponentDefinition(componentType);
  if (!component) return undefined;
  
  // If a variant is specified and has responsive config, use that
  if (variantId) {
    const variant = component.variants.find(v => v.id === variantId);
    if (variant?.responsiveConfig) {
      return variant.responsiveConfig;
    }
  }
  
  // Otherwise fall back to component-level responsive config
  return component.responsiveConfig;
};
