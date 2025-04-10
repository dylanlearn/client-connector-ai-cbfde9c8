
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export type ViewMode = 'preview' | 'flowchart' | 'edit';
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
