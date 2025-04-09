
import { DeviceType } from './responsive-utils';

// Canvas configuration interface
export interface WireframeCanvasConfig {
  width: number;
  height: number;
  zoom: number;
  panOffset: { x: number; y: number; };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  gridType: "lines" | "dots" | "columns";
  snapTolerance: number;
  showSmartGuides: boolean;
  backgroundColor: string;
}

// Section rendering utilities
export interface SectionRenderingOptions {
  scale?: number;
  responsiveDevice?: DeviceType;
  preview?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  interactive?: boolean;
}

// Enhanced guide interface for smart alignment
export interface AlignmentGuide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'edge' | 'center' | 'distribution';
  strength: number; // For weighted guide importance
}

// Layer interface for managing component stacking
export interface LayerInfo {
  id: string;
  name: string;
  type: string; 
  visible: boolean;
  locked: boolean;
  zIndex: number;
  parentId?: string; // For grouped layers
  isExpanded?: boolean; // For group open/closed state
}

// Selection interface for tracking selected elements
export interface SelectionState {
  id: string | null;
  type: 'object' | 'group' | 'layer' | null;
  bounds?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

// Component boundary visual settings
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

// Smart guide visualization options
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

// Grid configuration for enhanced grid system
export interface EnhancedGridConfig {
  type: "lines" | "dots" | "columns" | "bootstrap" | "tailwind" | "custom";
  size: number;
  columns: number;
  gutter: number;
  color: string;
  opacity: number;
  showBreakpoints: boolean;
  responsiveMode: boolean;
}
