
import { WireframeComponent } from '@/types/wireframe-component';

/**
 * Device specific breakpoints for responsive design
 */
export const deviceBreakpoints = {
  mobile: {
    width: 375,
    height: 667
  },
  tablet: {
    width: 768,
    height: 1024
  },
  desktop: {
    width: 1200,
    height: 800
  }
};

/**
 * A field definition for component properties
 */
export interface ComponentField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'text' | 'image' | 'range';
  label: string;
  description?: string;
  defaultValue?: any;
  options?: string[] | { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

/**
 * Device-specific style configurations
 */
export interface ResponsiveConfig {
  mobile?: Record<string, any>;
  tablet?: Record<string, any>;
  desktop?: Record<string, any>;
}

/**
 * Style configuration for a component
 */
export interface StyleConfig {
  baseStyles: Record<string, any>;
  responsive?: ResponsiveConfig;
  variants?: Record<string, Record<string, any>>;
  states?: Record<string, Record<string, any>>;
}

/**
 * A variant of a component
 */
export interface ComponentVariant {
  id: string;
  name: string;
  description?: string;
  preview?: string;
  defaultData?: Partial<WireframeComponent>;
  styles?: StyleConfig;
}

/**
 * A component definition in the registry
 */
export interface ComponentDefinition {
  type: string;
  name: string;
  description?: string;
  icon?: string;
  fields?: ComponentField[];
  variants?: ComponentVariant[];
  defaultData: WireframeComponent;
  defaultStyles?: StyleConfig;
  category?: string;
  tags?: string[];
}

/**
 * A library of components
 */
export interface ComponentLibrary {
  id: string;
  name: string;
  description?: string;
  components: ComponentDefinition[];
  version?: string;
  author?: string;
}

/**
 * Get device-specific styles based on the current device
 */
export function getDeviceStyles(
  styles: StyleConfig | undefined, 
  deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): Record<string, any> {
  if (!styles) return {};
  
  // Start with base styles
  const result = { ...styles.baseStyles };
  
  // Apply responsive overrides if they exist
  if (styles.responsive && styles.responsive[deviceType]) {
    return { ...result, ...styles.responsive[deviceType] };
  }
  
  return result;
}

/**
 * Convert style object to tailwind classes
 */
export function styleOptionsToTailwind(styleOptions: Record<string, any>): string {
  // This is a simple implementation - expand as needed
  const classes: string[] = [];
  
  // Map common style properties to tailwind classes
  if (styleOptions.backgroundColor) {
    if (styleOptions.backgroundColor.startsWith('#')) {
      classes.push('bg-[' + styleOptions.backgroundColor + ']');
    } else {
      classes.push('bg-' + styleOptions.backgroundColor);
    }
  }
  
  if (styleOptions.textColor) {
    if (styleOptions.textColor.startsWith('#')) {
      classes.push('text-[' + styleOptions.textColor + ']');
    } else {
      classes.push('text-' + styleOptions.textColor);
    }
  }
  
  if (styleOptions.padding) {
    classes.push('p-' + styleOptions.padding);
  }
  
  if (styleOptions.margin) {
    classes.push('m-' + styleOptions.margin);
  }
  
  if (styleOptions.rounded) {
    classes.push('rounded-' + styleOptions.rounded);
  }
  
  if (styleOptions.shadow) {
    classes.push('shadow-' + styleOptions.shadow);
  }
  
  return classes.join(' ');
}
