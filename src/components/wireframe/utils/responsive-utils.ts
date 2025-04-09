
/**
 * Utility functions for responsive design
 */
import { TAILWIND_BREAKPOINTS } from './grid-utils';

/**
 * Determine device type based on width
 */
export function getDeviceTypeFromWidth(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < TAILWIND_BREAKPOINTS.sm) return 'mobile';
  if (width < TAILWIND_BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
}

/**
 * Get the device-specific value from a responsive object
 */
export function getResponsiveValue<T>(
  responsiveObj: { 
    desktop?: T; 
    tablet?: T; 
    mobile?: T;
    [key: string]: T | undefined;
  } | T,
  device: 'desktop' | 'tablet' | 'mobile'
): T | undefined {
  // If not an object, return as is
  if (typeof responsiveObj !== 'object' || responsiveObj === null) {
    return responsiveObj as T;
  }
  
  // If it has device-specific keys
  const objWithDeviceKeys = responsiveObj as { 
    desktop?: T; 
    tablet?: T;
    mobile?: T; 
  };
  
  if (
    'desktop' in objWithDeviceKeys || 
    'tablet' in objWithDeviceKeys || 
    'mobile' in objWithDeviceKeys
  ) {
    // Return device-specific value or fallback
    return (
      objWithDeviceKeys[device] || 
      objWithDeviceKeys.desktop || 
      objWithDeviceKeys.tablet || 
      objWithDeviceKeys.mobile
    );
  }
  
  // Return as-is if not a responsive object
  return responsiveObj as T;
}

/**
 * Calculate responsive dimensions based on container width
 */
export function calculateResponsiveDimensions(
  baseWidth: number,
  baseHeight: number,
  containerWidth: number,
  maintainAspectRatio: boolean = true
): { width: number; height: number } {
  if (containerWidth >= baseWidth) {
    // No need to resize
    return { width: baseWidth, height: baseHeight };
  }
  
  // Calculate new width (constrained by container)
  const width = Math.min(baseWidth, containerWidth);
  
  // Calculate new height
  let height = baseHeight;
  if (maintainAspectRatio) {
    const aspectRatio = baseWidth / baseHeight;
    height = width / aspectRatio;
  }
  
  return { width, height };
}

/**
 * Apply responsive modifications to a component
 */
export function makeComponentResponsive(
  component: any,
  device: 'desktop' | 'tablet' | 'mobile'
): any {
  if (!component) return component;
  
  // Start with a clone of the component
  const responsiveComponent = { ...component };
  
  // Apply device-specific adjustments
  switch (device) {
    case 'tablet':
      // For tablets, adjust font sizes and paddings
      if (responsiveComponent.style) {
        responsiveComponent.style = {
          ...responsiveComponent.style,
          fontSize: scaleValue(responsiveComponent.style.fontSize, 0.9),
          padding: scaleValue(responsiveComponent.style.padding, 0.9),
          margin: scaleValue(responsiveComponent.style.margin, 0.9)
        };
      }
      break;
      
    case 'mobile':
      // For mobile, make more significant adjustments
      if (responsiveComponent.style) {
        responsiveComponent.style = {
          ...responsiveComponent.style,
          fontSize: scaleValue(responsiveComponent.style.fontSize, 0.8),
          padding: scaleValue(responsiveComponent.style.padding, 0.8),
          margin: scaleValue(responsiveComponent.style.margin, 0.7)
        };
      }
      
      // Stack items for mobile
      if (responsiveComponent.layout && responsiveComponent.layout.type === 'flex') {
        responsiveComponent.layout.direction = 'column';
      }
      break;
      
    default:
      // Desktop uses default values
      break;
  }
  
  return responsiveComponent;
}

/**
 * Scale a CSS value by a factor
 */
function scaleValue(value: string | number | undefined, factor: number): string | number | undefined {
  if (value === undefined) return undefined;
  
  // Handle numeric values
  if (typeof value === 'number') {
    return value * factor;
  }
  
  // Handle string values with units
  if (typeof value === 'string') {
    // Parse values like '10px', '1.5rem', etc.
    const match = value.match(/^([\d.]+)([a-z%]+)$/);
    if (match) {
      const numValue = parseFloat(match[1]);
      const unit = match[2];
      return `${(numValue * factor).toFixed(2)}${unit}`;
    }
    
    // Handle space-separated values like padding: '10px 20px'
    if (value.includes(' ')) {
      return value.split(' ')
        .map(part => scaleValue(part, factor))
        .join(' ');
    }
  }
  
  return value;
}

/**
 * Convert px value to rem value
 */
export function pxToRem(px: number, baseSize: number = 16): string {
  return `${(px / baseSize).toFixed(3)}rem`;
}

/**
 * Convert rem value to px value
 */
export function remToPx(rem: number | string, baseSize: number = 16): number {
  const remValue = typeof rem === 'string' ? parseFloat(rem) : rem;
  return remValue * baseSize;
}
