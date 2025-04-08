
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Get the background class based on backgroundStyle
 */
export function getBackgroundClass(backgroundStyle?: string | null, darkMode = false): string {
  if (!backgroundStyle) return darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800';
  
  switch (backgroundStyle) {
    case 'dark':
      return 'bg-gray-900 text-gray-100';
    case 'light':
      return 'bg-white text-gray-800';
    case 'primary':
      return darkMode ? 
        'bg-primary text-primary-foreground' : 
        'bg-primary/10 text-primary-foreground/90';
    case 'secondary':
      return darkMode ? 
        'bg-secondary text-secondary-foreground' : 
        'bg-secondary/10 text-secondary-foreground/90';
    case 'muted':
      return 'bg-muted text-muted-foreground';
    case 'gradient':
      return 'bg-gradient-to-r from-primary/80 to-secondary/80 text-white';
    case 'image':
      return 'bg-cover bg-center text-white';
    default:
      return darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800';
  }
}

/**
 * Get the alignment class based on alignment string
 */
export function getAlignmentClass(alignment?: string): string {
  if (!alignment) return 'text-center';
  
  switch (alignment) {
    case 'left':
      return 'text-left';
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-center';
  }
}

/**
 * Get layout classes based on layout type
 */
export function getLayoutClasses(layout?: string | { type: string; alignment: string }): string {
  if (!layout) return 'grid grid-cols-1 md:grid-cols-3 gap-4';
  
  // Handle string layout types
  if (typeof layout === 'string') {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-3 gap-4';
      case 'columns':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 'single':
        return 'max-w-3xl mx-auto';
      case 'full':
        return 'w-full';
      default:
        return 'grid grid-cols-1 md:grid-cols-3 gap-4';
    }
  }
  
  // Handle object layout types
  switch (layout.type) {
    case 'grid':
      return 'grid grid-cols-1 md:grid-cols-3 gap-4';
    case 'columns':
      return 'grid grid-cols-1 md:grid-cols-2 gap-6';
    case 'asymmetric':
      return 'grid grid-cols-1 md:grid-cols-3 gap-4 [&>*:first-child]:col-span-2';
    default:
      return 'grid grid-cols-1 md:grid-cols-3 gap-4';
  }
}

/**
 * Get image classes based on image variant
 */
export function getImageClasses(variant?: string): string {
  if (!variant) return 'rounded-lg object-cover w-full h-full';
  
  switch (variant) {
    case 'rounded':
      return 'rounded-full object-cover w-full h-full';
    case 'shadowed':
      return 'rounded-lg shadow-xl object-cover w-full h-full';
    case 'bordered':
      return 'rounded-lg border-2 border-primary object-cover w-full h-full';
    default:
      return 'rounded-lg object-cover w-full h-full';
  }
}

/**
 * Get the appropriate component variant
 */
export function getComponentVariant(section: WireframeSection, defaultVariant: string = 'default'): string {
  return section.componentVariant || defaultVariant;
}
