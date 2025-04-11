
/**
 * Defines the structure of components in the wireframe system.
 * This type is used throughout the wireframe editor for consistent
 * representation of UI elements.
 */
export interface WireframeComponent {
  id: string;
  type: 'box' | 'text' | 'image' | 'group' | string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  rotation?: number;
  opacity?: number;
  locked?: boolean;
  visible?: boolean;
  resizeStrategy?: 'fixed' | 'auto-height' | 'stretch-children';
  children?: WireframeComponent[];
  props?: Record<string, any>;
  sectionType?: string;
  title?: string;
  subtitle?: string;
  copyright?: string;
  componentVariant?: string;
  links?: any[];
  data?: Record<string, any>;
  name?: string;
}

/**
 * Configuration for how an element should snap during movement or resizing
 */
export interface SnapConfig {
  toGrid: boolean;
  toEdges: boolean;
  toElements: boolean;
  gridSize: number;
  threshold: number;
}

/**
 * Represents a change to a component's properties
 */
export interface ComponentChange {
  componentId: string;
  propertyPath: string;
  oldValue: any;
  newValue: any;
  timestamp: number;
}

/**
 * Configuration for how elements should handle resizing operations
 */
export interface ResizeConfig {
  strategy: 'fixed' | 'auto-height' | 'stretch-children';
  maintainAspectRatio?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizeFromCenter?: boolean;
}

/**
 * Defines a group of components
 */
export interface ComponentGroup {
  id: string;
  name: string;
  componentIds: string[];
  collapsed?: boolean;
}
