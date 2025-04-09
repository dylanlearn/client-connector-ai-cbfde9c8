
/**
 * Responsive utilities for wireframe components
 */

export interface ResponsiveOptions {
  device: 'mobile' | 'tablet' | 'desktop' | string;
  width: number;
}

export const DEFAULT_DEVICE_WIDTHS = {
  mobile: 375,
  tablet: 768,
  desktop: 1200
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

export const getDeviceFromWidth = (width: number): 'mobile' | 'tablet' | 'desktop' => {
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
