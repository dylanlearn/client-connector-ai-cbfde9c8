
import { WireframeSection, WireframeData } from '@/services/ai/wireframe/wireframe-types';

export interface WireframeRendererProps {
  wireframeData: WireframeData;
  viewMode?: 'preview' | 'code' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
}

export interface WireframeSectionRendererProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'code' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  sectionIndex?: number;
  onSectionClick?: (sectionId: string) => void;
  isSelected?: boolean;
}

export interface SectionRenderingOptions {
  responsive?: boolean;
  darkMode?: boolean;
  showGrid?: boolean;
  gridSize?: number;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  interactive?: boolean;
  showBorders?: boolean;
  colorScheme?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
}

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
  gridColor: string;
  showRulers?: boolean;
  rulerSize?: number;
  rulerColor?: string;
  rulerMarkings?: boolean;
  historyEnabled?: boolean;
  maxHistorySteps?: number;
  [key: string]: any;
}

export interface InteractiveComponentOptions {
  selectable?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  rotatable?: boolean;
  lockMovementX?: boolean;
  lockMovementY?: boolean;
  hasControls?: boolean;
  hasBorders?: boolean;
  [key: string]: any;
}
