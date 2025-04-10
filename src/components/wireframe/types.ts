
import { WireframeData, WireframeSection, CopySuggestions } from '@/services/ai/wireframe/wireframe-types';
import { fabric } from 'fabric';

export type ViewMode = 'preview' | 'flowchart' | 'edit' | 'code' | 'editor';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface WireframeProps {
  wireframe: WireframeData;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
  onSelect?: (sectionId: string) => void;
  className?: string;
}

export interface WireframeVisualizerProps {
  wireframe: WireframeData;
  darkMode?: boolean;
  deviceType?: DeviceType;
  viewMode?: ViewMode;
  onSectionClick?: (sectionId: string) => void;
  selectedSectionId?: string | null;
  onSelect?: (sectionId: string) => void;
  preview?: boolean;
}

export interface WireframeRendererProps {
  wireframeData: WireframeData;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
}

export interface WireframeAISuggestionsProps {
  wireframe?: WireframeData;
  onClose: () => void;
  onApplySuggestion?: (suggestion: any) => void;
  sectionId?: string;
}

export interface WireframeSectionRendererProps {
  section: WireframeSection;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  sectionIndex?: number;
  onSectionClick?: (sectionId: string) => void;
  isSelected?: boolean;
}

export interface SectionComponentProps {
  section: WireframeSection;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  isSelected?: boolean;
  onClick?: () => void;
}

export interface FabricCanvasState {
  canvas: fabric.Canvas | null;
  isInitialized: boolean;
  zoom: number;
  panOffset: { x: number; y: number };
  canUndo: boolean;
  canRedo: boolean;
}
