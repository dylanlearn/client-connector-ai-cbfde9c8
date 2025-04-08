
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export interface WireframeProps {
  id?: string;
  title?: string;
  description?: string;
  sections: WireframeSection[];
  lastUpdated?: string;
}

export interface VariantComponentProps {
  variant: string;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
}

export interface SectionComponentProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
}
