
/**
 * Available device types for responsive preview
 */
export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'mobileSm' | 'tabletLandscape' | 'mobileLandscape';

/**
 * Device dimensions for responsive preview
 */
export interface DeviceDimensions {
  width: number;
  height: number;
  name: string;
  devicePixelRatio?: number;
  userAgent?: string;
  viewportMetaTag?: string;
  screenOrientation?: 'portrait' | 'landscape';
  safeArea?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Standard device dimensions for preview
 * Based on common device specs and WebKit/Chrome DevTools device definitions
 */
export const DEVICE_DIMENSIONS: Record<string, DeviceDimensions> = {
  desktop: {
    width: 1280,
    height: 800,
    name: 'Desktop',
    devicePixelRatio: 1,
    screenOrientation: 'landscape'
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'Tablet (iPad)',
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    viewportMetaTag: 'width=device-width, initial-scale=1, viewport-fit=cover',
    screenOrientation: 'portrait',
    safeArea: { top: 20, right: 0, bottom: 0, left: 0 }
  },
  tabletLandscape: {
    width: 1024,
    height: 768,
    name: 'Tablet Landscape',
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    viewportMetaTag: 'width=device-width, initial-scale=1, viewport-fit=cover',
    screenOrientation: 'landscape',
    safeArea: { top: 0, right: 0, bottom: 0, left: 0 }
  },
  mobile: {
    width: 375,
    height: 667,
    name: 'Mobile (iPhone)',
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    viewportMetaTag: 'width=device-width, initial-scale=1, viewport-fit=cover',
    screenOrientation: 'portrait',
    safeArea: { top: 44, right: 0, bottom: 34, left: 0 }
  },
  mobileLandscape: {
    width: 667,
    height: 375,
    name: 'Mobile Landscape',
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    viewportMetaTag: 'width=device-width, initial-scale=1, viewport-fit=cover',
    screenOrientation: 'landscape',
    safeArea: { top: 0, right: 44, bottom: 21, left: 44 }
  },
  mobileSm: {
    width: 320,
    height: 568,
    name: 'Small Mobile (iPhone SE)',
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    viewportMetaTag: 'width=device-width, initial-scale=1, viewport-fit=cover',
    screenOrientation: 'portrait',
    safeArea: { top: 20, right: 0, bottom: 0, left: 0 }
  }
};

/**
 * Map a string to a valid device type
 */
export function mapDeviceType(device: string): DeviceType {
  switch (device) {
    case 'mobile':
    case 'mobileSm':
    case 'mobileLandscape':
      return device as DeviceType;
    case 'tablet':
    case 'tabletLandscape':
      return device as DeviceType;
    case 'desktop':
    default:
      return 'desktop';
  }
}

/**
 * Get device dimensions based on device type
 */
export function getDeviceDimensions(deviceType: string): DeviceDimensions {
  return DEVICE_DIMENSIONS[deviceType] || DEVICE_DIMENSIONS.desktop;
}

/**
 * Rotate a device between portrait and landscape
 */
export function rotateDevice(deviceType: DeviceType): DeviceType {
  switch (deviceType) {
    case 'mobile':
      return 'mobileLandscape';
    case 'mobileLandscape':
      return 'mobile';
    case 'tablet':
      return 'tabletLandscape';
    case 'tabletLandscape':
      return 'tablet';
    case 'mobileSm':
      return 'mobileLandscape'; // Small mobile rotates to standard mobile landscape
    default:
      return deviceType; // Desktop stays the same
  }
}

/**
 * Check if a device type is in landscape orientation
 */
export function isLandscapeOrientation(deviceType: DeviceType): boolean {
  return deviceType === 'mobileLandscape' || deviceType === 'tabletLandscape' || deviceType === 'desktop';
}

/**
 * Format device dimensions as a string (e.g. "375 x 667")
 */
export function formatDimensions(dimensions: DeviceDimensions): string {
  return `${dimensions.width} × ${dimensions.height}`;
}
