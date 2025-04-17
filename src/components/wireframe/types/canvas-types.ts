
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '../utils/types';

/**
 * Props for the EnhancedCanvasEngine component
 */
export interface EnhancedCanvasEngineProps {
  width?: number;
  height?: number;
  canvasConfig?: Partial<WireframeCanvasConfig>;
  sections?: any[];
  className?: string;
  onSectionClick?: (id: string, section: any) => void;
  onObjectsSelected?: (objects: fabric.Object[]) => void;
  onObjectModified?: (object: fabric.Object) => void;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onRenderComplete?: () => void;
}

/**
 * Configuration for canvas initialization
 */
export interface CanvasInitializationOptions {
  width: number;
  height: number;
  backgroundColor: string;
  preserveObjectStacking: boolean;
  selection: boolean;
  renderOnAddRemove: boolean;
  controlsAboveOverlay?: boolean;
  centeredScaling?: boolean;
  centeredRotation?: boolean;
  interactive?: boolean;
}

/**
 * Result of canvas initialization
 */
export interface CanvasInitializationResult {
  fabricCanvas: fabric.Canvas | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Object representing a canvas object's position and dimensions
 */
export interface CanvasBoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
  angle?: number;
}

/**
 * Performance options for canvas rendering
 */
export interface CanvasPerformanceOptions {
  enableCaching?: boolean;
  objectCaching?: boolean;
  skipOffscreen?: boolean;
  enableRetina?: boolean;
  renderBatchSize?: number;
  maxRenderingScale?: number;
}

/**
 * Canvas rendering statistics for performance monitoring
 */
export interface CanvasRenderStats {
  renderTime: number;
  objectCount: number;
  lastRenderTimestamp: number;
  frameRate: number;
  memoryUsage?: number;
}

/**
 * Grid system configuration with responsive breakpoint support
 */
export interface EnterpriseGridConfig {
  visible: boolean;
  type: 'lines' | 'dots' | 'columns' | 'custom';
  size: number;
  snapToGrid: boolean;
  snapThreshold: number;
  color: string;
  showGuides: boolean;
  showRulers: boolean;
  
  // Column-based grid settings
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  
  // Responsive behavior
  responsive: boolean;
  breakpoints: GridBreakpoint[];
  currentBreakpoint: string;
  
  // Preset management
  presetName?: string;
  presetCategory?: string;
  
  // Visual customization
  opacity: number;
  showNumbers: boolean;
  dashPattern?: number[];
  highlightEvery?: number;
  
  // Custom grid properties
  customSettings?: Record<string, any>;
}

/**
 * Responsive grid breakpoint definition
 */
export interface GridBreakpoint {
  name: string;
  width: number;
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  color?: string;
  active?: boolean;
}

/**
 * Configuration for grid guidelines and alignments
 */
export interface GridGuideConfig {
  showVerticalGuides: boolean;
  showHorizontalGuides: boolean;
  guideColor: string;
  snapToGuides: boolean;
  guideThreshold: number;
  showDistanceIndicators: boolean;
}

/**
 * Smart guide system configuration
 */
export interface SmartGuideConfiguration {
  enabled: boolean;
  snapDistance: number;
  snapTypes: SnapGuideType[];
  guideColor: string;
  activeGuideColor: string;
  guideThickness: number;
  showDistanceLabels: boolean;
  persistGuides: boolean;
  showEdgeGuides: boolean;
  showCenterGuides: boolean;
  showDistributionGuides: boolean;
  
  // Performance optimization
  maxGuidesRendered: number;
  throttleInterval: number;
  useGuideMemoization: boolean;
  
  // Visual feedback
  animateSnap: boolean;
  flashDuration: number;
  dashPattern?: number[];
  
  // Advanced edge detection
  edgeDetectionThreshold: number;
  detectAngledEdges: boolean;
  intelligentGuidePriority: boolean;
}

/**
 * Types of snap guides available in the system
 */
export type SnapGuideType = 
  | 'edge' 
  | 'center' 
  | 'distribution' 
  | 'spacing' 
  | 'grid' 
  | 'rotation' 
  | 'size' 
  | 'custom';

/**
 * Individual guide definition
 */
export interface GuideDefinition {
  id: string;
  type: SnapGuideType;
  orientation: 'horizontal' | 'vertical' | 'angular';
  position: number; // x or y position, or angle for angular
  label?: string;
  color?: string;
  persistent: boolean;
  metadata?: Record<string, any>;
  strength: number; // Higher strength means stronger snapping
}

/**
 * Grid preset definition
 */
export interface GridPreset {
  id: string;
  name: string;
  category: string;
  description?: string;
  thumbnail?: string;
  config: EnterpriseGridConfig;
  tags?: string[];
  dateCreated: string;
  dateModified: string;
  isDefault?: boolean;
  isSystem?: boolean;
}

/**
 * Guide preset definition
 */
export interface GuidePreset {
  id: string;
  name: string;
  category: string;
  description?: string;
  guides: GuideDefinition[];
  dateCreated: string;
  dateModified: string;
  isDefault?: boolean;
  isSystem?: boolean;
}

/**
 * Distance indicator displayed between elements
 */
export interface DistanceIndicator {
  id: string;
  startPoint: { x: number, y: number };
  endPoint: { x: number, y: number };
  distance: number;
  orientation: 'horizontal' | 'vertical';
  label?: string;
  color?: string;
}
