
// Grid guideline type for alignment
export interface GridGuideline {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'edge' | 'center' | 'distribution';
}

// Alignment guide for smart snapping
export interface AlignmentGuide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'edge' | 'center' | 'distribution';
  label?: string;
}

// Styles for object boundaries
export interface BoundaryStyles {
  stroke: string;
  strokeWidth: number;
  strokeDashArray: number[];
  cornerSize: number;
  cornerStyle: 'circle' | 'rect';
  cornerColor: string;
  transparentCorners: boolean;
  cornerStrokeColor: string;
}

// Visualization options for alignment guides
export interface GuideVisualization {
  strokeWidth: number;
  color: {
    edge: string;
    center: string;
    distribution: string;
  };
  dashArray: number[];
  snapIndicatorSize: number;
  snapIndicatorColor: string;
  showLabels: boolean;
}

// Rendering options for sections
export interface SectionRenderingOptions {
  showBorders: boolean;
  showLabels: boolean;
  showComponentOutlines: boolean;
  highlightOnHover: boolean;
}

// Canvas configuration for wireframes
export interface WireframeCanvasConfig {
  width: number;
  height: number;
  zoom: number;
  panOffset: { x: number; y: number };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  backgroundColor: string;
  gridType: 'lines' | 'dots' | 'columns';
  snapTolerance: number;
  showSmartGuides: boolean;
}
