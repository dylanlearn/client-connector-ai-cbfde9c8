
// Export all preview-related components and types
export { default as DeviceControls } from './DeviceControls';
export { default as PreviewDisplay } from './PreviewDisplay';
export { default as PreviewHeader } from './PreviewHeader';
export { 
  DEVICE_DIMENSIONS, 
  mapDeviceType,
  type DeviceType, 
  type DeviceDimensions 
} from './DeviceInfo';

// Export responsive utilities from responsive-utils
export {
  getResponsiveValue,
  getDeviceTypeFromWidth,
  calculateResponsiveDimensions,
  makeComponentResponsive,
  pxToRem,
  remToPx,
  // Newly added exports
  type ResponsiveOptions,
  type BreakpointKey,
  BREAKPOINT_VALUES,
  getBreakpointForDevice,
  getResponsiveStyles,
  isFluidLayout,
  getResponsiveGridColumns,
  getResponsiveGutterSize,
  responsiveTailwindClasses,
} from '../utils/responsive-utils';

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
} from '../utils/grid-utils';

// Re-export types from canvas-types
export type { GridConfig, GridBreakpoint, EnterpriseGridConfig } from '../types/canvas-types';

// Export new alignment guides utilities
export * from './alignment-guides';
