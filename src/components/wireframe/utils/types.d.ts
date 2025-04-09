
// Update the WireframeCanvasConfig interface by adding missing properties
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
  gridColor?: string;
  showRulers?: boolean;
  rulerSize?: number;
  rulerColor?: string;
  rulerMarkings?: boolean;
  historyEnabled?: boolean;
  maxHistorySteps?: number;
}

export interface SectionRenderingOptions {
  darkMode: boolean;
  showGrid: boolean;
  gridSize: number;
  showBorders: boolean;
}

