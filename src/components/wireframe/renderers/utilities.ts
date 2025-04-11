
import { WireframeSection, WireframeComponent, CopySuggestions } from '@/services/ai/wireframe/wireframe-types';

// Helper functions for wireframe component rendering

/**
 * Gets a suggested text value for a specific key, or returns a fallback
 */
export function getSuggestedText(
  copySuggestions: CopySuggestions | undefined,
  key: string,
  fallback: string = ''
): string {
  if (!copySuggestions) return fallback;
  return copySuggestions[key] || fallback;
}

/**
 * Transforms a section type to a more readable display format
 */
export function formatSectionType(sectionType: string): string {
  if (!sectionType) return 'Unknown Section';
  
  // Split by hyphens and capitalize
  return sectionType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Gets responsive class based on the current device
 */
export function getResponsiveClass(component: WireframeComponent, deviceType: string): string {
  if (!component.responsive) return '';
  
  const responsiveClasses = {
    mobile: component.responsive.mobile?.className || '',
    tablet: component.responsive.tablet?.className || '',
    desktop: component.responsive.desktop?.className || ''
  };
  
  return responsiveClasses[deviceType as keyof typeof responsiveClasses] || '';
}

/**
 * Merges component styles with responsive styles for current device
 */
export function getResponsiveStyles(
  component: WireframeComponent,
  deviceType: string
): Record<string, any> {
  const baseStyles = component.style || {};
  
  if (!component.responsive) return baseStyles;
  
  const deviceStyles = component.responsive[deviceType as keyof typeof component.responsive] || {};
  
  return {
    ...baseStyles,
    ...deviceStyles
  };
}
