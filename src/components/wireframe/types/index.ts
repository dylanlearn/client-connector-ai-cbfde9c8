
export type DeviceType = 'desktop' | 'tablet' | 'tabletLandscape' | 'mobile' | 'mobileLandscape' | 'mobileSm';
export type ViewMode = 'editor' | 'preview' | 'code';

export interface WireframeVisualizerProps {
  wireframe: any;
  darkMode?: boolean;
  deviceType?: DeviceType;
  viewMode?: ViewMode;
  onSectionClick?: (sectionId: string) => void;
  selectedSectionId?: string | null;
}

export interface WireframeAISuggestionsProps {
  wireframe?: any;
  onClose?: () => void;
  onApplySuggestion?: (suggestion: any) => void;
}
