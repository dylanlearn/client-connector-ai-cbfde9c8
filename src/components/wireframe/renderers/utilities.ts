
import { WireframeSection } from "@/services/ai/wireframe/wireframe-types";

/**
 * Type definition for copy suggestions used in wireframe sections
 */
export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  primaryCta?: string;
  secondaryCta?: string;
  supportText?: string;
  supportCta?: string;
  [key: string]: string | undefined;
}

/**
 * Safely converts a CopySuggestions object or array into a Record<string, string> 
 * that can be safely used with components expecting string values
 */
export const normalizeCopySuggestions = (
  copySuggestions: CopySuggestions | CopySuggestions[] | Record<string, string> | undefined,
  defaultValue: string = ''
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

/**
 * Safely get a value from copySuggestions, handling both object and array formats
 */
export const getSuggestion = (
  copySuggestions: CopySuggestions | CopySuggestions[] | Record<string, string> | undefined, 
  key: string, 
  defaultValue: string = ''
): string => {
  // First normalize the copySuggestions to a Record<string, string>
  const normalizedSuggestions = normalizeCopySuggestions(copySuggestions);
  
  // Then retrieve the value or return the default
  return String(normalizedSuggestions[key] || defaultValue);
};

/**
 * Create a style object that handles text-align correctly for React CSS Properties
 */
export const createStyleObject = (styles: Record<string, any> = {}): React.CSSProperties => {
  const result: Record<string, any> = { ...styles };
  
  // Handle textAlign specifically - cast it to a valid CSS text-align value
  if (styles?.textAlign) {
    switch (styles.textAlign) {
      case 'left':
      case 'center':
      case 'right':
      case 'justify':
        result.textAlign = styles.textAlign as 'left' | 'center' | 'right' | 'justify';
        break;
      default:
        // Use a safe default if the value isn't recognized
        result.textAlign = 'left';
    }
  }
  
  return result as React.CSSProperties;
};

/**
 * Helper to safely convert string or number dimensions to numeric values for calculations
 */
export const parseDimension = (value: string | number | undefined, defaultValue: number = 0): number => {
  if (value === undefined) return defaultValue;
  
  if (typeof value === 'number') return value;
  
  // Try to parse the string as a number
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Create a color scheme object from a wireframe
 */
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

/**
 * Determine if a section is empty (has no content or components)
 */
export const isSectionEmpty = (section: WireframeSection | undefined): boolean => {
  if (!section) return true;
  if (!section.components || section.components.length === 0) return true;
  
  // Check if the components have any content
  const hasContent = section.components.some(component => {
    return component.content || component.src || component.children?.length > 0;
  });
  
  return !hasContent;
};

/**
 * Get appropriate CSS classes for a section or component
 */
export const getClassNames = (element: any, baseClass: string = ''): string => {
  const classes = [baseClass];
  
  if (element?.className) {
    classes.push(element.className);
  }
  
  // Add responsive classes if any
  if (element?.responsive?.mobile?.className) {
    classes.push(`sm:${element.responsive.mobile.className}`);
  }
  
  if (element?.responsive?.tablet?.className) {
    classes.push(`md:${element.responsive.tablet.className}`);
  }
  
  if (element?.responsive?.desktop?.className) {
    classes.push(`lg:${element.responsive.desktop.className}`);
  }
  
  return classes.filter(Boolean).join(' ');
};
