
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
