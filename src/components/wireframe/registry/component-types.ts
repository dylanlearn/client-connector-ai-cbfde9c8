
import { WireframeSection } from '@/stores/wireframe-store';

/**
 * Device-specific configuration for a component
 */
export interface ResponsiveConfig {
  desktop?: Partial<ComponentStyleOptions>;
  tablet?: Partial<ComponentStyleOptions>;
  mobile?: Partial<ComponentStyleOptions>;
}

/**
 * Style options for a component
 */
export interface ComponentStyleOptions {
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  columns?: number;
  gap?: string;
  textSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  alignment?: 'left' | 'center' | 'right';
  layout?: 'stack' | 'row' | 'grid';
}

/**
 * Configuration for component content
 */
export interface ComponentContent {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: string[];
  imageUrl?: string;
  actionText?: string;
}

/**
 * Extended component definition with responsive features
 */
export interface EnhancedComponentProps {
  section: WireframeSection;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  mode: 'preview' | 'edit' | 'flowchart';
  darkMode?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * Registry of device breakpoints
 */
export const deviceBreakpoints = {
  desktop: 1280,
  tablet: 768,
  mobile: 480
};

/**
 * Helper to get device-specific styles
 */
export function getDeviceStyles(
  baseStyles: ComponentStyleOptions,
  responsiveConfig: ResponsiveConfig,
  deviceType: 'desktop' | 'tablet' | 'mobile'
): ComponentStyleOptions {
  // Start with base styles
  const styles = { ...baseStyles };
  
  // Apply device-specific overrides
  const deviceStyles = responsiveConfig[deviceType];
  if (deviceStyles) {
    Object.assign(styles, deviceStyles);
  }
  
  return styles;
}

/**
 * Convert ComponentStyleOptions to CSS style object
 */
export function styleOptionsToCSS(options: ComponentStyleOptions): React.CSSProperties {
  const styles: React.CSSProperties = {};
  
  if (options.padding) styles.padding = options.padding;
  if (options.margin) styles.margin = options.margin;
  if (options.width) styles.width = options.width;
  if (options.height) styles.height = options.height;
  if (options.maxWidth) styles.maxWidth = options.maxWidth;
  
  // Text alignment
  if (options.alignment) {
    styles.textAlign = options.alignment;
  }
  
  return styles;
}

/**
 * Convert ComponentStyleOptions to Tailwind classes
 */
export function styleOptionsToTailwind(options: ComponentStyleOptions): string {
  const classes: string[] = [];
  
  // Spacing
  if (options.padding) {
    classes.push(`p-${options.padding}`);
  }
  if (options.margin) {
    classes.push(`m-${options.margin}`);
  }
  
  // Text size
  if (options.textSize) {
    classes.push(`text-${options.textSize}`);
  }
  
  // Layout
  if (options.layout === 'grid' && options.columns) {
    classes.push(`grid grid-cols-${options.columns}`);
    if (options.gap) {
      classes.push(`gap-${options.gap}`);
    }
  } else if (options.layout === 'row') {
    classes.push('flex flex-row items-center');
    if (options.gap) {
      classes.push(`gap-${options.gap}`);
    }
  } else if (options.layout === 'stack') {
    classes.push('flex flex-col');
    if (options.gap) {
      classes.push(`gap-${options.gap}`);
    }
  }
  
  // Alignment
  if (options.alignment === 'center') {
    classes.push('text-center');
  } else if (options.alignment === 'right') {
    classes.push('text-right');
  }
  
  return classes.join(' ');
}
