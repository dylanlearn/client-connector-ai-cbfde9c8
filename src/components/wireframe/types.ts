
import { ReactNode } from 'react';
import { WireframeSection } from '@/types/wireframe'; 

export interface CanvasControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleGrid: () => void;
  onToggleSnapToGrid: () => void;
  showGrid?: boolean;
  snapToGrid?: boolean;
  className?: string;
}

export interface SectionQuickActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  compact?: boolean;
}

export interface WireframeSectionRendererProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'edit' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  sectionIndex?: number;
  onSectionClick?: (sectionId: string) => void;
  isSelected?: boolean;
}

export interface WireframeRendererProps {
  wireframeData: any;
  viewMode?: 'preview' | 'edit' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
}

export interface GuidelineProps {
  position: number;
  orientation: 'horizontal' | 'vertical';
}

export interface WireframeProps {
  wireframe: any;
  viewMode?: 'preview' | 'edit' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
  onSelect?: (id: string) => void;
}

export interface WireframeVisualizerProps {
  wireframe: any;
  viewMode?: 'preview' | 'edit' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
  onSelect?: (id: string) => void;
}

export interface SectionComponentProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'edit' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  isSelected?: boolean;
  onClick?: () => void;
}

export interface VariantComponentProps {
  component: any;
  viewMode?: 'preview' | 'edit' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  variant?: string; // Added missing property
  data?: any; // Added missing property
}
