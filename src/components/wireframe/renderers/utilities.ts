
import { WireframeSection, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';

// Define CopySuggestions type here since it's missing from wireframe-types
export interface CopySuggestions {
  [key: string]: string;
}

// Helper function to create a style object from a WireframeComponent or WireframeSection
export const createStyleObject = (component: WireframeComponent | WireframeSection | Record<string, any>): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  
  // If the input is null or undefined, return empty styles
  if (!component) return styles;

  // Add base styles from the style property if it exists
  if (component.style && typeof component.style === 'object') {
    Object.assign(styles, component.style);
  }
  
  // Add background color if available
  if ('backgroundColor' in component && component.backgroundColor) {
    styles.backgroundColor = component.backgroundColor;
  }
  
  // Add dimension styles if available
  if ('dimensions' in component && component.dimensions) {
    if (component.dimensions.width !== undefined) {
      styles.width = component.dimensions.width;
    }
    
    if (component.dimensions.height !== undefined) {
      styles.height = component.dimensions.height;
    }
  }
  
  // Add position styles if available
  if ('position' in component && component.position) {
    if (component.position.x !== undefined) {
      styles.left = component.position.x;
    }
    
    if (component.position.y !== undefined) {
      styles.top = component.position.y;
    }
  }
  
  // Add shorthand properties if available
  if ('x' in component && component.x !== undefined) {
    styles.left = component.x;
  }
  
  if ('y' in component && component.y !== undefined) {
    styles.top = component.y;
  }
  
  if ('width' in component && component.width !== undefined) {
    styles.width = component.width;
  }
  
  if ('height' in component && component.height !== undefined) {
    styles.height = component.height;
  }
  
  if ('padding' in component && component.padding !== undefined) {
    styles.padding = component.padding;
  }
  
  if ('gap' in component && component.gap !== undefined) {
    styles.gap = component.gap;
  }
  
  if ('zIndex' in component && component.zIndex !== undefined) {
    styles.zIndex = component.zIndex;
  }
  
  return styles;
};

// Helper to safely get copy suggestions
export const getCopySuggestions = (section: WireframeSection): CopySuggestions => {
  return section.copySuggestions || {};
};

// Export the getSuggestion function to handle both object and array formats
export const getSuggestion = (
  copySuggestions: CopySuggestions | CopySuggestions[] | Record<string, string> | undefined, 
  key: string, 
  defaultValue: string = ''
): string => {
  if (!copySuggestions) return defaultValue;
  
  // Handle array of suggestions
  if (Array.isArray(copySuggestions)) {
    // Convert the first item if available
    if (copySuggestions.length > 0) {
      return copySuggestions[0][key] || defaultValue;
    }
    return defaultValue;
  }
  
  // Handle object format
  return String(copySuggestions[key] || defaultValue);
};

// Add the processCopySuggestions utility that's needed by some components
export const processCopySuggestions = (
  copySuggestions: CopySuggestions | CopySuggestions[] | Record<string, string> | undefined
): Record<string, string> => {
  if (!copySuggestions) return {};
  
  // Handle array of suggestions
  if (Array.isArray(copySuggestions)) {
    // Convert the first item if available
    if (copySuggestions.length > 0) {
      return { ...copySuggestions[0] };
    }
    return {};
  }
  
  // Handle object format (already in Record<string, string> format)
  return { ...copySuggestions };
};

// Helper to create color scheme
export const createColorScheme = (wireframe: any): Record<string, string> => {
  const colorScheme = wireframe?.colorScheme || {
    primary: '#3182ce',
    secondary: '#805ad5',
    accent: '#ed8936',
    background: '#ffffff',
    text: '#1a202c'
  };
  
  return colorScheme;
};

// Helper to format class names
export const formatClassNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Helper to check if a layout is a grid
export const isGridLayout = (section: WireframeSection): boolean => {
  if (!section.layout) return false;
  
  if (typeof section.layout === 'string') {
    return section.layout.includes('grid');
  }
  
  return section.layout.type === 'grid';
};

// Helper to check if a layout is a flex layout
export const isFlexLayout = (section: WireframeSection): boolean => {
  if (!section.layout) return false;
  
  if (typeof section.layout === 'string') {
    return section.layout.includes('flex');
  }
  
  return section.layout.type === 'flex';
};

// Helper to get layout properties
export const getLayoutProperties = (section: WireframeSection): Record<string, any> => {
  if (!section.layout) return {};
  
  if (typeof section.layout === 'string') {
    return { type: section.layout };
  }
  
  return section.layout;
};

// Get a safe color value with fallback
export const getColor = (
  colorScheme: Record<string, string> | undefined, 
  colorKey: string, 
  fallback: string = '#000000'
): string => {
  if (!colorScheme) return fallback;
  return colorScheme[colorKey] || fallback;
};

// Normalize section data for rendering
export const normalizeSectionData = (section: WireframeSection): Record<string, any> => {
  return section.data || {};
};

// Helper to create an ID safe for CSS
export const createSafeId = (id: string): string => {
  return `wf-${id.replace(/[^a-zA-Z0-9]/g, '-')}`;
};

// Export all utilities as a default export as well
export default {
  createStyleObject,
  getCopySuggestions,
  getSuggestion,
  processCopySuggestions,
  createColorScheme,
  formatClassNames,
  isGridLayout,
  isFlexLayout,
  getLayoutProperties,
  getColor,
  normalizeSectionData,
  createSafeId
};
