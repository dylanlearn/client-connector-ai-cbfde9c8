
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
  wireframeData: {
    title?: string;
    description?: string;
    sections: WireframeSection[];
  };
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
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
}
