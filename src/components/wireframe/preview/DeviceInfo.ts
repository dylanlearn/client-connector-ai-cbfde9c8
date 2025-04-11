
export type DeviceType = 'desktop' | 'tablet' | 'tabletLandscape' | 'mobile' | 'mobileLandscape' | 'mobileSm';

export interface DeviceDimensions {
  name: string;
  width: number;
  height: number;
  devicePixelRatio?: number;
  userAgent?: string;
  aspectRatio?: number;
}

export const DEVICE_DIMENSIONS: Record<DeviceType, DeviceDimensions> = {
  desktop: {
    name: 'Desktop',
    width: 1280,
    height: 720,
    devicePixelRatio: 1,
    aspectRatio: 16 / 9
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    devicePixelRatio: 2,
    userAgent: 'iPad',
    aspectRatio: 3 / 4
  },
  tabletLandscape: {
    name: 'Tablet Landscape',
    width: 1024,
    height: 768,
    devicePixelRatio: 2,
    userAgent: 'iPad',
    aspectRatio: 4 / 3
  },
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    devicePixelRatio: 2,
    userAgent: 'iPhone',
    aspectRatio: 9 / 16
  },
  mobileLandscape: {
    name: 'Mobile Landscape',
    width: 667,
    height: 375,
    devicePixelRatio: 2,
    userAgent: 'iPhone',
    aspectRatio: 16 / 9
  },
  mobileSm: {
    name: 'Small Mobile',
    width: 320,
    height: 568,
    devicePixelRatio: 2,
    userAgent: 'iPhone SE',
    aspectRatio: 9 / 16
  }
};

export const mapDeviceType = (deviceType: DeviceType): 'desktop' | 'tablet' | 'mobile' => {
  if (deviceType === 'desktop') return 'desktop';
  if (deviceType === 'tablet' || deviceType === 'tabletLandscape') return 'tablet';
  return 'mobile';
};

export const getDeviceDimensions = (deviceType: DeviceType): DeviceDimensions => {
  return DEVICE_DIMENSIONS[deviceType] || DEVICE_DIMENSIONS.desktop;
};
