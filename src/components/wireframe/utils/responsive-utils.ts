
import { deviceBreakpoints } from '../registry/component-types';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveOptions {
  device?: DeviceType;
  breakpoint?: BreakpointKey;
  width?: number;
  height?: number;
  orientation?: 'portrait' | 'landscape';
}

export const BREAKPOINT_VALUES: Record<BreakpointKey, number> = {
  'xs': 475,
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1400
};

/**
 * Maps width to corresponding breakpoint
 */
export function getBreakpointFromWidth(width: number): BreakpointKey {
  if (width < BREAKPOINT_VALUES.xs) return 'xs';
  if (width < BREAKPOINT_VALUES.sm) return 'sm';
  if (width < BREAKPOINT_VALUES.md) return 'md';
  if (width < BREAKPOINT_VALUES.lg) return 'lg';
  if (width < BREAKPOINT_VALUES.xl) return 'xl';
  return '2xl';
}

/**
 * Maps a device type to a breakpoint
 */
export function getBreakpointForDevice(device: DeviceType): BreakpointKey {
  switch (device) {
    case 'mobile': return 'sm';
    case 'tablet': return 'md';
    case 'desktop': return 'xl';
  }
}

/**
 * Get device specific styles for a component
 */
export function getResponsiveStyles(
  baseStyles: Record<string, any>,
  responsiveStyles: Record<DeviceType | BreakpointKey, Record<string, any>>,
  options: ResponsiveOptions
): Record<string, any> {
  // Start with base styles
  let result = { ...baseStyles };
  
  // Apply device-specific overrides if available
  if (options.device && responsiveStyles[options.device]) {
    result = { ...result, ...responsiveStyles[options.device] };
  }
  
  // Apply breakpoint-specific overrides if available
  const breakpoint = options.breakpoint || 
    (options.width ? getBreakpointFromWidth(options.width) : undefined) ||
    (options.device ? getBreakpointForDevice(options.device) : undefined);
  
  if (breakpoint && responsiveStyles[breakpoint]) {
    result = { ...result, ...responsiveStyles[breakpoint] };
  }
  
  // Apply orientation-specific styles if needed
  if (options.orientation && responsiveStyles[options.orientation]) {
    result = { ...result, ...responsiveStyles[options.orientation] };
  }
  
  return result;
}

/**
 * Determine if layout is fluid or fixed based on device/breakpoint
 */
export function isFluidLayout(options: ResponsiveOptions): boolean {
  const breakpoint = options.breakpoint || 
    (options.width ? getBreakpointFromWidth(options.width) : undefined) ||
    (options.device ? getBreakpointForDevice(options.device) : undefined);
    
  // Fluid layout for smaller screens, fixed for larger
  return breakpoint ? ['xs', 'sm', 'md'].includes(breakpoint) : false;
}

/**
 * Calculate responsive grid columns based on device/breakpoint
 */
export function getResponsiveGridColumns(options: ResponsiveOptions): number {
  const breakpoint = options.breakpoint || 
    (options.width ? getBreakpointFromWidth(options.width) : undefined) ||
    (options.device ? getBreakpointForDevice(options.device) : undefined);
  
  if (!breakpoint) return 12; // Default
  
  // Scale columns based on breakpoint
  switch (breakpoint) {
    case 'xs': return 4;
    case 'sm': return 6;
    case 'md': return 8;
    case 'lg': return 10;
    case 'xl':
    case '2xl': return 12;
    default: return 12;
  }
}

/**
 * Calculate gutter size based on device/breakpoint
 */
export function getResponsiveGutterSize(options: ResponsiveOptions): number {
  const breakpoint = options.breakpoint || 
    (options.width ? getBreakpointFromWidth(options.width) : undefined) ||
    (options.device ? getBreakpointForDevice(options.device) : undefined);
  
  if (!breakpoint) return 24; // Default
  
  // Scale gutter based on breakpoint
  switch (breakpoint) {
    case 'xs': return 8;
    case 'sm': return 12;
    case 'md': return 16;
    case 'lg': return 20;
    case 'xl':
    case '2xl': return 24;
    default: return 24;
  }
}

/**
 * Convert Tailwind utility classes based on responsive context
 */
export function responsiveTailwindClasses(classes: string, options: ResponsiveOptions): string {
  const breakpoint = options.breakpoint || 
    (options.width ? getBreakpointFromWidth(options.width) : undefined) ||
    (options.device ? getBreakpointForDevice(options.device) : undefined);
  
  if (!breakpoint) return classes;
  
  // Apply responsive prefix to each class where needed
  return classes.split(' ')
    .map(cls => {
      // Skip classes that shouldn't be prefixed
      if (cls.includes(':') || cls.includes('hover:') || !cls.trim()) return cls;
      
      // Apply responsive prefix based on breakpoint
      switch (breakpoint) {
        case 'xs': case 'sm': return `sm:${cls}`;
        case 'md': return `md:${cls}`;
        case 'lg': return `lg:${cls}`;
        case 'xl': return `xl:${cls}`;
        case '2xl': return `2xl:${cls}`;
        default: return cls;
      }
    })
    .join(' ');
}
