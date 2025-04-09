
import { DeviceType } from './responsive-utils';

// Canvas configuration interface
export interface WireframeCanvasConfig {
  zoom: number;
  panOffset: { x: number; y: number; };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  gridType: "lines" | "dots" | "columns";
  snapTolerance: number;
  showSmartGuides: boolean;
  width: number;
  height: number;
  backgroundColor: string;
}

// Section rendering utilities
export interface SectionRenderingOptions {
  scale?: number;
  responsiveDevice?: DeviceType;
  preview?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  interactive?: boolean;
}

// Enhanced guide interface for smart alignment
export interface AlignmentGuide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'edge' | 'center' | 'distribution';
  strength: number; // For weighted guide importance
}

// Layer interface for managing component stacking
export interface LayerInfo {
  id: string;
  name: string;
  type: string; 
  visible: boolean;
  locked: boolean;
  zIndex: number;
  parentId?: string; // For grouped layers
  isExpanded?: boolean; // For group open/closed state
}
