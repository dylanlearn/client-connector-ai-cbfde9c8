
import { useRef, useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { useWireframeStore } from '@/stores/wireframe-store';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { UseFabricOptions } from '@/types/fabric-canvas';
import { useCanvasInitialization } from './fabric/use-canvas-initialization';
import { useCanvasActions } from './fabric/use-canvas-actions';
import { useGridActions } from './fabric/use-grid-actions';
import { findAlignmentGuides, snapObjectToGuides, renderAlignmentGuides, highlightObjectBoundary } from '@/components/wireframe/utils/alignment-guides';

export function useFabric(options: UseFabricOptions = {}) {
  const { persistConfig = true, initialConfig = {} } = options;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [guides, setGuides] = useState<any[]>([]);
  
  const storeCanvasSettings = useWireframeStore(state => state.canvasSettings);
  const updateCanvasSettings = useWireframeStore(state => state.updateCanvasSettings);
  
  // Define the canvas configuration with all required properties
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>({
    width: initialConfig.width || storeCanvasSettings.width || 1200,
    height: initialConfig.height || storeCanvasSettings.height || 800,
    zoom: initialConfig.zoom || storeCanvasSettings.zoom || 1,
    panOffset: initialConfig.panOffset || storeCanvasSettings.panOffset || { x: 0, y: 0 },
    showGrid: initialConfig.showGrid !== undefined ? initialConfig.showGrid : storeCanvasSettings.showGrid !== undefined ? storeCanvasSettings.showGrid : true,
    snapToGrid: initialConfig.snapToGrid !== undefined ? initialConfig.snapToGrid : storeCanvasSettings.snapToGrid !== undefined ? storeCanvasSettings.snapToGrid : true,
    gridSize: initialConfig.gridSize || storeCanvasSettings.gridSize || 8,
    backgroundColor: initialConfig.backgroundColor || storeCanvasSettings.backgroundColor || '#ffffff',
    gridType: initialConfig.gridType || storeCanvasSettings.gridType || 'lines',
    snapTolerance: initialConfig.snapTolerance || storeCanvasSettings.snapTolerance || 5,
    showSmartGuides: initialConfig.showSmartGuides !== undefined ? initialConfig.showSmartGuides : storeCanvasSettings.showSmartGuides !== undefined ? storeCanvasSettings.showSmartGuides : false
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
    setGridSize,
    changeGridType
  } = useGridActions(updateConfig, canvasConfig);

  // Initialize Fabric canvas
  const initCanvas = useCallback(() => {
    const canvas = initializeFabric(canvasRef.current);
    if (canvas) {
      setFabricCanvas(canvas);
      
      // Set up smart guides if enabled
      if (canvasConfig.showSmartGuides) {
        canvas.on('object:moving', (e) => {
          if (!e.target) return;
          
          // Find alignment guides
          const activeObject = e.target;
          const allObjects = canvas.getObjects().filter(obj => obj !== activeObject);
          const newGuides = findAlignmentGuides(activeObject, allObjects, canvasConfig.snapTolerance);
          
          // Set guides for rendering
          setGuides(newGuides);
          
          // Apply snapping
          if (canvasConfig.showSmartGuides && newGuides.length > 0) {
            snapObjectToGuides(activeObject, newGuides, canvas);
          }
          
          // Highlight the object being moved for better visibility
          highlightObjectBoundary(activeObject, canvas);
        });
        
        canvas.on('object:modified', () => {
          setGuides([]);
          // Remove all highlights
          const highlights = canvas.getObjects().filter(obj => (obj as any).isHighlight);
          highlights.forEach(h => canvas.remove(h));
        });
        
        // Add custom rendering of guides
        canvas.on('after:render', () => {
          if (guides.length > 0 && canvas.contextTop) {
            renderAlignmentGuides(
              canvas.contextTop, 
              canvas.width || 1200, 
              canvas.height || 800, 
              guides
            );
          }
        });
      }
    }
    return canvas;
  }, [initializeFabric, canvasConfig.showSmartGuides, canvasConfig.snapTolerance]);

  // Initialize on mount and cleanup on unmount
  useEffect(() => {
    const canvas = initCanvas();
    
    // Cleanup on unmount
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, [initCanvas, fabricCanvas]);

  // Toggle smart guides
  const toggleSmartGuides = useCallback(() => {
    updateConfig({ showSmartGuides: !canvasConfig.showSmartGuides });
  }, [updateConfig, canvasConfig.showSmartGuides]);

  return {
    canvasRef,
    fabricCanvas,
    selectedObject,
    canvasConfig,
    isDrawing,
    guides,
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
    toggleSmartGuides,
    setGridSize,
    changeGridType,
    updateConfig,
    // Also expose the original initialize method
    initializeFabric,
    // Fabric canvas alias for backward compatibility
    canvas: fabricCanvas,
  };
}

export default useFabric;
