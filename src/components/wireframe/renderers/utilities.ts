
import React from 'react';

/**
 * Interface for copy suggestions
 */
export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  primaryCta?: string;
  secondaryCta?: string;
  supportText?: string;
  [key: string]: string | undefined;
}

/**
 * Create a style object for text alignment
 */
export function createStyleObject(style: Record<string, any> = {}, textAlign?: string): React.CSSProperties {
  return {
    textAlign: textAlign as React.CSSProperties['textAlign'] || 'center',
    ...style
  };
}

/**
 * Create a style object for containers with background color
 */
export function createContainerStyle(
  style: Record<string, any> = {},
  backgroundColor?: string
): React.CSSProperties {
  return {
    backgroundColor: backgroundColor || 'transparent',
    ...style
  };
}

/**
 * Create a color scheme for components
 */
export function createColorScheme(colorScheme: Record<string, string> = {}): Record<string, string> {
  return {
    primary: colorScheme.primary || '#3182CE',
    secondary: colorScheme.secondary || '#805AD5',
    accent: colorScheme.accent || '#ED8936',
    background: colorScheme.background || '#FFFFFF',
    text: colorScheme.text || '#1A202C',
    ...colorScheme
  };
}

/**
 * Get content from component or fallback
 */
export function getContentOrFallback(content?: string, fallback: string = ''): string {
  return content || fallback;
}

/**
 * Get component style or fallback
 */
export function getStyleOrFallback(
  style?: Record<string, any>,
  fallback: Record<string, any> = {}
): Record<string, any> {
  return style || fallback;
}

/**
 * Get a suggestion from copy suggestions or return fallback
 * Supports both object and array formats of CopySuggestions
 */
export function getSuggestion(
  suggestions?: CopySuggestions | CopySuggestions[] | null,
  key: string = '',
  fallback: string = ''
): string {
  if (!suggestions || !key) return fallback;
  
  // Handle array format
  if (Array.isArray(suggestions)) {
    // Use the first item in the array if available
    return suggestions.length > 0 && suggestions[0][key] 
      ? String(suggestions[0][key]) 
      : fallback;
  }
  
  // Handle object format
  return suggestions[key] ? String(suggestions[key]) : fallback;
}

/**
 * Process copy suggestions object to ensure all needed fields
 */
export function processCopySuggestions(
  suggestions?: CopySuggestions | CopySuggestions[] | null
): CopySuggestions {
  if (!suggestions) return {};
  
  // Handle array format
  if (Array.isArray(suggestions)) {
    // Use the first item in the array if available
    return suggestions.length > 0 ? { ...suggestions[0] } : {};
  }
  
  // Handle object format
  return { ...suggestions };
}
