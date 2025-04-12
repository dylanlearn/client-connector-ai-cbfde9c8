
// Export all utility functions
export * from './fabric-converters';
export * from './canvas-serialization';

// Export section type definitions
export type { ResponsiveLayoutSettings, AdaptiveWireframeSection } from './section-types';
export type { 
  WireframeCanvasConfig, 
  SectionRenderingOptions,
  AlignmentGuide,
  LayerInfo,
  GridSettings,
  DropZoneIndicator,
  GuideVisualization,
  GridConfiguration,
  GridVisualSettings
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

// Export grid utilities
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

// Export grid system utilities
export {
  updateGridOnCanvas,
  sendGridToBack,
  removeGridFromCanvas as removeGridSystem,
  calculateSnapPositions,
  findClosestSnapPosition,
  showAlignmentGuides,
  removeAlignmentGuides,
  DEFAULT_GRID_CONFIG as DEFAULT_GRID_SYSTEM_CONFIG,
  DEFAULT_VISUAL_SETTINGS
} from './grid-system';

// Export alignment guides utilities
export {
  generateAlignmentGuides,
  findMatchingGuides,
  visualizeGuides,
  removeGuideVisualizations,
  snapObjectToGuides,
  GuideHandler
} from './alignment-guides';

// Export layer utilities
export {
  convertCanvasObjectsToLayers,
  applyLayerSettingsToObject,
  groupSelectedLayers,
  ungroupLayer,
  getFlatLayerList
} from './layer-utils';
