
import { WireframeSection } from "@/services/ai/wireframe/wireframe-types";

export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'responsive' | string;
export type ViewMode = 'preview' | 'edit' | 'editor' | 'code' | 'flowchart';

export interface BaseComponentProps {
  darkMode?: boolean;
  interactive?: boolean;
}

export interface SectionComponentProps {
  section: WireframeSection;
  darkMode?: boolean;
  deviceType?: DeviceType;
  viewMode?: ViewMode;
  isSelected?: boolean;
  onClick?: (sectionId: string) => void;
  onEdit?: (sectionId: string) => void;
  editable?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export interface ComponentRendererProps {
  section: WireframeSection;
  darkMode: boolean;
  deviceType: DeviceType;
  viewMode: 'preview' | 'flowchart';
  isSelected: boolean;
  onClick: (sectionId: string) => void;
}

export interface WireframeAISuggestionsProps {
  wireframeId?: string;
  sectionId?: string;
  onClose?: () => void;
  onApplySuggestion?: (suggestion: any) => void;
}

export interface WireframeCanvasConfig {
  width: number;
  height: number;
  zoom: number;
  panOffset: { x: number; y: number };
  backgroundColor?: string;
  showGrid?: boolean;
  gridSize?: number;
  snapToGrid?: boolean;
  gridColor?: string;
  showRulers?: boolean;
  rulerColor?: string;
  rulerSize?: number;
  gridType?: 'lines' | 'dots' | 'columns';
  showSmartGuides?: boolean;
}
