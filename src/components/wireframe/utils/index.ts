
// Export all utility functions
export * from './fabric-converters';
export * from './canvas-serialization';

// Export functions and types from section-utils
export {
  getResponsiveLayout,
  isSectionVisibleOnDevice,
  getResponsiveContent,
  createResponsiveVariation,
  cloneSection,
  createEmptySection,
  createGridSection,
  makeFullyResponsive,
  getResponsiveTailwindClasses,
  calculateSectionsBounds,
  findAlignmentGuides,
  // Rename to avoid conflict with getResponsiveStyles from responsive-utils
  getResponsiveStyles as getSectionResponsiveStyles
} from './section-utils';

// Export types with 'export type' syntax to fix the isolatedModules error
export type { ResponsiveLayoutSettings } from './section-utils';
export type { AdaptiveWireframeSection } from './section-utils';

// Export from responsive-utils
export * from './responsive-utils';

// Export grid utilities 
export * from './grid-utils';
