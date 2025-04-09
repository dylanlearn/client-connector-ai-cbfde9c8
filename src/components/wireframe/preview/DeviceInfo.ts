
export const DEVICE_DIMENSIONS = {
  desktop: { 
    width: '100%', 
    height: '600px',
    label: 'Desktop (1024px+)'
  },
  tablet: { 
    width: '768px', 
    height: '1024px',
    label: 'Tablet (768px)'
  },
  tabletLandscape: {
    width: '1024px',
    height: '768px',
    label: 'Tablet Landscape'
  },
  mobile: { 
    width: '375px', 
    height: '667px',
    label: 'Mobile (375px)'
  },
  mobileLandscape: {
    width: '667px',
    height: '375px',
    label: 'Mobile Landscape'
  },
  mobileSm: {
    width: '320px',
    height: '568px',
    label: 'Small Mobile (320px)'
  }
};

export type DeviceType = keyof typeof DEVICE_DIMENSIONS;
