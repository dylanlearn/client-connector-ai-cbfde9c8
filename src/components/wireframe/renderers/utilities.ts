
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Get a copy suggestion with a fallback
 */
export function getSuggestion(
  copySuggestions: Record<string, string> | undefined,
  key: string,
  fallback: string = ''
): string {
  if (!copySuggestions) return fallback;
  return copySuggestions[key] || fallback;
}

/**
 * Create a style object from section styles
 */
export function createStyleObject(
  style: Record<string, any> | undefined
): React.CSSProperties {
  if (!style) return {};
  
  // Convert style object to React CSS properties
  const cssProperties: React.CSSProperties = {};
  
  // Map CSS properties
  Object.entries(style).forEach(([key, value]) => {
    // Skip null or undefined values
    if (value === null || value === undefined) return;
    
    // Convert kebab-case to camelCase if needed
    if (key.includes('-')) {
      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      cssProperties[camelKey as keyof React.CSSProperties] = value;
    } else {
      cssProperties[key as keyof React.CSSProperties] = value;
    }
  });
  
  return cssProperties;
}

/**
 * Get a responsive class value based on device type
 */
export function getResponsiveClass(
  baseClass: string,
  deviceType: 'desktop' | 'tablet' | 'mobile'
): string {
  if (deviceType === 'mobile') return `${baseClass}-mobile`;
  if (deviceType === 'tablet') return `${baseClass}-tablet`;
  return baseClass;
}

/**
 * Get section background color with dark mode support
 */
export function getSectionBackground(
  section: WireframeSection,
  darkMode: boolean
): string {
  // First try to get from style or backgroundColor property
  if (section.style?.backgroundColor) return section.style.backgroundColor;
  if (section.backgroundColor) return section.backgroundColor;
  
  // Return defaults based on section type and dark mode
  switch (section.sectionType?.toLowerCase()) {
    case 'hero':
      return darkMode ? '#111827' : '#f9fafb';
    case 'cta':
      return darkMode ? '#1e3a8a' : '#3b82f6';
    case 'footer':
      return darkMode ? '#111827' : '#1f2937';
    default:
      return darkMode ? '#1f2937' : '#ffffff';
  }
}

/**
 * Process section dimensions for different devices
 */
export function processResponsiveDimensions(
  section: WireframeSection,
  deviceType: 'desktop' | 'tablet' | 'mobile'
): { width: string | number; height: string | number } {
  const defaultDimensions = {
    width: '100%',
    height: 'auto'
  };
  
  if (!section.dimensions) return defaultDimensions;
  
  // Check for device-specific dimensions
  const responsiveDimensions = section[`${deviceType}Dimensions`];
  if (responsiveDimensions) {
    return {
      width: responsiveDimensions.width || defaultDimensions.width,
      height: responsiveDimensions.height || defaultDimensions.height
    };
  }
  
  return {
    width: section.dimensions.width || defaultDimensions.width,
    height: section.dimensions.height || defaultDimensions.height
  };
}
