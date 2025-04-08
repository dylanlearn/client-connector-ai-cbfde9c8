
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Utility functions for working with wireframe sections
 */

/**
 * Generate a unique ID for a section
 */
export function generateSectionId(): string {
  return `section-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Deep clone a section to avoid reference issues
 */
export function cloneSection(section: WireframeSection): WireframeSection {
  return JSON.parse(JSON.stringify(section));
}

/**
 * Calculate the default dimensions for a section based on its type
 */
export function getDefaultSectionDimensions(sectionType: string): { width: number; height: number } {
  // Default dimensions for different section types
  const dimensionsByType: Record<string, { width: number; height: number }> = {
    hero: { width: 800, height: 400 },
    features: { width: 800, height: 300 },
    testimonials: { width: 800, height: 250 },
    footer: { width: 800, height: 150 },
    cta: { width: 800, height: 200 },
    // Add more section types as needed
  };

  // Return specific dimensions if available, or default
  return dimensionsByType[sectionType.toLowerCase()] || { width: 800, height: 250 };
}

/**
 * Check if a section has valid position data
 */
export function hasValidPosition(section: WireframeSection): boolean {
  return (
    section.position !== undefined &&
    typeof section.position.x === 'number' &&
    typeof section.position.y === 'number'
  );
}

/**
 * Get the background color for a section based on its style properties
 */
export function getSectionBackgroundColor(section: WireframeSection): string {
  if (!section.styleProperties) return '#ffffff';
  
  switch (section.styleProperties.backgroundStyle) {
    case 'dark':
      return '#333333';
    case 'accent':
      return '#f0f9ff';
    default:
      return '#ffffff';
  }
}
