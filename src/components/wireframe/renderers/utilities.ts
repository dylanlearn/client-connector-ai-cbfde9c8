
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

/**
 * Create a color scheme object based on user input
 */
export function createColorScheme(colorScheme: string | Record<string, string> | undefined): Record<string, string> {
  if (!colorScheme) {
    // Default color scheme
    return {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937'
    };
  }
  
  // If colorScheme is already an object, return it
  if (typeof colorScheme === 'object') {
    return {
      primary: colorScheme.primary || '#3b82f6',
      secondary: colorScheme.secondary || '#10b981',
      accent: colorScheme.accent || '#8b5cf6',
      background: colorScheme.background || '#ffffff',
      text: colorScheme.text || '#1f2937'
    };
  }
  
  // Parse color scheme from string
  try {
    // Check if it's a valid JSON string
    if (colorScheme.startsWith('{') && colorScheme.endsWith('}')) {
      const parsed = JSON.parse(colorScheme);
      return {
        primary: parsed.primary || '#3b82f6',
        secondary: parsed.secondary || '#10b981',
        accent: parsed.accent || '#8b5cf6',
        background: parsed.background || '#ffffff',
        text: parsed.text || '#1f2937'
      };
    }
    
    // Handle simple color scheme string formats: "blue", "dark", "light", etc.
    switch (colorScheme.toLowerCase()) {
      case 'blue':
        return {
          primary: '#3b82f6',
          secondary: '#60a5fa',
          accent: '#93c5fd',
          background: '#ffffff',
          text: '#1f2937'
        };
      case 'dark':
        return {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#8b5cf6',
          background: '#1f2937',
          text: '#f9fafb'
        };
      case 'light':
      default:
        return {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#8b5cf6',
          background: '#ffffff',
          text: '#1f2937'
        };
    }
  } catch (error) {
    console.error('Error parsing color scheme:', error);
    return {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937'
    };
  }
}
