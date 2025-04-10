
import { WireframeSection as WireframeSectionType, WireframeData, CopySuggestions } from '@/services/ai/wireframe/wireframe-types';
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
  id: string; // Make id required to match WireframeData
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

// Add WireframeProps interface
export interface WireframeProps {
  data: WireframeData;
  className?: string;
}

// Add VariantComponentProps interface
export interface VariantComponentProps extends BaseComponentRendererProps {
  variant?: string;
  viewMode?: ViewMode;
}

export interface WireframeVisualizerProps {
  wireframe?: WireframeData;
  darkMode?: boolean;
  deviceType?: DeviceType;
  viewMode?: ViewMode;
  onSectionClick?: (sectionId: string) => void;
  selectedSectionId?: string;
}
