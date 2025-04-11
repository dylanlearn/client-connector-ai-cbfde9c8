
/**
 * Available device types for responsive preview
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Device dimensions for responsive preview
 */
export interface DeviceDimensions {
  width: number;
  height: number;
  name: string;
  devicePixelRatio?: number;
}

/**
 * Standard device dimensions for preview
 */
export const DEVICE_DIMENSIONS: Record<DeviceType, DeviceDimensions> = {
  mobile: {
    width: 375,
    height: 667,
    name: 'Mobile',
    devicePixelRatio: 2
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'Tablet',
    devicePixelRatio: 2
  },
  desktop: {
    width: 1280,
    height: 800,
    name: 'Desktop',
    devicePixelRatio: 1
  }
};

/**
 * Map a string to a valid device type
 */
export function mapDeviceType(device: string): DeviceType {
  switch (device) {
    case 'mobile':
      return 'mobile';
    case 'tablet':
      return 'tablet';
    case 'desktop':
    default:
      return 'desktop';
  }
}

/**
 * Get device dimensions based on device type
 */
export function getDeviceDimensions(deviceType: DeviceType): DeviceDimensions {
  return DEVICE_DIMENSIONS[deviceType] || DEVICE_DIMENSIONS.desktop;
}
