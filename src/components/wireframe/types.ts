
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export interface WireframeSectionRendererProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  sectionIndex?: number;
  onSectionClick?: (sectionId: string) => void;
  isSelected?: boolean;
}

export interface WireframeRendererProps {
  wireframeData: {
    title?: string;
    description?: string;
    sections: WireframeSection[];
  };
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
}

// Additional props types needed by components
export interface WireframeProps {
  wireframeData: {
    title?: string;
    description?: string;
    sections: WireframeSection[];
  };
  darkMode?: boolean;
  viewMode?: 'preview' | 'flowchart';
}

export interface WireframeVisualizerProps {
  wireframe: {
    id?: string;
    title?: string;
    description?: string;
    sections: any[];
    imageUrl?: string;
    version?: string;
    lastUpdated?: string;
  };
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
  onSelect?: (id: string) => void;
}

export interface SectionComponentProps {
  section: WireframeSection;
  darkMode?: boolean;
  viewMode?: 'preview' | 'flowchart' | 'edit';
  deviceType?: 'desktop' | 'tablet' | 'mobile';
}

export interface VariantComponentProps {
  section: WireframeSection;
  darkMode?: boolean;
  viewMode?: 'preview' | 'flowchart' | 'edit';
  variant?: string;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  data?: any;
}

export interface WireframeDataVisualizerProps {
  wireframeData: any;
  darkMode?: boolean;
  viewMode?: 'preview' | 'flowchart';
  deviceType?: 'desktop' | 'tablet' | 'mobile';
}

// Canvas related types
export interface CanvasControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onToggleGrid?: () => void;
  onToggleSnapToGrid?: () => void;
  showGrid?: boolean;
  snapToGrid?: boolean;
  className?: string;
}

export interface WireframeCanvasEngineProps {
  sections?: WireframeSection[];
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  readOnly?: boolean;
  onSectionSelect?: (sectionId: string) => void;
  onSectionUpdate?: (section: WireframeSection) => void;
  className?: string;
}

export interface FabricConverterOptions {
  enableEditing?: boolean;
  showLabels?: boolean;
  fitToCanvas?: boolean;
  mode?: 'preview' | 'flowchart' | 'edit';
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  interactive?: boolean;
}
