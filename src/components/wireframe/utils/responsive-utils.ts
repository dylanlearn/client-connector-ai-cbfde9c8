
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface ResponsiveOptions {
  device: DeviceType;
  width: number;
}

export interface DeviceConfig {
  type: DeviceType;
  width: number;
  height: number;
  breakpoint: number;
}

// Standard device configurations
export const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  desktop: {
    type: 'desktop',
    width: 1280,
    height: 800,
    breakpoint: 1024
  },
  tablet: {
    type: 'tablet',
    width: 768,
    height: 1024,
    breakpoint: 768
  },
  mobile: {
    type: 'mobile',
    width: 375,
    height: 667,
    breakpoint: 640
  }
};

// Get device type from viewport width
export function getDeviceTypeFromWidth(width: number): DeviceType {
  if (width < DEVICE_CONFIGS.tablet.breakpoint) {
    return 'mobile';
  } else if (width < DEVICE_CONFIGS.desktop.breakpoint) {
    return 'tablet';
  }
  return 'desktop';
}

// Apply responsive transformations to a component
export function applyResponsiveTransforms(
  component: any, 
  targetDevice: DeviceType, 
  originalDevice: DeviceType = 'desktop'
): any {
  if (!component) return component;
  
  // Clone the component to avoid mutations
  const responsiveComponent = { ...component };
  
  // Get device configs
  const originalConfig = DEVICE_CONFIGS[originalDevice];
  const targetConfig = DEVICE_CONFIGS[targetDevice];
  
  // Calculate scale factor for dimensions
  const widthFactor = targetConfig.width / originalConfig.width;
  
  // Scale dimensions if present
  if (component.dimensions) {
    responsiveComponent.dimensions = {
      width: Math.round(component.dimensions.width * widthFactor),
      height: component.dimensions.height // Keep height as is
    };
  }
  
  // Scale position if present
  if (component.position) {
    responsiveComponent.position = {
      x: Math.round(component.position.x * widthFactor),
      y: component.position.y // Keep Y position as is
    };
  }
  
  // Scale font sizes if present
  if (component.style?.fontSize) {
    const scaleFactor = targetDevice === 'mobile' ? 0.8 : 
                       targetDevice === 'tablet' ? 0.9 : 1;
                       
    responsiveComponent.style = {
      ...responsiveComponent.style,
      fontSize: typeof component.style.fontSize === 'number' 
        ? Math.round(component.style.fontSize * scaleFactor) 
        : component.style.fontSize
    };
  }
  
  // Adjust layout for mobile if present
  if (targetDevice === 'mobile' && component.layout) {
    // Mobile devices often need vertical stacks
    if (component.layout.type === 'flex' && component.layout.direction === 'row') {
      responsiveComponent.layout = {
        ...responsiveComponent.layout,
        direction: 'column'
      };
    }
    
    // Reduce columns for grid
    if (component.layout.type === 'grid' && component.layout.columns) {
      responsiveComponent.layout = {
        ...responsiveComponent.layout,
        columns: Math.min(2, component.layout.columns)
      };
    }
  }
  
  return responsiveComponent;
}

// Generate media query CSS for responsive designs
export function generateMediaQueries(componentId: string, styles: Record<DeviceType, any>): string {
  let css = '';
  
  // Base styles (desktop)
  if (styles.desktop) {
    css += `
#${componentId} {
  ${formatStyles(styles.desktop)}
}
`;
  }
  
  // Tablet styles
  if (styles.tablet) {
    css += `
@media (max-width: ${DEVICE_CONFIGS.desktop.breakpoint - 1}px) {
  #${componentId} {
    ${formatStyles(styles.tablet)}
  }
}
`;
  }
  
  // Mobile styles
  if (styles.mobile) {
    css += `
@media (max-width: ${DEVICE_CONFIGS.tablet.breakpoint - 1}px) {
  #${componentId} {
    ${formatStyles(styles.mobile)}
  }
}
`;
  }
  
  return css;
}

// Helper to format style object to CSS string
function formatStyles(styles: Record<string, any>): string {
  return Object.entries(styles)
    .map(([property, value]) => {
      // Convert camelCase to kebab-case
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssProperty}: ${value};`;
    })
    .join('\n  ');
}

// Check if the current viewport matches a specific device type
export function matchesDevice(width: number, device: DeviceType): boolean {
  switch (device) {
    case 'mobile':
      return width < DEVICE_CONFIGS.tablet.breakpoint;
    case 'tablet':
      return width >= DEVICE_CONFIGS.tablet.breakpoint && width < DEVICE_CONFIGS.desktop.breakpoint;
    case 'desktop':
      return width >= DEVICE_CONFIGS.desktop.breakpoint;
    default:
      return false;
  }
}
