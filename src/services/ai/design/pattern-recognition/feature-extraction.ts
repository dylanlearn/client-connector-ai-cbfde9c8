
import { DesignMemoryEntry } from '../types/design-memory-types';
import { PatternFeatureVector } from './types';

/**
 * Extract a feature vector from visual elements
 */
export function extractFeatureVector(visualElements: Record<string, any>): PatternFeatureVector {
  return {
    layoutType: getLayoutFeatures(visualElements.layout || ''),
    colorContrast: getColorContrastScore(visualElements.colorScheme || {}),
    typographyScale: getTypographyFeatures(visualElements.typography || {}),
    spacingDensity: getSpacingDensity(visualElements.spacing || ''),
    componentComplexity: 0.5, // Default value
    visualHierarchy: [0.5, 0.5, 0.5] // Default values
  };
}

/**
 * Extract features from a design memory entry for pattern matching
 */
export function extractFeaturesFromMemory(entry: DesignMemoryEntry): PatternFeatureVector {
  // Process the memory entry to extract quantifiable features
  return {
    layoutType: getLayoutFeatures(entry.layout_pattern?.type || ''),
    colorContrast: getColorContrastScore(entry.color_scheme),
    typographyScale: getTypographyFeatures(entry.typography),
    spacingDensity: getSpacingDensity(entry.visual_elements?.spacing || ''),
    componentComplexity: getComponentComplexity(entry.layout_pattern),
    visualHierarchy: getVisualHierarchyFeatures(entry)
  };
}

/**
 * Extract layout features from a layout description
 */
export function getLayoutFeatures(layout: string): number[] {
  // Convert layout description to feature vector
  // This would use more sophisticated analysis in production
  if (layout.includes('split')) return [0.8, 0.2, 0.5];
  if (layout.includes('grid')) return [0.2, 0.8, 0.6];
  return [0.5, 0.5, 0.5]; // Default
}

/**
 * Analyze color contrast from color scheme
 */
export function getColorContrastScore(colorScheme: any): number {
  // Simplified implementation
  return 0.75;
}

/**
 * Extract typography features
 */
export function getTypographyFeatures(typography: any): number[] {
  // Simplified implementation
  return [0.6, 0.7, 0.5];
}

/**
 * Calculate spacing density
 */
export function getSpacingDensity(spacing: string): number {
  // Calculate spacing density
  if (spacing?.includes('generous')) return 0.3;
  if (spacing?.includes('compact')) return 0.8;
  return 0.5; // Default
}

/**
 * Analyze component complexity
 */
export function getComponentComplexity(layoutPattern: any): number {
  // Simplified implementation
  return 0.6;
}

/**
 * Extract visual hierarchy features
 */
export function getVisualHierarchyFeatures(entry: DesignMemoryEntry): number[] {
  // Simplified implementation
  return [0.7, 0.5, 0.6];
}
