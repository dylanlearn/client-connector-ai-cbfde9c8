
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

// Supported component types
export type ComponentType = 
  | 'hero'
  | 'navigation'
  | 'feature-grid'
  | 'testimonials'
  | 'pricing'
  | 'cta'
  | 'faq'
  | 'footer'
  | 'blog'
  | 'contact'
  | 'custom';

// Device breakpoints
export const deviceBreakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 1024
};

// Style option for tailwind classes
export interface StyleOption {
  label: string;
  value: string;
  tailwindClass: string;
}

// Component field definition for property editors
export interface ComponentField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'color' | 'boolean' | 'image' | 'richtext' | 'array' | 'object';
  default?: any;
  options?: Array<{ label: string; value: string | number | boolean }>;
  description?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  conditional?: {
    field: string;
    value: any;
  };
  when?: string;
  isEqual?: any;
  childFields?: ComponentField[]; // For array/object types
}

// Style configuration for components
export interface StyleConfig {
  backgrounds?: Array<StyleOption>;
  spacing?: Array<StyleOption>;
  layouts?: Array<StyleOption>;
  colors?: Array<StyleOption>;
  typography?: Array<StyleOption>;
  borders?: Array<StyleOption>;
  shadows?: Array<StyleOption>;
}

// Responsive configuration for a component
export interface ResponsiveConfig {
  mobile?: {
    [key: string]: any;
  };
  tablet?: {
    [key: string]: any;
  };
  desktop?: {
    [key: string]: any;
  };
}

// Helper function to get device-specific styles
export function getDeviceStyles(
  baseStyles: Record<string, any>,
  responsiveConfig: ResponsiveConfig,
  deviceType: 'desktop' | 'tablet' | 'mobile'
): Record<string, any> {
  const deviceStyles = responsiveConfig[deviceType] || {};
  return { ...baseStyles, ...deviceStyles };
}

// Convert style options to Tailwind classes
export function styleOptionsToTailwind(styleOptions: Record<string, any>): string {
  let classes: string[] = [];

  // Process each style option
  Object.keys(styleOptions).forEach(key => {
    const option = styleOptions[key];
    if (typeof option === 'string' && option.includes('tw-')) {
      // If the option is a string with "tw-" prefix, extract the class
      classes.push(option.replace('tw-', ''));
    } else if (typeof option === 'object' && option?.tailwindClass) {
      // If the option is an object with a tailwindClass property
      classes.push(option.tailwindClass);
    }
  });

  return classes.join(' ');
}

// Get interactive properties for a component
export function getInteractiveProperties(section: WireframeSection): Record<string, any> {
  const { data = {}, sectionType } = section;
  
  // Default interactive properties
  const defaultProps = {
    isInteractive: false,
    hoverEffect: 'none',
    clickAction: 'none'
  };
  
  // Return component-specific interactive properties based on section type
  switch (sectionType) {
    case 'cta':
      return {
        ...defaultProps,
        isInteractive: true,
        clickAction: 'navigate'
      };
    case 'navigation':
      return {
        ...defaultProps,
        isInteractive: true,
        hoverEffect: 'highlight'
      };
    case 'hero':
      return {
        ...defaultProps,
        hasAnimation: data.hasAnimation || false,
        animationType: data.animationType || 'fade'
      };
    default:
      return defaultProps;
  }
}
