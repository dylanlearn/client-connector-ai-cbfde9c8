
/**
 * Utility functions for handling component variants
 */

/**
 * Get appropriate background class based on style and dark mode
 */
export const getBackgroundClass = (backgroundStyle?: string, darkMode?: boolean): string => {
  if (backgroundStyle === 'primary') {
    return darkMode ? 'bg-primary-900 text-white' : 'bg-primary-50 text-primary-900';
  }
  
  if (backgroundStyle === 'dark') {
    return 'bg-gray-900 text-white';
  }
  
  if (backgroundStyle === 'light') {
    return 'bg-gray-50 text-gray-900';
  }
  
  return darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
};

/**
 * Get appropriate alignment class
 */
export const getAlignmentClass = (alignment: string): string => {
  switch (alignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    case 'left':
    default:
      return 'text-left';
  }
};

/**
 * Get grid column class based on column count
 */
export const getGridColumns = (columns: number): string => {
  switch (columns) {
    case 2:
      return 'grid-cols-1 md:grid-cols-2';
    case 3:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case 4:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    case 1:
    default:
      return 'grid-cols-1';
  }
};
