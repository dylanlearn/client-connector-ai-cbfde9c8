
import { DeviceType } from "./preview/DeviceInfo";
import { WireframeData, WireframeSection } from "@/services/ai/wireframe/wireframe-types";

export type ViewMode = 'editor' | 'preview' | 'code' | 'split';

export interface WireframeVisualizerProps {
  wireframe: WireframeData;
  darkMode?: boolean;
  deviceType?: DeviceType;
  viewMode?: ViewMode;
  onSectionClick?: (sectionId: string) => void;
  selectedSectionId?: string | null;
  onSelect?: (id: string) => void;
  preview?: boolean;
}

export interface WireframeAISuggestionsProps {
  wireframe?: WireframeData;
  onClose: () => void;
  onApplySuggestion?: (suggestion: any) => void;
  sectionId?: string;
}

export interface WireframeComponentRendererProps {
  component: any;
  darkMode?: boolean;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  isHovered?: boolean;
  deviceType?: DeviceType;
  viewMode?: ViewMode;
}

export interface WireframeSectionProps {
  section: WireframeSection;
  darkMode?: boolean;
  onClick?: (sectionId: string) => void;
  isActive?: boolean;
  viewMode?: ViewMode;
  deviceType?: DeviceType;
}

// Additional types for the wireframe editor
export interface EditableComponentProps {
  component: any;
  onUpdate: (updates: any) => void;
  onDelete?: () => void;
}

export interface SectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}
