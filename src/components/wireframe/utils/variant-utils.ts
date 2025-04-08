
/**
 * Get the appropriate background class based on the specified style and dark mode
 */
export const getBackgroundClass = (backgroundStyle?: string, darkMode = false): string => {
  // Default background classes
  const defaultLight = 'bg-white text-gray-900';
  const defaultDark = 'bg-gray-900 text-white';
  
  // If dark mode is forced, use dark theme
  if (darkMode) {
    return defaultDark;
  }
  
  // Select background class based on style
  switch (backgroundStyle) {
    case 'light':
      return defaultLight;
    case 'dark':
      return defaultDark;
    case 'primary':
      return 'bg-primary text-white';
    case 'secondary':
      return 'bg-secondary text-secondary-foreground';
    case 'muted':
      return 'bg-muted text-muted-foreground';
    case 'accent':
      return 'bg-accent text-accent-foreground';
    case 'gray':
      return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white';
    case 'gradient':
      return 'bg-gradient-to-r from-primary to-primary/60 text-white';
    default:
      return defaultLight;
  }
};

/**
 * Get the appropriate alignment class
 */
export const getAlignmentClass = (alignment: string): string => {
  switch (alignment) {
    case 'left':
      return 'text-left';
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
};

/**
 * Get the spacing class based on the size
 */
export const getSpacingClass = (size?: 'small' | 'medium' | 'large'): string => {
  switch (size) {
    case 'small':
      return 'py-8';
    case 'medium':
      return 'py-12';
    case 'large':
      return 'py-16';
    default:
      return 'py-12';
  }
};

/**
 * Get responsive width class based on width setting
 */
export const getWidthClass = (width?: 'narrow' | 'normal' | 'wide' | 'full'): string => {
  switch (width) {
    case 'narrow':
      return 'max-w-2xl mx-auto';
    case 'normal':
      return 'max-w-4xl mx-auto';
    case 'wide':
      return 'max-w-6xl mx-auto';
    case 'full':
      return 'w-full';
    default:
      return 'max-w-4xl mx-auto';
  }
};
