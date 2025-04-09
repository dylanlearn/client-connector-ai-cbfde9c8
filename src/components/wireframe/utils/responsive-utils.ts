
/**
 * Responsive utilities for wireframe components
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveOptions {
  device: DeviceType | string;
  width: number;
}

export const DEFAULT_DEVICE_WIDTHS = {
  mobile: 375,
  tablet: 768,
  desktop: 1200
};

export const BREAKPOINT_VALUES = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export const getResponsiveClasses = (device: string): string => {
  switch (device) {
    case 'mobile':
      return 'w-full max-w-[375px]';
    case 'tablet':
      return 'w-full max-w-[768px]';
    case 'desktop':
    default:
      return 'w-full';
  }
};

export const getDeviceFromWidth = (width: number): DeviceType => {
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const shouldShowOnDevice = (
  visibilityConfig: { mobile?: boolean; tablet?: boolean; desktop?: boolean } | undefined,
  device: string
): boolean => {
  if (!visibilityConfig) return true;
  
  switch (device) {
    case 'mobile':
      return visibilityConfig.mobile !== false;
    case 'tablet':
      return visibilityConfig.tablet !== false;
    case 'desktop':
    default:
      return visibilityConfig.desktop !== false;
  }
};

export const getMediaQueryForDevice = (device: string): string => {
  switch (device) {
    case 'mobile':
      return '@media (max-width: 639px)';
    case 'tablet':
      return '@media (min-width: 640px) and (max-width: 1023px)';
    case 'desktop':
    default:
      return '@media (min-width: 1024px)';
  }
};

// Add missing functions for responsive utils
export const getBreakpointForDevice = (device: DeviceType): BreakpointKey => {
  switch (device) {
    case 'mobile':
      return 'sm';
    case 'tablet':
      return 'md';
    case 'desktop':
      return 'lg';
    default:
      return 'lg';
  }
};

export const getResponsiveStyles = (device: DeviceType, baseStyles: Record<string, any> = {}): Record<string, any> => {
  // This function returns responsive styles based on device type
  const deviceSpecificStyles = {
    ...baseStyles,
    // Add device-specific style overrides
    ...(device === 'mobile' ? { width: '100%', maxWidth: '375px' } : {}),
    ...(device === 'tablet' ? { width: '100%', maxWidth: '768px' } : {}),
    ...(device === 'desktop' ? { width: '100%' } : {})
  };
  
  return deviceSpecificStyles;
};

export const isFluidLayout = (layoutType: string): boolean => {
  return ['fluid', 'responsive', 'adaptive'].includes(layoutType);
};

export const getResponsiveGridColumns = (device: DeviceType, defaultColumns: number = 12): number => {
  switch (device) {
    case 'mobile':
      return 4;
    case 'tablet':
      return 8;
    case 'desktop':
      return defaultColumns;
    default:
      return defaultColumns;
  }
};

export const getResponsiveGutterSize = (device: DeviceType, defaultGutter: number = 16): number => {
  switch (device) {
    case 'mobile':
      return 8;
    case 'tablet':
      return 12;
    case 'desktop':
      return defaultGutter;
    default:
      return defaultGutter;
  }
};

export const responsiveTailwindClasses = (device: DeviceType): string => {
  switch (device) {
    case 'mobile':
      return 'w-full px-4';
    case 'tablet':
      return 'w-full max-w-3xl px-6';
    case 'desktop':
      return 'w-full max-w-7xl px-8';
    default:
      return 'w-full';
  }
};
