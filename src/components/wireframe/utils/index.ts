
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
  generateSnapGuidelines,
  createCanvasGrid,
  snapObjectToGuidelines,
  getObjectBounds as getGridObjectBounds,
  calculateColumnPositions,
  calculateGridPositions,
  getResponsiveGridConfig,
  getBreakpointFromWidth,
  DEFAULT_GRID_CONFIG,
  TAILWIND_BREAKPOINTS,
  type GridConfig,
  type GridBreakpoint
} from './grid-utils';

// Export new alignment guides utilities
export * from './alignment-guides';
