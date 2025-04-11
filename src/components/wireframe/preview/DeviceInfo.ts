
// Device dimensions and other device-specific configuration

export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'responsive' | string;

export interface DeviceDimensions {
  width: number;
  height: number;
  devicePixelRatio?: number;
  orientation?: 'portrait' | 'landscape';
}

// Standard device dimensions
export const DEVICE_DIMENSIONS: Record<DeviceType, DeviceDimensions> = {
  desktop: {
    width: 1280,
    height: 800,
    devicePixelRatio: 1,
    orientation: 'landscape'
  },
  tablet: {
    width: 768,
    height: 1024,
    devicePixelRatio: 1.5,
    orientation: 'portrait'
  },
  mobile: {
    width: 375,
    height: 667,
    devicePixelRatio: 2,
    orientation: 'portrait'
  },
  responsive: {
    width: 1280,
    height: 800,
    devicePixelRatio: 1,
    orientation: 'landscape'
  }
};

// Map extended device types to simplified ones
export function mapDeviceType(deviceType: DeviceType): 'desktop' | 'tablet' | 'mobile' {
  // Handle specific device models
  if (deviceType.includes('iphone') || deviceType.includes('android-phone')) {
    return 'mobile';
  }
  if (deviceType.includes('ipad') || deviceType.includes('tablet')) {
    return 'tablet';
  }
  
  // Handle general categories
  if (deviceType === 'mobile' || deviceType === 'phone') {
    return 'mobile';
  }
  if (deviceType === 'tablet') {
    return 'tablet';
  }
  
  // Default to desktop for any other value
  return 'desktop';
}

// Function to get the dimensions for a specific device
export function getDeviceDimensions(deviceType: DeviceType): DeviceDimensions {
  return DEVICE_DIMENSIONS[deviceType] || DEVICE_DIMENSIONS.desktop;
}

// Media query breakpoints
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1280,
  ultraWide: 1600
};

// Get current device type based on screen width
export function getCurrentDeviceType(width: number): DeviceType {
  if (width <= BREAKPOINTS.mobile) {
    return 'mobile';
  }
  if (width <= BREAKPOINTS.tablet) {
    return 'tablet';
  }
  return 'desktop';
}
