
import { getSuggestion, createStyleObject, parseDimension } from '@/utils/copy-suggestions-helper';

/**
 * Create responsive styles based on device type
 */
export function createResponsiveStyles(
  baseStyles: Record<string, any>,
  deviceType: 'mobile' | 'tablet' | 'desktop',
  darkMode: boolean
): Record<string, any> {
  const responsiveStyles = { ...baseStyles };
  
  // Adjust font sizes for mobile
  if (deviceType === 'mobile') {
    if (responsiveStyles.fontSize) {
      // Reduce font sizes by 20% on mobile
      const fontSize = parseFontSize(responsiveStyles.fontSize);
      if (fontSize.value && fontSize.unit) {
        responsiveStyles.fontSize = `${Math.max(fontSize.value * 0.8, 12)}${fontSize.unit}`;
      }
    }
    
    // Adjust padding for mobile
    if (responsiveStyles.padding) {
      responsiveStyles.padding = adjustSpacingForMobile(responsiveStyles.padding);
    }
    
    // Adjust margin for mobile
    if (responsiveStyles.margin) {
      responsiveStyles.margin = adjustSpacingForMobile(responsiveStyles.margin);
    }
  }
  
  // Adjust styles for tablet
  if (deviceType === 'tablet') {
    if (responsiveStyles.fontSize) {
      // Reduce font sizes by 10% on tablet
      const fontSize = parseFontSize(responsiveStyles.fontSize);
      if (fontSize.value && fontSize.unit) {
        responsiveStyles.fontSize = `${Math.max(fontSize.value * 0.9, 12)}${fontSize.unit}`;
      }
    }
  }
  
  // Adjust styles for dark mode
  if (darkMode) {
    if (responsiveStyles.backgroundColor && !responsiveStyles.backgroundColor.includes('rgba')) {
      // Darken background colors in dark mode if they're not already dark
      if (!isColorDark(responsiveStyles.backgroundColor)) {
        responsiveStyles.backgroundColor = getColorForDarkMode(responsiveStyles.backgroundColor);
      }
    }
    
    if (responsiveStyles.color && !isColorLight(responsiveStyles.color)) {
      // Lighten text colors in dark mode
      responsiveStyles.color = '#ffffff';
    }
  }
  
  return responsiveStyles;
}

/**
 * Parses a CSS font size into value and unit
 */
function parseFontSize(fontSize: string): { value: number | null, unit: string | null } {
  const match = fontSize.match(/^(\d+(?:\.\d+)?)(\D+)$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2]
    };
  }
  return { value: null, unit: null };
}

/**
 * Adjust spacing values for mobile view
 */
function adjustSpacingForMobile(spacing: string): string {
  // Handle single value
  if (!spacing.includes(' ')) {
    const { value, unit } = parseSpacing(spacing);
    if (value !== null && unit !== null) {
      return `${Math.max(value * 0.7, 4)}${unit}`;
    }
    return spacing;
  }
  
  // Handle multiple values (e.g., "10px 20px 10px 20px")
  const values = spacing.split(' ');
  const adjusted = values.map(val => {
    const { value, unit } = parseSpacing(val);
    if (value !== null && unit !== null) {
      return `${Math.max(value * 0.7, 4)}${unit}`;
    }
    return val;
  });
  
  return adjusted.join(' ');
}

/**
 * Parse spacing value into value and unit
 */
function parseSpacing(spacing: string): { value: number | null, unit: string | null } {
  const match = spacing.match(/^(\d+(?:\.\d+)?)(\D+)$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2]
    };
  }
  return { value: null, unit: null };
}

/**
 * Check if a color is dark
 */
function isColorDark(color: string): boolean {
  // Simple check based on color name
  const darkColors = ['black', 'dark', '#000', '#111', '#222', '#333', '#444', '#555'];
  return darkColors.some(dc => color.includes(dc));
}

/**
 * Check if a color is light
 */
function isColorLight(color: string): boolean {
  // Simple check based on color name
  const lightColors = ['white', 'light', '#fff', '#eee', '#ddd', '#ccc', '#f'];
  return lightColors.some(lc => color.includes(lc));
}

/**
 * Get appropriate color for dark mode
 */
function getColorForDarkMode(color: string): string {
  // Simple color mapping for dark mode
  const colorMap: Record<string, string> = {
    '#ffffff': '#1f2937',
    'white': '#1f2937',
    '#f9fafb': '#111827',
    '#f3f4f6': '#1f2937',
    '#e5e7eb': '#374151',
    '#d1d5db': '#4b5563',
    '#9ca3af': '#6b7280',
    '#6b7280': '#9ca3af',
    '#4b5563': '#d1d5db',
    '#374151': '#e5e7eb',
    '#1f2937': '#f3f4f6',
    '#111827': '#f9fafb',
    'black': 'white'
  };
  
  return colorMap[color] || '#1f2937';
}

/**
 * Get appropriate text color based on background
 */
export function getTextColorForBackground(bgColor: string, darkMode: boolean): string {
  if (darkMode) {
    return '#ffffff';
  }
  
  // Simple check to determine text color
  return isColorDark(bgColor) ? '#ffffff' : '#111827';
}

// Re-export utility functions from copy-suggestions-helper
export {
  getSuggestion,
  createStyleObject,
  parseDimension
};
