
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
