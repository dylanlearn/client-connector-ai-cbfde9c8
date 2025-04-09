
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
  rulerColor?: string;
  rulerMarkings?: boolean;
  historyEnabled?: boolean;
  maxHistorySteps?: number;
}

// Options for rendering sections
export interface SectionRenderingOptions {
  responsive?: boolean;
  darkMode?: boolean;
  showGrid?: boolean;
  gridSize?: number;
  showBorders?: boolean;
  deviceType?: string;
  interactive?: boolean;
}

// Alignment guide for smart snapping
export interface AlignmentGuide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'edge' | 'center' | 'grid' | 'distribution';
  strength?: number;
  label?: string;
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

// Layer information for layer management
export interface LayerInfo {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  parentId?: string;
}

// Drop zone indicator for drag and drop operations
export interface DropZoneIndicator {
  id: string;
  rect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  active: boolean;
  type: string;
}

// Guide visualization settings
export interface GuideVisualization {
  color: {
    edge: string;
    center: string;
    distribution: string;
  };
  strokeWidth: number;
  dashArray?: number[];
  showLabels?: boolean;
}

// Boundary styles for selection
export interface BoundaryStyles {
  stroke: string;
  strokeWidth: number;
  fill: string;
  cornerSize: number;
  transparentCorners: boolean;
  hasRotatingPoint: boolean;
  cornerColor: string;
}
