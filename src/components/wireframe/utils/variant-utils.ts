
/**
 * Utility functions for handling component variants and styling
 */

// Get background class based on style and dark mode
export function getBackgroundClass(backgroundStyle: string = 'light', darkMode: boolean = false): string {
  if (darkMode) {
    // In dark mode
    switch (backgroundStyle) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'gradient':
        return 'bg-gradient-to-br from-gray-800 to-gray-950 text-gray-100';
      case 'image':
        return 'bg-gray-900 text-gray-100 bg-opacity-90';
      case 'light':
      default:
        return 'bg-gray-800 text-gray-100';
    }
  } else {
    // In light mode
    switch (backgroundStyle) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'gradient':
        return 'bg-gradient-to-br from-primary-50 to-primary-200 text-gray-900';
      case 'image':
        return 'bg-gray-50 text-gray-900';
      case 'light':
      default:
        return 'bg-white text-gray-900';
    }
  }
}

// Get text alignment class
export function getAlignmentClass(alignment: string = 'center'): string {
  switch (alignment) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    case 'center':
    default:
      return 'text-center';
  }
}

// Get spacing class based on size
export function getSpacingClass(size: string = 'medium'): string {
  switch (size) {
    case 'small':
      return 'py-8';
    case 'large':
      return 'py-20';
    case 'medium':
    default:
      return 'py-12';
  }
}

// Get grid columns class based on count
export function getGridColumnsClass(columns: number = 3): string {
  switch (columns) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-1 md:grid-cols-2';
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    case 3:
    default:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  }
}

// Generate responsive width class
export function getResponsiveWidthClass(width: string = 'full'): string {
  switch (width) {
    case 'narrow':
      return 'w-full max-w-md mx-auto';
    case 'medium':
      return 'w-full max-w-2xl mx-auto';
    case 'wide':
      return 'w-full max-w-4xl mx-auto';
    case 'full':
    default:
      return 'w-full';
  }
}
