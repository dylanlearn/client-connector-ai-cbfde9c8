
import { fabric } from 'fabric';

/**
 * Configuration for the canvas
 */
export interface WireframeCanvasConfig {
  width: number;
  height: number;
  zoom: number;
  panOffset: { x: number, y: number };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  gridType: 'lines' | 'dots' | 'columns';
  snapTolerance: number;
  backgroundColor: string;
  showSmartGuides: boolean;
  gridColor: string;
  guideColor?: string;
  showEdgeGuides?: boolean;
  showCenterGuides?: boolean;
  showDistanceIndicators?: boolean;
  magneticStrength?: number;
  [key: string]: any;
}

/**
 * Options for rendering sections
 */
export interface SectionRenderingOptions {
  width: number;
  height: number;
  darkMode: boolean;
  showGrid: boolean;
  gridSize: number;
  responsive: boolean;
  deviceType: string;
  interactive: boolean;
  showBorders: boolean;
}

/**
 * Layer information data structure 
 */
export interface LayerInfo {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  selected: boolean;
  zIndex: number;
  isGroup: boolean;
  children: LayerInfo[];
  data: any;
}

/**
 * Layer structure for nested components
 */
export interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  selected: boolean;
  zIndex: number;
  isGroup: boolean;
  children: LayerItem[];
  data: any;
}

/**
 * Result of drag operation
 */
export interface DragResult {
  success: boolean;
  message?: string;
  error?: Error;
  position?: { x: number; y: number };
}

/**
 * Alignment guides for layout
 */
export interface AlignmentGuide {
  orientation: 'horizontal' | 'vertical';
  position: number;
  type: 'edge' | 'center' | 'distribution' | 'grid' | 'left-edge' | 'right-edge' | 'top-edge' | 'bottom-edge' | 'equal-spacing';
  strength?: number;
  label?: string;
}

/**
 * Grid settings configuration
 */
export interface GridSettings {
  size: number;
  visible: boolean;
  snapToGrid: boolean;
  color: string;
  type: 'lines' | 'dots' | 'columns';
}

/**
 * Drop zone indicator for drag-and-drop 
 */
export interface DropZoneIndicator {
  active: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  type: 'valid' | 'invalid' | 'neutral';
}

/**
 * Visualization of guides
 */
export interface GuideVisualization {
  id: string;
  element: HTMLElement | null;
  guide: AlignmentGuide;
}

/**
 * Grid configuration type
 */
export interface GridConfiguration {
  visible: boolean;
  size: number;
  snapToGrid: boolean;
  type: 'lines' | 'dots' | 'columns';
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  snapThreshold: number;
  showGuides: boolean;
  guideColor: string;
  showRulers: boolean;
  rulerSize: number;
}

/**
 * Visual settings for grid display
 */
export interface GridVisualSettings {
  lineColor: string;
  lineThickness: number;
  dotSize: number;
  opacity: number;
  showLabels: boolean;
  labelColor: string;
}
