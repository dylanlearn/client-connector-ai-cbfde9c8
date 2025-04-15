
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type ViewMode = 'edit' | 'preview';

export interface StudioContentProps {
  projectId: string;
  onUpdate?: (wireframe: WireframeData) => void;
  onExport?: (format: string) => void;
}

export interface AISuggestionsPanelProps {
  wireframeId: string;
  wireframe: WireframeData;
  focusedSectionId: string | null;
  onApplySuggestion: (wireframe: WireframeData) => void;
  onClose: () => void;
}

export interface StudioCanvasProps {
  projectId: string;
  wireframeData: WireframeData;
  deviceType: DeviceType;
  viewMode: ViewMode;
  selectedSection: string | null;
  onUpdate: (wireframe: WireframeData) => void;
}
