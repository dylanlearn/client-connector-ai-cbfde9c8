// Update the WireframeCanvasConfig interface by adding missing properties
import { fabric } from 'fabric';

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
  gridColor: string;
  showRulers?: boolean;
  rulerSize?: number;
  rulerColor?: string;
  rulerMarkings?: boolean;
  historyEnabled?: boolean;
  maxHistorySteps?: number;
}

export interface SectionRenderingOptions {
  darkMode?: boolean;
  showGrid?: boolean;
  gridSize?: number;
  showBorders?: boolean;
  responsive?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  interactive?: boolean;
}

export interface AlignmentGuide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'grid' | 'center' | 'edge' | 'spacing';
  label?: string;
  strength?: number;
}

export interface DropZoneIndicator {
  id: string;
  element: HTMLElement;
  rect: DOMRect;
  isHovering: boolean;
}

export interface AlignmentGuide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'edge' | 'center' | 'grid' | 'distribution';
  label?: string;
  strength?: number;
}

export interface GuideVisualization {
  guide: AlignmentGuide;
  color: string | {
    edge: string;
    center: string;
    distribution: string;
    [key: string]: string;
  };
  dashArray?: number[];
  width?: number;
  strokeWidth?: number;
  showLabels?: boolean;
}

export interface BoundaryStyles {
  stroke: string;
  strokeWidth: number;
  strokeDashArray?: number[];
  fill?: string;
  opacity?: number;
}

export interface DropZoneIndicator {
  position: { x: number, y: number };
  size: { width: number, height: number };
  type: 'valid' | 'invalid' | 'current';
  label?: string;
}

export interface LayerInfo {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  children?: LayerInfo[];
  depth: number;
  fabricObject?: fabric.Object;
}
