// Export all utility functions
export * from './fabric-converters';
export * from './canvas-serialization';

// Export section type definitions
export type { ResponsiveLayoutSettings, AdaptiveWireframeSection } from './section-types';
export type { 
  WireframeCanvasConfig, 
  SectionRenderingOptions,
  LayerInfo,
  GridSettings,
  DropZoneIndicator,
  GuideVisualization
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

// Re-export types from canvas-types
export type { 
  GridConfig, 
  GridBreakpoint, 
  EnterpriseGridConfig 
} from '../types/canvas-types';

// Export grid system utilities
export {
  updateGridOnCanvas,
  sendGridToBack,
  removeGridFromCanvas as removeGridSystem,
  calculateColumnPositions as calculateSnapPositions,
  findClosestSnapPosition,
  showAlignmentGuides,
  removeAlignmentGuides,
  DEFAULT_GRID_CONFIG as DEFAULT_GRID_SYSTEM_CONFIG,
  DEFAULT_VISUAL_SETTINGS
} from './grid-system';

// Export grid system types explicitly
export type { GridConfiguration, AlignmentGuide, GridVisualSettings } from './grid-system';

// Import alignment guides utilities 
import alignmentGuidesUtil from './alignment-guides';

// Re-export the named exports from the default export
export const {
  generateAlignmentGuides,
  findNearestGuide,
  DEFAULT_GUIDE_OPTIONS
} = alignmentGuidesUtil;

// Export the other members that were previously trying to be exported
export const findMatchingGuides = alignmentGuidesUtil.findMatchingGuides;
export const visualizeGuides = alignmentGuidesUtil.visualizeGuides;
export const removeGuideVisualizations = alignmentGuidesUtil.removeGuideVisualizations;
export const snapObjectToGuides = alignmentGuidesUtil.snapObjectToGuides;
export const GuideHandler = alignmentGuidesUtil.GuideHandler;

// Export layer utilities
export {
  convertCanvasObjectsToLayers,
  applyLayerSettingsToObject,
  groupSelectedLayers,
  ungroupLayer,
  getFlatLayerList
} from './layer-utils';

// Export new selection and manipulation utilities
export { default as useEnhancedSelection } from '@/hooks/wireframe/use-enhanced-selection';
export { default as useAdvancedTransform } from '@/hooks/wireframe/use-advanced-transform';
export { useKeyboardShortcuts } from '@/hooks/wireframe/use-keyboard-shortcuts';
export { useEnhancedCanvasNavigation } from '@/hooks/wireframe/use-enhanced-canvas-navigation';

// Export new components
export { default as EnhancedTransformControls } from '../controls/EnhancedTransformControls';
export { default as MultiViewportCanvas } from '../navigation/MultiViewportCanvas';
export { default as CanvasMinimap } from '../navigation/CanvasMinimap';
export { default as EnhancedWireframeCanvas } from '../EnhancedWireframeCanvas';
