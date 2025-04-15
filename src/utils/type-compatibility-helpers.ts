
import { WireframeColorScheme, WireframeTypography } from '@/services/ai/wireframe/wireframe-types';

/**
 * Convert typography object to record for storage
 */
export function typographyToRecord(typography?: WireframeTypography): Record<string, string> {
  if (!typography) {
    return {
      headings: 'Inter',
      body: 'Inter'
    };
  }
  
  return {
    headings: typography.headings || 'Inter',
    body: typography.body || 'Inter'
  };
}

/**
 * Convert color scheme object to record for storage
 */
export function colorSchemeToRecord(colorScheme?: WireframeColorScheme): Record<string, string> {
  if (!colorScheme) {
    return {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    };
  }
  
  return {
    primary: colorScheme.primary || '#3182ce',
    secondary: colorScheme.secondary || '#805ad5',
    accent: colorScheme.accent || '#ed8936',
    background: colorScheme.background || '#ffffff',
    text: colorScheme.text || '#1a202c'
  };
}

/**
 * Convert record back to typography
 */
export function recordToTypography(record?: Record<string, string>): WireframeTypography {
  if (!record) {
    return {
      headings: 'Inter',
      body: 'Inter'
    };
  }
  
  return {
    headings: record.headings || 'Inter',
    body: record.body || 'Inter'
  };
}

/**
 * Convert record back to color scheme
 */
export function recordToColorScheme(record?: Record<string, string>): WireframeColorScheme {
  if (!record) {
    return {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    };
  }
  
  return {
    primary: record.primary || '#3182ce',
    secondary: record.secondary || '#805ad5',
    accent: record.accent || '#ed8936',
    background: record.background || '#ffffff',
    text: record.text || '#1a202c'
  };
}

/**
 * Generate a unique ID with an optional prefix
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}
