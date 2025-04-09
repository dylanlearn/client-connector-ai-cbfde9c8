
// Basic types for wireframe canvas system
import { fabric } from 'fabric';

// Configuration for the wireframe canvas
export interface WireframeCanvasConfig {
  width: number;
  height: number;
  zoom: number;
  panOffset: { x: number; y: number };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  gridType: 'lines' | 'dots' | 'columns';
  snapTolerance: number;
  backgroundColor: string;
  showSmartGuides: boolean;
  showRulers?: boolean;
  rulerSize?: number;
}

// Options for rendering sections
export interface SectionRenderingOptions {
  responsive?: boolean;
  darkMode?: boolean;
  showGrid?: boolean;
  gridSize?: number;
}

// Alignment guide for smart snapping
export interface AlignmentGuide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'edge' | 'center' | 'grid';
}

// History entry for undo/redo
export interface CanvasHistoryEntry {
  id: string;
  timestamp: number;
  snapshot: string; // JSON string of canvas state
  description: string;
}

// Smart drag feedback
export interface SnapTarget {
  element: fabric.Object;
  edge: 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY';
  distance: number;
  position: number;
}
