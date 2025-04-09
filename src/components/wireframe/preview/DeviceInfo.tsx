
// This file contains device dimension information and type definitions

export type DeviceType = 'desktop' | 'tablet' | 'tabletLandscape' | 'mobile' | 'mobileLandscape' | 'mobileSm';

export interface DeviceDimensions {
  width: number;
  height: number;
  name: string;
  description?: string;
}

// Define standard device dimensions
export const DEVICE_DIMENSIONS: Record<DeviceType, DeviceDimensions> = {
  desktop: {
    width: 1200,
    height: 900,
    name: "Desktop",
    description: "Standard desktop view"
  },
  tablet: {
    width: 768,
    height: 1024,
    name: "Tablet Portrait",
    description: "Standard tablet in portrait orientation"
  },
  tabletLandscape: {
    width: 1024,
    height: 768,
    name: "Tablet Landscape",
    description: "Standard tablet in landscape orientation"
  },
  mobile: {
    width: 375,
    height: 667,
    name: "Mobile Portrait",
    description: "Standard mobile in portrait orientation"
  },
  mobileLandscape: {
    width: 667,
    height: 375,
    name: "Mobile Landscape",
    description: "Standard mobile in landscape orientation"
  },
  mobileSm: {
    width: 320,
    height: 568,
    name: "Small Mobile",
    description: "Small mobile device in portrait orientation"
  }
};
