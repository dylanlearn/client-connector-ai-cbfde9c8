
import { DeviceType } from '../preview/DeviceInfo';

// Import TAILWIND_BREAKPOINTS from grid-utils
import { TAILWIND_BREAKPOINTS } from './grid-utils';

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const BREAKPOINT_VALUES = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export interface ResponsiveOptions<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
  default: T;
}

/**
 * Get responsive value based on current device type
 */
export function getResponsiveValue<T>(
  options: ResponsiveOptions<T>,
  deviceType: DeviceType
): T {
  switch (deviceType) {
    case 'mobile':
      return options.xs || options.sm || options.default;
    case 'tablet':
      return options.md || options.default;
    case 'desktop':
    case 'desktop-lg':
      return options.lg || options.xl || options.default;
    case 'desktop-xl':
      return options.xl || options['2xl'] || options.default;
    default:
      return options.default;
  }
}

/**
 * Get device type from viewport width
 */
export function getDeviceTypeFromWidth(width: number): DeviceType {
  if (width < BREAKPOINT_VALUES.sm) return 'mobile';
  if (width < BREAKPOINT_VALUES.lg) return 'tablet';
  if (width < BREAKPOINT_VALUES.xl) return 'desktop';
  if (width < BREAKPOINT_VALUES['2xl']) return 'desktop-lg';
  return 'desktop-xl';
}

/**
 * Calculate responsive dimensions based on device type
 */
export function calculateResponsiveDimensions(
  width: number,
  height: number,
  deviceType: DeviceType
): { width: number; height: number } {
  // Implement responsive scaling based on device type
  const scaleFactor = getResponsiveValue(
    {
      xs: 0.4,
      sm: 0.5,
      md: 0.7,
      lg: 0.9,
      xl: 1,
      '2xl': 1.1,
      default: 1
    },
    deviceType
  );
  
  return {
    width: Math.round(width * scaleFactor),
    height: Math.round(height * scaleFactor)
  };
}

/**
 * Make component props responsive based on device
 */
export function makeComponentResponsive(
  component: any,
  deviceType: DeviceType
): any {
  if (!component) return component;
  
  // Clone component to avoid mutating original
  const responsiveComponent = { ...component };
  
  // Apply responsive transformations based on device type
  if (responsiveComponent.props && responsiveComponent.props.responsive) {
    const deviceProps = responsiveComponent.props.responsive[deviceType];
    
    if (deviceProps) {
      responsiveComponent.props = {
        ...responsiveComponent.props,
        ...deviceProps
      };
    }
  }
  
  return responsiveComponent;
}

/**
 * Convert pixels to rem units
 */
export function pxToRem(px: number, baseFontSize: number = 16): string {
  return `${px / baseFontSize}rem`;
}

/**
 * Convert rem to pixels
 */
export function remToPx(rem: string, baseFontSize: number = 16): number {
  const numericValue = parseFloat(rem.replace('rem', ''));
  return numericValue * baseFontSize;
}

/**
 * Get breakpoint key for current device
 */
export function getBreakpointForDevice(deviceType: DeviceType): BreakpointKey {
  switch (deviceType) {
    case 'mobile':
      return 'sm';
    case 'tablet':
      return 'md';
    case 'desktop':
      return 'lg';
    case 'desktop-lg':
      return 'xl';
    case 'desktop-xl':
      return '2xl';
    default:
      return 'lg';
  }
}

/**
 * Get responsive styles based on breakpoint
 */
export function getResponsiveStyles(
  styles: Record<BreakpointKey, any>,
  breakpoint: BreakpointKey
): any {
  if (!styles) return {};
  
  // Get all applicable styles based on breakpoint
  const applicableStyles = Object.entries(BREAKPOINT_VALUES)
    .filter(([key]) => BREAKPOINT_VALUES[key as BreakpointKey] <= BREAKPOINT_VALUES[breakpoint])
    .sort((a, b) => BREAKPOINT_VALUES[a[0] as BreakpointKey] - BREAKPOINT_VALUES[b[0] as BreakpointKey])
    .map(([key]) => styles[key as BreakpointKey])
    .filter(Boolean);
  
  // Merge all applicable styles
  return Object.assign({}, ...applicableStyles);
}

/**
 * Check if layout should use fluid container
 */
export function isFluidLayout(deviceType: DeviceType): boolean {
  return deviceType === 'mobile' || deviceType === 'tablet';
}

/**
 * Get responsive grid columns
 */
export function getResponsiveGridColumns(deviceType: DeviceType): number {
  switch (deviceType) {
    case 'mobile':
      return 4;
    case 'tablet':
      return 8;
    case 'desktop':
    case 'desktop-lg':
    case 'desktop-xl':
      return 12;
    default:
      return 12;
  }
}

/**
 * Get responsive gutter size
 */
export function getResponsiveGutterSize(deviceType: DeviceType): number {
  switch (deviceType) {
    case 'mobile':
      return 16;
    case 'tablet':
      return 24;
    default:
      return 32;
  }
}

/**
 * Generate Tailwind responsive classes
 */
export function responsiveTailwindClasses(
  baseClasses: string,
  responsiveClasses: Partial<Record<BreakpointKey, string>>
): string {
  const classes = [baseClasses];
  
  Object.entries(responsiveClasses).forEach(([breakpoint, breakpointClasses]) => {
    if (breakpoint && breakpointClasses) {
      classes.push(`${breakpoint}:${breakpointClasses}`);
    }
  });
  
  return classes.join(' ');
}
