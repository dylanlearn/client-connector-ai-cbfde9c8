
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

