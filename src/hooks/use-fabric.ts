
import { useRef, useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { useWireframeStore } from '@/stores/wireframe-store';
import { WireframeCanvasConfig } from '@/services/ai/wireframe/wireframe-types';

interface UseFabricOptions {
  persistConfig?: boolean;
  initialConfig?: Partial<WireframeCanvasConfig>;
}

export function useFabric(options: UseFabricOptions = {}) {
  const { persistConfig = true, initialConfig = {} } = options;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const storeCanvasSettings = useWireframeStore(state => state.canvasSettings);
  const updateCanvasSettings = useWireframeStore(state => state.updateCanvasSettings);
  
  // Define the canvas configuration
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>({
    zoom: initialConfig.zoom || storeCanvasSettings.zoom || 1,
    panOffset: initialConfig.panOffset || storeCanvasSettings.panOffset || { x: 0, y: 0 },
    showGrid: initialConfig.showGrid !== undefined ? initialConfig.showGrid : storeCanvasSettings.showGrid,
    snapToGrid: initialConfig.snapToGrid !== undefined ? initialConfig.snapToGrid : storeCanvasSettings.snapToGrid,
    gridSize: initialConfig.gridSize || storeCanvasSettings.gridSize || 8
  });

  // Initialize Fabric canvas
  const initializeFabric = useCallback((canvasElement?: HTMLCanvasElement) => {
    const canvasEl = canvasElement || canvasRef.current;
    if (!canvasEl) return null;
    
    // Create new canvas instance
    const canvas = new fabric.Canvas(canvasEl, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true
    });

    // Set up event handlers
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    
    canvas.on('mouse:down', () => {
      if (canvas.isDrawingMode) {
        setIsDrawing(true);
      }
    });
    
    canvas.on('mouse:up', () => {
      if (isDrawing) {
        setIsDrawing(false);
      }
    });
    
    // Apply saved canvas configuration
    if (canvasConfig.zoom !== 1) {
      canvas.setZoom(canvasConfig.zoom);
    }
    
    if (canvasConfig.panOffset.x !== 0 || canvasConfig.panOffset.y !== 0) {
      canvas.absolutePan(new fabric.Point(canvasConfig.panOffset.x, canvasConfig.panOffset.y));
    }
    
    // Set snap to grid if enabled
    if (canvasConfig.snapToGrid) {
      canvas.on('object:moving', (options) => {
        if (options.target) {
          const target = options.target;
          const gridSize = canvasConfig.gridSize;
          
          target.set({
            left: Math.round(target.left! / gridSize) * gridSize,
            top: Math.round(target.top! / gridSize) * gridSize
          });
        }
      });
    }

    setFabricCanvas(canvas);
    return canvas;
  }, [canvasConfig, isDrawing]);

  // Update canvas config and persist if needed
  const updateConfig = useCallback((config: Partial<WireframeCanvasConfig>) => {
    setCanvasConfig(prev => {
      const newConfig = { ...prev, ...config };
      
      // Persist to store if enabled
      if (persistConfig) {
        updateCanvasSettings(newConfig);
      }
      
      return newConfig;
    });
  }, [persistConfig, updateCanvasSettings]);

  useEffect(() => {
    // Initialize Fabric canvas
    const canvas = initializeFabric();
    
    // Cleanup on unmount
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, [initializeFabric]);

  // Methods for canvas manipulation
  const addObject = useCallback((obj: fabric.Object) => {
    if (!fabricCanvas) return;
    fabricCanvas.add(obj);
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  const removeObject = useCallback((obj: fabric.Object) => {
    if (!fabricCanvas) return;
    fabricCanvas.remove(obj);
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  const clearCanvas = useCallback(() => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  const saveCanvasAsJSON = useCallback(() => {
    if (!fabricCanvas) return null;
    return fabricCanvas.toJSON();
  }, [fabricCanvas]);

  const loadCanvasFromJSON = useCallback((json: any) => {
    if (!fabricCanvas) return;
    fabricCanvas.loadFromJSON(json, () => {
      fabricCanvas.renderAll();
    });
  }, [fabricCanvas]);
  
  // Methods for zoom and pan
  const zoomIn = useCallback(() => {
    if (!fabricCanvas) return;
    
    const newZoom = Math.min(3, canvasConfig.zoom + 0.1);
    fabricCanvas.setZoom(newZoom);
    
    updateConfig({ zoom: newZoom });
  }, [fabricCanvas, canvasConfig.zoom, updateConfig]);
  
  const zoomOut = useCallback(() => {
    if (!fabricCanvas) return;
    
    const newZoom = Math.max(0.1, canvasConfig.zoom - 0.1);
    fabricCanvas.setZoom(newZoom);
    
    updateConfig({ zoom: newZoom });
  }, [fabricCanvas, canvasConfig.zoom, updateConfig]);
  
  const resetZoom = useCallback(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.setZoom(1);
    fabricCanvas.absolutePan(new fabric.Point(0, 0));
    
    updateConfig({ zoom: 1, panOffset: { x: 0, y: 0 } });
  }, [fabricCanvas, updateConfig]);
  
  const pan = useCallback((x: number, y: number) => {
    if (!fabricCanvas) return;
    
    fabricCanvas.relativePan(new fabric.Point(x, y));
    
    const viewportTransform = fabricCanvas.viewportTransform;
    if (viewportTransform) {
      updateConfig({
        panOffset: { x: viewportTransform[4], y: viewportTransform[5] }
      });
    }
  }, [fabricCanvas, updateConfig]);
  
  // Grid management
  const toggleGrid = useCallback(() => {
    updateConfig({ showGrid: !canvasConfig.showGrid });
  }, [canvasConfig.showGrid, updateConfig]);
  
  const toggleSnapToGrid = useCallback(() => {
    updateConfig({ snapToGrid: !canvasConfig.snapToGrid });
  }, [canvasConfig.snapToGrid, updateConfig]);
  
  const setGridSize = useCallback((size: number) => {
    updateConfig({ gridSize: size });
  }, [updateConfig]);

  return {
    canvasRef,
    fabricCanvas,
    selectedObject,
    canvasConfig,
    isDrawing,
    // Basic fabric operations
    addObject,
    removeObject,
    clearCanvas,
    saveCanvasAsJSON,
    loadCanvasFromJSON,
    // Extended canvas control
    zoomIn,
    zoomOut,
    resetZoom,
    pan,
    toggleGrid,
    toggleSnapToGrid,
    setGridSize,
    updateConfig,
    // Also expose the original initialize method
    initializeFabric,
    // Fabric canvas alias for backward compatibility
    canvas: fabricCanvas,
  };
}

export default useFabric;
