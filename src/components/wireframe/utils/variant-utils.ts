
import { navigationVariants } from '@/data/component-library-variants-navigation';
import { NavigationComponentProps } from '@/types/component-library';

/**
 * Returns the variant data for a specific navigation variant
 */
export const getNavigationVariant = (variantId: string): NavigationComponentProps | undefined => {
  return navigationVariants.find(variant => variant.variant === variantId);
};

/**
 * Merges custom data with a base variant to create a complete component data object
 */
export const mergeWithVariant = <T extends { variant: string }>(
  baseVariant: T, 
  customData?: Partial<T>
): T => {
  if (!customData) {
    return baseVariant;
  }

  return {
    ...baseVariant,
    ...customData,
    // Preserve the variant identifier
    variant: customData.variant || baseVariant.variant,
  };
};

/**
 * Get the appropriate background style class based on component style
 */
export const getBackgroundClass = (style?: string, darkMode?: boolean): string => {
  if (darkMode) {
    return 'bg-gray-900 text-white';
  }

  switch (style) {
    case 'dark': 
      return 'bg-gray-900 text-white';
    case 'light': 
      return 'bg-white text-gray-800';
    case 'glass': 
      return 'bg-white/70 backdrop-blur-md text-gray-800';
    case 'transparent': 
      return 'bg-transparent';
    case 'gradient':
      return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
    case 'image':
      return 'bg-gray-800 bg-opacity-75 text-white';
    default:
      return 'bg-white text-gray-800';
  }
};

/**
 * Get alignment class for text/content
 */
export const getAlignmentClass = (alignment?: 'left' | 'center' | 'right'): string => {
  switch (alignment) {
    case 'left': return 'text-left';
    case 'center': return 'text-center';
    case 'right': return 'text-right';
    default: return 'text-left';
  }
};

/**
 * Get flex alignment class
 */
export const getFlexAlignmentClass = (alignment?: 'left' | 'center' | 'right'): string => {
  switch (alignment) {
    case 'left': return 'justify-start';
    case 'center': return 'justify-center';
    case 'right': return 'justify-end';
    default: return 'justify-between';
  }
};
