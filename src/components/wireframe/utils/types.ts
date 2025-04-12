
import { fabric } from 'fabric';

export interface WireframeCanvasConfig {
  width: number;
  height: number;
  zoom: number;
  panOffset: { x: number, y: number };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  backgroundColor: string;
  gridType: 'lines' | 'dots' | 'columns';
  snapTolerance: number;
  showSmartGuides: boolean;
  [key: string]: any;
}

export interface SectionRenderingOptions {
  width: number;
  height: number;
  darkMode?: boolean;
  responsiveMode?: 'desktop' | 'tablet' | 'mobile';
  highlightSection?: string;
  showGrid?: boolean;
  gridSize?: number;
  responsive?: boolean;
  deviceType?: string;
  interactive?: boolean;
  showBorders?: boolean;
}

export interface AlignmentGuide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'edge' | 'center' | 'grid' | 'distribution';
  strength?: number;
  label?: string;
}

export interface LayerInfo {
  id: string;
  name: string;
  type: string;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  selected: boolean;
  children?: LayerInfo[];
}

export interface GridSettings {
  visible: boolean;
  size: number;
  snapToGrid: boolean;
  type: 'lines' | 'dots' | 'columns';
  columns?: number;
  gutterWidth?: number;
  marginWidth?: number;
}

export interface DropZoneIndicator {
  id: string;
  type: 'dropzone';
  position: { x: number, y: number };
  size: { width: number, height: number };
}

export interface GuideVisualization {
  id: string;
  guide: AlignmentGuide;
  color: string;
  thickness: number;
  opacity: number;
}
