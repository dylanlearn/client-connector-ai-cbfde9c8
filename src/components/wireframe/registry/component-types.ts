
export interface ComponentField {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'number' | 'color' | 'image' | 'array' | 'object' | 'richtext';
  description: string;
  options?: Array<{ label: string; value: string | number | boolean }>;
  id: string;
  defaultValue?: any;
  [key: string]: any;
}

export interface ComponentVariant {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  [key: string]: any;
}

export interface ComponentDefinition {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  variants: ComponentVariant[];
  fields: ComponentField[];
  defaultData: any;
  baseStyles?: Record<string, any>;
  responsiveConfig?: Record<string, any>;
  [key: string]: any;
}

export interface ComponentLibrary {
  [key: string]: ComponentDefinition;
}

export interface StyleConfig {
  desktop: string;
  tablet?: string;
  mobile?: string;
}

export interface ResponsiveConfig {
  desktop: any;
  tablet?: any;
  mobile?: any;
}

export const deviceBreakpoints = {
  desktop: 1024,
  tablet: 768,
  mobile: 480
};

export function getDeviceStyles(styles: StyleConfig | Record<string, any>, device: 'desktop' | 'tablet' | 'mobile'): string {
  if (!styles) return '';
  return styles[device] || styles.desktop || '';
}

// Overloaded function for the new pattern with responsiveConfig
export function getDeviceStyles(baseStyles: Record<string, any>, responsiveConfig: Record<string, any>, device: 'desktop' | 'tablet' | 'mobile'): Record<string, any> {
  if (!baseStyles || !responsiveConfig) return baseStyles || {};
  
  // Merge base styles with device-specific overrides
  return {
    ...baseStyles,
    ...(responsiveConfig[device] || {})
  };
}

export function styleOptionsToTailwind(options: Record<string, any>): string {
  if (!options) return '';
  
  return Object.entries(options)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      // Handle special cases
      if (key === 'padding') return `p-${value}`;
      if (key === 'margin') return `m-${value}`;
      // Simple pass-through for other props
      return String(value);
    })
    .join(' ');
}
