
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export type { WireframeSection };

export interface WireframeProps {
  id?: string;
  title?: string;
  description?: string;
  sections: WireframeSection[];
  lastUpdated?: string;
  imageUrl?: string; // Added to match usage in components
  version?: string; // Added to match sample data
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
