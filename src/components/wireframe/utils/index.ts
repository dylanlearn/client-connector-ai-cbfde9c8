
// Export all utility functions
export * from './fabric-converters';
export * from './canvas-serialization';

// Export section type definitions
export type { ResponsiveLayoutSettings, AdaptiveWireframeSection } from './section-types';
export type { 
  WireframeCanvasConfig, 
  SectionRenderingOptions,
  AlignmentGuide
} from './types';

// Export responsive layout utilities
export {
  getResponsiveLayout,
  isSectionVisibleOnDevice,
  getResponsiveContent,
  getResponsiveStyles,
  getResponsiveTailwindClasses,
  createResponsiveVariation,
  makeFullyResponsive
} from './responsive-layout-utils';

// Export section creation utilities
export {
  cloneSection,
  createEmptySection,
  createGridSection
} from './section-creation-utils';

// Export section layout utilities
export {
  calculateSectionsBounds,
  findAlignmentGuides
} from './section-layout-utils';

// Export from responsive-utils
export * from './responsive-utils';

// Export grid utilities - explicitly re-export from grid-utils
export { 
  createCanvasGrid,
  removeGridFromCanvas,
  updateCanvasGrid,
  calculateColumnPositions,
  calculateGridPositions,
  getResponsiveGridConfig,
  getBreakpointFromWidth,
  getObjectBounds,
  generateSnapGuidelines,
  snapObjectToGuidelines,
  DEFAULT_GRID_CONFIG,
  TAILWIND_BREAKPOINTS,
} from './grid-utils';

// Re-export types from grid-utils
export type { GridConfig, GridBreakpoint } from './grid-utils';

// Export new alignment guides utilities
export * from './alignment-guides';
