
import { fabric } from 'fabric';
import { WireframeSection } from '@/types/wireframe';
import { DeviceType } from '../preview/DeviceInfo';

export interface EnhancedCanvasState {
  version: string;
  objects: any[];
  background: string;
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
  sections: WireframeSection[];
  metadata: {
    lastSaved: string;
    deviceType: DeviceType;
    darkMode: boolean;
    [key: string]: any;
  };
}

/**
 * Enhanced serialization of canvas state with wireframe metadata
 */
export const serializeCanvas = (
  canvas: fabric.Canvas,
  sections: WireframeSection[],
  settings: {
    deviceType: DeviceType;
    darkMode: boolean;
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
    gridType: 'lines' | 'dots' | 'columns';
  }
): EnhancedCanvasState => {
  if (!canvas) {
    throw new Error('Canvas is required for serialization');
  }
  
  // Get the basic JSON from Fabric
  const fabricJson = canvas.toJSON(['id', 'name', 'sectionType', 'componentType', 'data']);
  
  // Create our enhanced state object
  const canvasState: EnhancedCanvasState = {
    version: '1.0.0',
    objects: fabricJson.objects || [],
    background: fabricJson.background || '#ffffff',
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
      show: settings.showGrid,
      snap: settings.snapToGrid,
      size: settings.gridSize || 10,
      type: settings.gridType || 'lines',
    },
    sections: sections,
    metadata: {
      lastSaved: new Date().toISOString(),
      deviceType: settings.deviceType,
      darkMode: settings.darkMode,
    },
  };
  
  return canvasState;
};

/**
 * Deserialize canvas state to restore a saved canvas
 */
export const deserializeCanvas = (
  canvas: fabric.Canvas,
  state: EnhancedCanvasState,
  handleSectionLoad?: (sections: WireframeSection[]) => void
): void => {
  if (!canvas || !state) {
    console.error('Both canvas and state are required for deserialization');
    return;
  }
  
  try {
    // Clear current canvas
    canvas.clear();
    
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
    
    // Load objects from fabric format
    canvas.loadFromJSON(
      { 
        objects: state.objects,
        background: state.background
      },
      () => {
        // Apply any custom object handlers
        canvas.getObjects().forEach(obj => {
          // Re-attach event handlers as needed
          if (obj.data && obj.data.id) {
            obj.on('selected', () => {
              // Re-trigger selection events 
              const event = new CustomEvent('section:selected', { detail: obj.data });
              document.dispatchEvent(event);
            });
          }
        });
        
        if (handleSectionLoad && state.sections) {
          handleSectionLoad(state.sections);
        }
        
        canvas.renderAll();
      }
    );
  } catch (error) {
    console.error('Error deserializing canvas state:', error);
  }
};

/**
 * Creates a snapshot of the current canvas state that can be stored
 */
export const createCanvasSnapshot = (
  canvas: fabric.Canvas, 
  sections: WireframeSection[],
  settings: {
    deviceType: DeviceType;
    darkMode: boolean;
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
    gridType: 'lines' | 'dots' | 'columns';
  }
): string => {
  const state = serializeCanvas(canvas, sections, settings);
  return JSON.stringify(state);
};

/**
 * Restores canvas from a snapshot string
 */
export const restoreCanvasFromSnapshot = (
  canvas: fabric.Canvas, 
  snapshot: string,
  handleSectionLoad?: (sections: WireframeSection[]) => void
): boolean => {
  try {
    const state = JSON.parse(snapshot) as EnhancedCanvasState;
    deserializeCanvas(canvas, state, handleSectionLoad);
    return true;
  } catch (error) {
    console.error('Error restoring canvas from snapshot:', error);
    return false;
  }
};
