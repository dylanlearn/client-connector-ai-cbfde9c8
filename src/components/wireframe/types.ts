
import { CopySuggestions, WireframeSection, WireframeData } from '@/services/ai/wireframe/wireframe-types';
import React from 'react';

export type ViewMode = 'preview' | 'editor' | 'flowchart' | 'code';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface WireframeSectionRendererProps {
  section: WireframeSection;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  sectionIndex?: number;
  onSectionClick?: (sectionId: string) => void;
  isSelected?: boolean;
}

export interface SectionComponentProps {
  section: WireframeSection;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  isSelected?: boolean;
  onClick?: () => void;
}

export interface BaseComponentRendererProps {
  component: any;
  darkMode?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  deviceType?: DeviceType;
}

export interface ComponentRendererProps extends BaseComponentRendererProps {
  variant?: string;
  viewMode?: ViewMode;
}

export interface WireframeRendererProps {
  wireframe: WireframeData;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  onSectionClick?: (sectionId: string) => void;
  selectedSectionId?: string;
}

export interface WireframeState extends Partial<WireframeData> {
  title: string;
  styleToken?: string;
  id?: string;
  sections: WireframeSection[];
}

export interface AdvancedWireframeGeneratorProps {
  projectId?: string;
  viewMode?: ViewMode;
  onWireframeGenerated?: (wireframe: WireframeData) => void;
  initialPrompt?: string;
  enhancedCreativity?: boolean;
}
