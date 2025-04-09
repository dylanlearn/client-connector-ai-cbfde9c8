
import { useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { useWireframeStore } from '@/stores/wireframe-store';
import { WireframeCanvasConfig } from '@/types/wireframe';
import { UseFabricOptions } from '@/types/fabric-canvas';
import { useCanvasInitialization } from './fabric/use-canvas-initialization';
import { useCanvasActions } from './fabric/use-canvas-actions';
import { useGridActions } from './fabric/use-grid-actions';

export function useFabric(options: UseFabricOptions = {}) {
  const { persistConfig = true, initialConfig = {} } = options;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const storeCanvasSettings = useWireframeStore(state => state.canvasSettings);
  const updateCanvasSettings = useWireframeStore(state => state.updateCanvasSettings);
  
  // Define the canvas configuration with all required properties
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>({
    width: initialConfig.width || storeCanvasSettings.width || 1200,
    height: initialConfig.height || storeCanvasSettings.height || 800,
    zoom: initialConfig.zoom || storeCanvasSettings.zoom || 1,
    panOffset: initialConfig.panOffset || storeCanvasSettings.panOffset || { x: 0, y: 0 },
    showGrid: initialConfig.showGrid !== undefined ? initialConfig.showGrid : storeCanvasSettings.showGrid,
    snapToGrid: initialConfig.snapToGrid !== undefined ? initialConfig.snapToGrid : storeCanvasSettings.snapToGrid,
    gridSize: initialConfig.gridSize || storeCanvasSettings.gridSize || 8,
    backgroundColor: initialConfig.backgroundColor || storeCanvasSettings.backgroundColor || '#ffffff',
    gridType: initialConfig.gridType || storeCanvasSettings.gridType || 'lines',
    snapTolerance: initialConfig.snapTolerance || storeCanvasSettings.snapTolerance || 5,
    showSmartGuides: initialConfig.showSmartGuides || storeCanvasSettings.showSmartGuides || false
  });

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

  // Use the extracted canvas initialization
  const { initializeFabric } = useCanvasInitialization(
    canvasConfig, 
    setSelectedObject, 
    setIsDrawing, 
    isDrawing
  );

  // Use the extracted canvas actions
  const {
    addObject,
    removeObject,
    clearCanvas,
    saveCanvasAsJSON,
    loadCanvasFromJSON,
    zoomIn,
    zoomOut,
    resetZoom,
    pan
  } = useCanvasActions(fabricCanvas, updateConfig, canvasConfig);

  // Use the extracted grid actions
  const {
    toggleGrid,
    toggleSnapToGrid,
    setGridSize
  } = useGridActions(updateConfig, canvasConfig);

  // Initialize Fabric canvas
  const initCanvas = useCallback(() => {
    const canvas = initializeFabric(canvasRef.current);
    if (canvas) {
      setFabricCanvas(canvas);
    }
    return canvas;
  }, [initializeFabric]);

  // Initialize on mount and cleanup on unmount
  useEffect(() => {
    const canvas = initCanvas();
    
    // Cleanup on unmount
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, [initCanvas]);

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

// Add missing import
import { useEffect } from 'react';

export default useFabric;
