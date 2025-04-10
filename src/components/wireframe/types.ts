
import { WireframeSection as WireframeSectionType, WireframeData, CopySuggestions, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import React from 'react';

export type ViewMode = 'preview' | 'editor' | 'flowchart' | 'code';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface WireframeSectionRendererProps {
  section: WireframeSectionType;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  sectionIndex?: number;
  onSectionClick?: (sectionId: string) => void;
  isSelected?: boolean;
}

export interface SectionComponentProps {
  section: WireframeSectionType;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  isSelected?: boolean;
  onClick?: () => void;
}

export interface BaseComponentRendererProps {
  component: WireframeComponent;
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
  wireframeData: WireframeData;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
}

export interface WireframeState extends Partial<WireframeData> {
  title: string;
  styleToken?: string;
  id?: string;
  sections: WireframeSectionType[];
}

export interface AdvancedWireframeGeneratorProps {
  projectId?: string;
  viewMode?: ViewMode;
  onWireframeGenerated?: (wireframe: WireframeData) => void;
  initialPrompt?: string;
  enhancedCreativity?: boolean;
  intakeData?: any; // Add intakeData prop
}

export interface WireframeProps {
  wireframe: WireframeData;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string;
  onSelect?: (sectionId: string) => void;
  className?: string;
}

export interface VariantComponentProps extends BaseComponentRendererProps {
  variant?: string;
  viewMode?: ViewMode;
}

export interface WireframeVisualizerProps {
  wireframe: WireframeData | undefined;
  darkMode?: boolean;
  deviceType?: DeviceType;
  viewMode?: ViewMode;
  onSectionClick?: (sectionId: string) => void;
  selectedSectionId?: string;
}
