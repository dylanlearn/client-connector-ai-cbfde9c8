
import { WireframeSection, WireframeComponent, CopySuggestions } from '@/services/ai/wireframe/wireframe-types';

// Helper function to create a style object from a WireframeComponent or WireframeSection
export const createStyleObject = (component: WireframeComponent | WireframeSection): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  
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

// Export all utilities
export default {
  createStyleObject,
  getCopySuggestions,
  formatClassNames,
  isGridLayout,
  isFlexLayout,
  getLayoutProperties,
  getColor,
  normalizeSectionData,
  createSafeId
};
