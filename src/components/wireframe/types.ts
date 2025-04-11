
import { WireframeSection } from "@/services/ai/wireframe/wireframe-types";

export type DeviceType = 'desktop' | 'tablet' | 'tabletLandscape' | 'mobile' | 'mobileLandscape' | 'mobileSm';
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
  sectionIndex?: number;
  onSectionClick?: (sectionId: string) => void;
}

export interface ComponentRendererProps {
  section: WireframeSection;
  darkMode: boolean;
  deviceType: DeviceType;
  viewMode: 'preview' | 'flowchart';
  isSelected: boolean;
  onClick: (sectionId: string) => void;
}

export interface WireframeProps {
  wireframe: any;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
  onSelect?: (sectionId: string) => void;
  className?: string;
}

export interface WireframeRendererProps {
  wireframeData: any;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
}

export interface WireframeSectionRendererProps {
  section: WireframeSection;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  isSelected?: boolean;
  sectionIndex?: number;
  onSectionClick?: (sectionId: string) => void;
}

export interface WireframeVisualizerProps {
  wireframe: any;
  darkMode?: boolean;
  deviceType?: DeviceType;
  viewMode?: ViewMode;
  onSectionClick?: (sectionId: string) => void;
  selectedSectionId?: string | null;
  onSelect?: (sectionId: string) => void;
  preview?: boolean;
}

export interface WireframeAISuggestionsProps {
  wireframeId?: string;
  wireframe?: any;
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
