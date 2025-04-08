
/**
 * Utility functions for handling component variants and styles
 */

/**
 * Get background class based on style and dark mode
 */
export function getBackgroundClass(backgroundStyle?: string, darkMode: boolean = false): string {
  if (darkMode) {
    // Dark mode styles take precedence
    return 'bg-gray-900 text-white';
  }
  
  switch (backgroundStyle) {
    case 'dark':
      return 'bg-gray-900 text-white';
    case 'light':
      return 'bg-white text-gray-900';
    case 'image':
      return 'bg-gray-900 bg-opacity-60 text-white';
    case 'gradient':
      return 'bg-gradient-to-r from-primary/80 to-primary text-white';
    default:
      return 'bg-white text-gray-900';
  }
}

/**
 * Get alignment class based on alignment string
 */
export function getAlignmentClass(alignment: string): string {
  switch (alignment) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    case 'center':
      return 'text-center';
    default:
      return 'text-left';
  }
}

/**
 * Generate grid columns class based on count
 */
export function getGridColumns(count: number): string {
  switch (count) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-1 md:grid-cols-2';
    case 3:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case 4:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    default:
      return 'grid-cols-1 md:grid-cols-3';
  }
}
