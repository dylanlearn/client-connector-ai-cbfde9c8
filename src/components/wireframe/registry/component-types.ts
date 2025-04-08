
// Utility functions for responsive design in component registry

// Device breakpoints
export const deviceBreakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 1024
};

// Get styles for specific device type
export function getDeviceStyles(
  baseStyles: Record<string, any>,
  responsiveConfig: Record<string, any>,
  deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): Record<string, any> {
  // Start with base styles
  let deviceStyles = { ...baseStyles };
  
  // Apply device-specific overrides
  if (responsiveConfig && responsiveConfig[deviceType]) {
    deviceStyles = {
      ...deviceStyles,
      ...responsiveConfig[deviceType]
    };
  }
  
  return deviceStyles;
}

// Convert style object to Tailwind classes
export function styleOptionsToTailwind(styleOptions: Record<string, any>): string {
  const classes: string[] = [];
  
  // Map style options to Tailwind classes
  if (styleOptions.padding) classes.push(`p-${styleOptions.padding}`);
  if (styleOptions.margin) classes.push(`m-${styleOptions.margin}`);
  if (styleOptions.backgroundColor) classes.push(`bg-${styleOptions.backgroundColor}`);
  if (styleOptions.textColor) classes.push(`text-${styleOptions.textColor}`);
  if (styleOptions.fontSize) classes.push(`text-${styleOptions.fontSize}`);
  if (styleOptions.fontWeight) classes.push(`font-${styleOptions.fontWeight}`);
  if (styleOptions.borderRadius) classes.push(`rounded-${styleOptions.borderRadius}`);
  if (styleOptions.width) classes.push(`w-${styleOptions.width}`);
  if (styleOptions.height) classes.push(`h-${styleOptions.height}`);
  if (styleOptions.display) classes.push(`${styleOptions.display}`);
  if (styleOptions.flexDirection) classes.push(`flex-${styleOptions.flexDirection}`);
  if (styleOptions.justifyContent) classes.push(`justify-${styleOptions.justifyContent}`);
  if (styleOptions.alignItems) classes.push(`items-${styleOptions.alignItems}`);
  if (styleOptions.gap) classes.push(`gap-${styleOptions.gap}`);
  
  return classes.join(' ');
}

export interface ComponentField {
  id: string;
  name: string;
  type: string;
  description?: string;
  options?: { label: string; value: string | number | boolean }[];
  defaultValue: any;
  validation?: any;
}

// Add utility functions for variant handling
export function getVariantOptions(type: string): { label: string; value: string }[] {
  // This would normally come from a database or configuration
  // For now, return a static list based on type
  switch (type) {
    case 'hero':
      return [
        { label: 'Centered', value: 'centered' },
        { label: 'Split', value: 'split' },
        { label: 'Overlay', value: 'overlay' }
      ];
    case 'feature':
      return [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Cards', value: 'cards' }
      ];
    default:
      return [];
  }
}

// Convert component data to tailwind classes
export function componentDataToClasses(componentType: string, data: any): string {
  const classes: string[] = [];
  
  // Base styles for all components
  classes.push('relative');
  
  // Apply styles based on component type and data
  if (componentType === 'hero') {
    if (data.size === 'large') classes.push('py-20');
    else if (data.size === 'medium') classes.push('py-12');
    else classes.push('py-8');
    
    if (data.background === 'dark') classes.push('bg-gray-900 text-white');
    else if (data.background === 'light') classes.push('bg-white text-gray-900');
    else if (data.background === 'gradient') classes.push('bg-gradient-to-r from-primary to-primary/70 text-white');
  }
  
  return classes.join(' ');
}
