
import { WireframeSection, WireframeData } from '@/services/ai/wireframe/wireframe-types';

export interface WireframeProps {
  id: string;
  title: string;
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
}
