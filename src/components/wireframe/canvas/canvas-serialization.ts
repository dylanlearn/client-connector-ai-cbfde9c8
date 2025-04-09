
import { fabric } from 'fabric';

export interface CanvasState {
  version: string;
  objects: any[];
  background: string | null;
  dimensions: {
    width: number;
    height: number;
  };
  viewport: {
    zoom: number;
    pan: {
      x: number;
      y: number;
    };
  };
  gridSettings: {
    show: boolean;
    snap: boolean;
    size: number;
    type: 'lines' | 'dots' | 'columns';
  };
  metadata: {
    lastSaved: string;
    deviceType?: 'desktop' | 'tablet' | 'mobile';
    [key: string]: any;
  };
}

/**
 * Enhanced serialization of canvas state with metadata
 */
export const serializeCanvas = (
  canvas: fabric.Canvas,
  additionalMetadata: Record<string, any> = {}
): CanvasState => {
  if (!canvas) {
    throw new Error('Canvas is required for serialization');
  }
  
  // Get the basic JSON from Fabric
  const fabricJson = canvas.toJSON(['id', 'name', 'sectionType', 'componentType', 'data']);
  
  // Create our enhanced state object
  const canvasState: CanvasState = {
    version: '1.0.0',
    objects: fabricJson.objects || [],
    background: fabricJson.background || null,
    dimensions: {
      width: canvas.getWidth(),
      height: canvas.getHeight(),
    },
    viewport: {
      zoom: canvas.getZoom(),
      pan: {
        x: canvas.viewportTransform ? canvas.viewportTransform[4] : 0,
        y: canvas.viewportTransform ? canvas.viewportTransform[5] : 0,
      },
    },
    gridSettings: {
      show: additionalMetadata.showGrid !== undefined ? additionalMetadata.showGrid : true,
      snap: additionalMetadata.snapToGrid !== undefined ? additionalMetadata.snapToGrid : true,
      size: additionalMetadata.gridSize || 10,
      type: additionalMetadata.gridType || 'lines',
    },
    metadata: {
      lastSaved: new Date().toISOString(),
      ...additionalMetadata,
    },
  };
  
  return canvasState;
};

/**
 * Deserialize canvas state to restore a saved canvas
 */
export const deserializeCanvas = (
  canvas: fabric.Canvas,
  state: CanvasState
): void => {
  if (!canvas || !state) {
    console.error('Both canvas and state are required for deserialization');
    return;
  }
  
  try {
    // Clear current canvas
    canvas.clear();
    
    // Load objects from fabric format
    canvas.loadFromJSON(
      { 
        objects: state.objects,
        background: state.background || '#ffffff'
      },
      () => {
        // Set dimensions
        canvas.setDimensions({
          width: state.dimensions.width,
          height: state.dimensions.height
        });
        
        // Restore viewport
        canvas.setZoom(state.viewport.zoom);
        canvas.setViewportTransform([
          state.viewport.zoom, 0, 
          0, state.viewport.zoom, 
          state.viewport.pan.x, 
          state.viewport.pan.y
        ]);
        
        // Apply any custom object handlers
        canvas.getObjects().forEach(obj => {
          // Reattach any event handlers as needed
          if (obj.data && obj.data.id) {
            obj.on('selected', () => {
              // Re-trigger selection events 
              const event = new CustomEvent('section:selected', { detail: obj.data });
              document.dispatchEvent(event);
            });
          }
        });
        
        canvas.renderAll();
      }
    );
  } catch (error) {
    console.error('Error deserializing canvas state:', error);
  }
};

/**
 * Get a shareable JSON string of the canvas state
 */
export const getShareableCanvasState = (canvas: fabric.Canvas): string => {
  const state = serializeCanvas(canvas);
  return JSON.stringify(state);
};

/**
 * Restore canvas from a shareable JSON string
 */
export const restoreFromShareableState = (canvas: fabric.Canvas, stateJson: string): boolean => {
  try {
    const state = JSON.parse(stateJson) as CanvasState;
    deserializeCanvas(canvas, state);
    return true;
  } catch (error) {
    console.error('Error restoring canvas from shareable state:', error);
    return false;
  }
};
