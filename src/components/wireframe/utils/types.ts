
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
  strength?: number; // Added strength property
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
  deviceType?: 'mobile' | 'tablet' | 'desktop'; // Added deviceType
  interactive?: boolean; // Added interactive property
}

// Canvas configuration for wireframes
export interface WireframeCanvasConfig {
  // Canvas dimensions
  width: number;
  height: number;
  
  // Viewport settings
  zoom: number;
  panOffset: { x: number; y: number };
  
  // Grid and snap settings
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  gridType: 'lines' | 'dots' | 'columns';
  snapTolerance: number;
  
  // Visual settings
  backgroundColor: string;
  showSmartGuides: boolean;
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
  isExpanded?: boolean; // Added isExpanded property
}
