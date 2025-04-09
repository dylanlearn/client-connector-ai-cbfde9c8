
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from './wireframe';

export interface UseFabricOptions {
  persistConfig?: boolean;
  initialConfig?: Partial<WireframeCanvasConfig>;
}

export interface FabricCanvasState {
  fabricCanvas: fabric.Canvas | null;
  selectedObject: fabric.Object | null;
  isDrawing: boolean;
  canvasConfig: WireframeCanvasConfig;
}

export interface FabricCanvasActions {
  addObject: (obj: fabric.Object) => void;
  removeObject: (obj: fabric.Object) => void;
  clearCanvas: () => void;
  saveCanvasAsJSON: () => any | null;
  loadCanvasFromJSON: (json: any) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  pan: (x: number, y: number) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  updateConfig: (config: Partial<WireframeCanvasConfig>) => void;
  initializeFabric: (canvasElement?: HTMLCanvasElement) => fabric.Canvas | null;
}
