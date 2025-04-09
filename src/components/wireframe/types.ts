
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
  viewMode?: 'preview' | 'edit' | 'code';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  sectionIndex?: number;
  onSectionClick?: (sectionId: string) => void;
  isSelected?: boolean;
}

export interface WireframeRendererProps {
  wireframeData: any;
  viewMode?: 'preview' | 'edit' | 'code';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
}

export interface GuidelineProps {
  position: number;
  orientation: 'horizontal' | 'vertical';
}
