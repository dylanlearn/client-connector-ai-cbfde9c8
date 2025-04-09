
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { WireframeSection } from '@/types/wireframe';
// Remove the incorrect import and create a simple conversion function instead

/**
 * Canvas serialization format
 */
export interface SerializedCanvas {
  id: string;
  name?: string;
  version: string;
  objects: any[];
  background?: string;
  width: number;
  height: number;
  grid?: {
    enabled: boolean;
    size: number;
    type: string;
  };
  viewport?: {
    zoom: number;
    pan: { x: number, y: number };
  };
  metadata?: Record<string, any>;
  timestamp: number;
}

/**
 * Serialize a Fabric.js canvas to JSON
 */
export function serializeCanvas(canvas: fabric.Canvas, metadata?: Record<string, any>): SerializedCanvas {
  if (!canvas) throw new Error('Canvas is required for serialization');
  
  const viewportTransform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
  
  return {
    id: metadata?.id || uuidv4(),
    name: metadata?.name || 'Untitled Canvas',
    version: '1.0',
    objects: canvas.toJSON(['id', 'name', 'type', 'sectionType', 'data']).objects || [],
    background: canvas.backgroundColor as string,
    width: canvas.width || 0,
    height: canvas.height || 0,
    viewport: {
      zoom: viewportTransform[0],
      pan: { x: viewportTransform[4], y: viewportTransform[5] }
    },
    metadata: metadata || {},
    timestamp: Date.now()
  };
}

/**
 * Deserialize JSON to a Fabric.js canvas
 */
export function deserializeCanvas(canvas: fabric.Canvas, serialized: SerializedCanvas): void {
  if (!canvas || !serialized) return;
  
  // Clear canvas first
  canvas.clear();
  
  // Set canvas properties
  canvas.backgroundColor = serialized.background || '#ffffff';
  
  // Load objects from JSON
  canvas.loadFromJSON({ objects: serialized.objects }, () => {
    canvas.renderAll();
    
    // Apply viewport transform
    if (serialized.viewport) {
      canvas.setZoom(serialized.viewport.zoom);
      canvas.absolutePan(new fabric.Point(serialized.viewport.pan.x, serialized.viewport.pan.y));
    }
  });
}

/**
 * Create a snapshot of the canvas state
 */
export function createCanvasSnapshot(canvas: fabric.Canvas, metadata?: Record<string, any>): SerializedCanvas {
  return serializeCanvas(canvas, {
    ...metadata,
    snapshotTime: new Date().toISOString()
  });
}

/**
 * Restore a canvas from a snapshot
 */
export function restoreCanvasSnapshot(canvas: fabric.Canvas, snapshot: SerializedCanvas): void {
  deserializeCanvas(canvas, snapshot);
}

/**
 * Convert Fabric.js canvas to wireframe sections
 */
export function canvasToWireframeSections(canvas: fabric.Canvas): WireframeSection[] {
  if (!canvas) return [];
  
  const objects = canvas.getObjects();
  const sections: WireframeSection[] = [];
  
  objects.forEach(obj => {
    if (!obj.data || obj.data.type !== 'section') return;
    
    // Simple conversion from fabric object to wireframe section
    const section: WireframeSection = {
      id: obj.data.id || uuidv4(),
      name: obj.data.name || 'Untitled Section',
      sectionType: obj.data.sectionType || 'generic',
      position: {
        x: obj.left || 0,
        y: obj.top || 0
      },
      dimensions: {
        width: obj.width || 200,
        height: obj.height || 100
      }
    };
    
    sections.push(section);
  });
  
  return sections;
}

/**
 * Calculate the bounding box of all objects on canvas
 */
export function getCanvasBoundingBox(canvas: fabric.Canvas): { x: number, y: number, width: number, height: number } | null {
  if (!canvas) return null;
  
  const objects = canvas.getObjects();
  if (objects.length === 0) return null;
  
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  objects.forEach(obj => {
    const bound = obj.getBoundingRect(true, true);
    minX = Math.min(minX, bound.left);
    minY = Math.min(minY, bound.top);
    maxX = Math.max(maxX, bound.left + bound.width);
    maxY = Math.max(maxY, bound.top + bound.height);
  });
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Center content on the canvas
 */
export function centerCanvasContent(canvas: fabric.Canvas): void {
  const boundingBox = getCanvasBoundingBox(canvas);
  if (!boundingBox || !canvas.width || !canvas.height) return;
  
  const centerX = (canvas.width - boundingBox.width) / 2 - boundingBox.x;
  const centerY = (canvas.height - boundingBox.height) / 2 - boundingBox.y;
  
  canvas.getObjects().forEach(obj => {
    obj.set({
      left: obj.left! + centerX,
      top: obj.top! + centerY
    });
  });
  
  canvas.renderAll();
}

/**
 * Export canvas as image data URL
 */
export function exportCanvasAsImage(canvas: fabric.Canvas, format: 'png' | 'jpeg' = 'png', quality = 1): string {
  return canvas.toDataURL({
    format: format,
    quality: quality,
    multiplier: 2
  });
}

/**
 * Create undo/redo history stack
 */
export function createHistoryStack(maxSize = 30): {
  push: (state: SerializedCanvas) => void,
  undo: () => SerializedCanvas | null,
  redo: () => SerializedCanvas | null,
  canUndo: () => boolean,
  canRedo: () => boolean
} {
  const undoStack: SerializedCanvas[] = [];
  const redoStack: SerializedCanvas[] = [];
  
  return {
    push: (state: SerializedCanvas) => {
      undoStack.push({...state});
      if (undoStack.length > maxSize) {
        undoStack.shift();
      }
      // Clear redo stack when new state is pushed
      redoStack.length = 0;
    },
    undo: () => {
      const state = undoStack.pop();
      if (state) {
        redoStack.push(state);
        return undoStack[undoStack.length - 1] || null;
      }
      return null;
    },
    redo: () => {
      const state = redoStack.pop();
      if (state) {
        undoStack.push(state);
        return state;
      }
      return null;
    },
    canUndo: () => undoStack.length > 1,
    canRedo: () => redoStack.length > 0
  };
}
