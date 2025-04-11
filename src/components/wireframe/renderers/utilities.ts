
import { WireframeSection, WireframeComponent, CopySuggestions } from '@/services/ai/wireframe/wireframe-types';

// Helper functions for wireframe component rendering

/**
 * Gets a suggested text value for a specific key, or returns a fallback
 */
export function getSuggestedText(
  copySuggestions: CopySuggestions | undefined,
  key: string,
  fallback: string = ''
): string {
  if (!copySuggestions) return fallback;
  return copySuggestions[key] || fallback;
}

/**
 * Alternative name for getSuggestedText to maintain compatibility
 */
export function getSuggestion(
  copySuggestions: CopySuggestions | CopySuggestions[] | Record<string, string> | undefined, 
  key: string, 
  defaultValue: string = ''
): string {
  // First normalize the copySuggestions to a Record<string, string>
  const normalizedSuggestions = normalizeCopySuggestions(copySuggestions);
  
  // Then retrieve the value or return the default
  return String(normalizedSuggestions[key] || defaultValue);
}

/**
 * Transforms a section type to a more readable display format
 */
export function formatSectionType(sectionType: string): string {
  if (!sectionType) return 'Unknown Section';
  
  // Split by hyphens and capitalize
  return sectionType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Gets responsive class based on the current device
 */
export function getResponsiveClass(component: WireframeComponent, deviceType: string): string {
  if (!component.responsive) return '';
  
  const responsiveClasses = {
    mobile: component.responsive.mobile?.className || '',
    tablet: component.responsive.tablet?.className || '',
    desktop: component.responsive.desktop?.className || ''
  };
  
  return responsiveClasses[deviceType as keyof typeof responsiveClasses] || '';
}

/**
 * Merges component styles with responsive styles for current device
 */
export function getResponsiveStyles(
  component: WireframeComponent,
  deviceType: string
): Record<string, any> {
  const baseStyles = component.style || {};
  
  if (!component.responsive) return baseStyles;
  
  const deviceStyles = component.responsive[deviceType as keyof typeof component.responsive] || {};
  
  return {
    ...baseStyles,
    ...deviceStyles
  };
}

/**
 * Create a style object that handles text-align correctly for React CSS Properties
 */
export function createStyleObject(styles: Record<string, any> = {}): React.CSSProperties {
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
}

/**
 * Helper to safely convert string or number dimensions to numeric values for calculations
 */
export function parseDimension(value: string | number | undefined, defaultValue: number = 0): number {
  if (value === undefined) return defaultValue;
  
  if (typeof value === 'number') return value;
  
  // Try to parse the string as a number
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Create a color scheme object from a wireframe
 */
export function createColorScheme(wireframe: any): Record<string, string> {
  const colorScheme = wireframe?.colorScheme || {
    primary: '#3182ce',
    secondary: '#805ad5',
    accent: '#ed8936',
    background: '#ffffff',
    text: '#1a202c'
  };
  
  return colorScheme;
}

/**
 * Safely converts a CopySuggestions object or array into a Record<string, string> 
 * that can be safely used with components expecting string values
 */
export function normalizeCopySuggestions(
  copySuggestions: CopySuggestions | CopySuggestions[] | Record<string, string> | undefined,
  defaultValue: string = ''
): Record<string, string> {
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
}

/**
 * Processes copy suggestions to collect all available text from section
 */
export function processCopySuggestions(section: WireframeSection): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Include copy suggestions
  if (section.copySuggestions) {
    Object.assign(result, normalizeCopySuggestions(section.copySuggestions));
  }
  
  // Include data if available
  if (section.data) {
    Object.entries(section.data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        result[key] = value;
      }
    });
  }
  
  return result;
}
