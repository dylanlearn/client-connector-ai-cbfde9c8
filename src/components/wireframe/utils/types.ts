
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";
import { fabric } from 'fabric';

export interface WireframeCanvasConfig {
  width: number;
  height: number;
  zoom: number;
  panOffset?: { x: number, y: number };
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  gridType?: 'lines' | 'dots' | 'columns';
  snapTolerance?: number;
  backgroundColor?: string;
  showSmartGuides?: boolean;
  gridColor?: string;
  gridOpacity?: number;
  showGridNumbers?: boolean;
  showRulers?: boolean;
  rulerSize?: number;
  rulerColor?: string;
  rulerMarkings?: boolean;
  historyEnabled?: boolean;
  maxHistorySteps?: number;
  [key: string]: any;
}

export interface SectionRenderingOptions {
  deviceType?: string;
  darkMode?: boolean;
  renderGrid?: boolean;
  withControls?: boolean;
  interactive?: boolean;
}

export interface LayerInfo {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  children?: LayerInfo[];
  depth: number;
  object?: fabric.Object;
}

export interface GridSettings {
  size: number;
  color: string;
  visible: boolean;
  type: 'lines' | 'dots' | 'columns';
  opacity: number;
  showNumbers: boolean;
}

export interface DropZoneIndicator {
  active: boolean;
  position: { x: number, y: number };
  size: { width: number, height: number };
  type: 'section' | 'component' | 'group';
  label?: string;
}

export interface GuideVisualization {
  type: 'horizontal' | 'vertical' | 'center' | 'middle' | 'distribution';
  position: number;
  length: number;
  color: string;
  dashArray?: number[];
  objects?: fabric.Object[];
}

export interface EnhancedWireframeCanvasProps {
  wireframe: WireframeData | null;
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  canvasConfig?: Partial<WireframeCanvasConfig>;
  className?: string;
  onSectionClick?: (sectionId: string, section?: any) => void;
  onRenderComplete?: (canvas: fabric.Canvas) => void;
  interactive?: boolean;
  showControls?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onToggleGrid?: () => void;
  onToggleSnapToGrid?: () => void;
}
