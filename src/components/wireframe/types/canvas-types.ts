
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
  error?: Error | null;
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
