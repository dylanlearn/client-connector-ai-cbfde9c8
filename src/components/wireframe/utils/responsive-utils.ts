
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

// Define breakpoint types
export type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Define breakpoint values
export const BREAKPOINT_VALUES: Record<BreakpointKey, number> = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536
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

// Function to get breakpoint for device
export function getBreakpointForDevice(device: DeviceType): BreakpointKey {
  switch (device) {
    case 'mobile': return 'sm';
    case 'tablet': return 'md';
    case 'desktop': return 'lg';
    default: return 'lg';
  }
}

// Check if layout is fluid
export function isFluidLayout(layoutType: string): boolean {
  return ['fluid', 'responsive', 'adaptive'].includes(layoutType);
}

// Get responsive grid columns
export function getResponsiveGridColumns(device: DeviceType, defaultColumns: number = 12): number {
  switch (device) {
    case 'mobile': return 4;
    case 'tablet': return 8;
    case 'desktop': return defaultColumns;
    default: return defaultColumns;
  }
}

// Get responsive gutter size
export function getResponsiveGutterSize(device: DeviceType, defaultGutter: number = 16): number {
  switch (device) {
    case 'mobile': return Math.max(8, defaultGutter / 2);
    case 'tablet': return Math.max(12, defaultGutter / 1.5);
    case 'desktop': return defaultGutter;
    default: return defaultGutter;
  }
}

// Generate responsive Tailwind classes
export function responsiveTailwindClasses(options: {
  base: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}): string {
  return [
    options.base,
    options.sm ? `sm:${options.sm}` : '',
    options.md ? `md:${options.md}` : '',
    options.lg ? `lg:${options.lg}` : '',
    options.xl ? `xl:${options.xl}` : ''
  ].filter(Boolean).join(' ');
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

// Get responsive styles for components
export function getResponsiveStyles(baseStyles: Record<string, any>, device: DeviceType): Record<string, any> {
  if (!baseStyles) return {};
  
  const responsiveStyles = { ...baseStyles };
  
  // Adjust styles based on device
  if (device === 'mobile') {
    // Decrease padding and margins by 50% for mobile
    if (responsiveStyles.padding) responsiveStyles.padding = Math.round(responsiveStyles.padding * 0.5);
    if (responsiveStyles.margin) responsiveStyles.margin = Math.round(responsiveStyles.margin * 0.5);
    // Decrease font size by 20% for mobile
    if (responsiveStyles.fontSize) responsiveStyles.fontSize = Math.round(responsiveStyles.fontSize * 0.8);
  } else if (device === 'tablet') {
    // Decrease padding and margins by 25% for tablet
    if (responsiveStyles.padding) responsiveStyles.padding = Math.round(responsiveStyles.padding * 0.75);
    if (responsiveStyles.margin) responsiveStyles.margin = Math.round(responsiveStyles.margin * 0.75);
    // Decrease font size by 10% for tablet
    if (responsiveStyles.fontSize) responsiveStyles.fontSize = Math.round(responsiveStyles.fontSize * 0.9);
  }
  
  return responsiveStyles;
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

