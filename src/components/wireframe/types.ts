
import { ReactNode } from 'react';

export interface WireframeProps {
  id: string;
  title: string;
  description?: string;
  sections: any[];
  imageUrl?: string;
  lastUpdated?: string;
  version?: string;
}

export interface SectionPreviewProps {
  section: any;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
}
