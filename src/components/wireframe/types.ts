
import { WireframeSection, WireframeData, AIWireframe } from '@/services/ai/wireframe/wireframe-types';

export interface WireframeProps {
  id: string;
  title: string; // Required field
  description?: string;
  sections: any[];
  imageUrl?: string;
  lastUpdated?: string;
}

export interface SectionComponentProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  sectionIndex?: number;
  data?: any;
  onSectionClick?: (sectionId: string) => void;
}

export interface VariantComponentProps {
  variant: string;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  data?: any;
}

export interface WireframeRendererProps {
  wireframeData: WireframeData;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
}

export interface AdvancedWireframeGeneratorProps {
  projectId: string;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  onWireframeGenerated?: (wireframe: AIWireframe) => void;
  onWireframeSaved?: (wireframe: AIWireframe) => void;
}

export interface WireframeVisualizerProps {
  wireframe: WireframeProps;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
  onSelect?: (id: string) => void;
}

export interface WireframeSectionRendererProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  sectionIndex?: number;
  onSectionClick?: (sectionId: string) => void;
}
