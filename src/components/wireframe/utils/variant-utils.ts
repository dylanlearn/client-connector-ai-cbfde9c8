
/**
 * Get the appropriate background class based on the style
 */
export function getBackgroundClass(backgroundStyle?: string, darkMode: boolean = false): string {
  if (!backgroundStyle) {
    return darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  }
  
  switch (backgroundStyle) {
    case 'primary':
      return 'bg-primary text-primary-foreground';
    case 'secondary':
      return 'bg-secondary text-secondary-foreground';
    case 'muted':
      return 'bg-muted text-muted-foreground';
    case 'accent':
      return 'bg-accent text-accent-foreground';
    case 'dark':
      return 'bg-gray-900 text-white';
    case 'light':
      return 'bg-gray-50 text-gray-900';
    case 'gradient':
      return 'bg-gradient-to-r from-primary to-purple-600 text-white';
    default:
      return darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  }
}

/**
 * Get the appropriate alignment class
 */
export function getAlignmentClass(alignment?: string): string {
  switch (alignment) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    case 'center':
      return 'text-center';
    case 'justify':
      return 'text-justify';
    default:
      return 'text-center';
  }
}
