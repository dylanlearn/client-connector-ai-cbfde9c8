
export type DeviceType = 'desktop' | 'tablet' | 'tabletLandscape' | 'mobile' | 'mobileLandscape' | 'mobileSm';
export type ViewMode = 'editor' | 'preview' | 'code' | 'edit';

export interface WireframeVisualizerProps {
  wireframe: any;
  darkMode?: boolean;
  deviceType?: DeviceType;
  viewMode?: ViewMode;
  onSectionClick?: (sectionId: string) => void;
  selectedSectionId?: string | null;
}

export interface WireframeAISuggestionsProps {
  wireframeId?: string;
  wireframe?: any;
  focusedSectionId?: string;
  onClose?: () => void;
  onApplySuggestion?: (suggestion: any) => void;
}

export interface WireframeCanvasFabricProps {
  projectId: string;
  wireframeData: any;
  onUpdate?: (updatedWireframe: any) => void;
  readOnly?: boolean;
}

export interface ErrorWithDetails {
  message: string;
  details?: Record<string, any>;
  originalError?: unknown;
}
