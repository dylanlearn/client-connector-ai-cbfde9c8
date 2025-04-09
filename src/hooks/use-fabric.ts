
import { useRef, useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { useCanvasActions } from '@/hooks/fabric/use-canvas-actions';
import { useGridActions } from '@/hooks/fabric/use-grid-actions';
import useCanvasHistory from '@/hooks/wireframe/use-canvas-history';

export interface UseFabricOptions {
  persistConfig?: boolean;
  initialConfig?: Partial<WireframeCanvasConfig>;
}

const DEFAULT_CONFIG: WireframeCanvasConfig = {
  width: 1200,
  height: 800,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  showGrid: true,
  snapToGrid: true,
  gridSize: 10,
  gridType: 'lines',
  snapTolerance: 5,
  backgroundColor: '#ffffff',
  showSmartGuides: true,
  showRulers: true,
  rulerSize: 20,
  gridColor: '#e0e0e0',
  historyEnabled: true,
  maxHistorySteps: 50
};

export function useFabric(options: UseFabricOptions = {}) {
  const { persistConfig = false, initialConfig = {} } = options;
  
  // State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>(() => {
    // Initialize with default config and override with initialConfig
    const config = { ...DEFAULT_CONFIG, ...initialConfig };
    
    // Load from localStorage if persistConfig is true
    if (persistConfig) {
      try {
        const storedConfig = localStorage.getItem('fabric-canvas-config');
        if (storedConfig) {
          return { ...config, ...JSON.parse(storedConfig) };
        }
      } catch (e) {
        console.error('Could not load canvas config from localStorage', e);
      }
    }
    
    return config;
  });

  // Initialize history management
  const { 
    saveHistoryState, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    isHistoryAction
  } = useCanvasHistory({
    canvas: fabricCanvas,
    maxHistorySteps: canvasConfig.maxHistorySteps || 50,
    saveInitialState: true
  });
  
  // Update config with persistence
  const updateConfig = useCallback((updates: Partial<WireframeCanvasConfig>) => {
    setCanvasConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      if (persistConfig) {
        try {
          localStorage.setItem('fabric-canvas-config', JSON.stringify(newConfig));
        } catch (e) {
          console.error('Could not save canvas config to localStorage', e);
        }
      }
      
      return newConfig;
    });
  }, [persistConfig]);
  
  // Initialize canvas
  const initializeCanvas = useCallback((canvasElement?: HTMLCanvasElement) => {
    const canvas = new fabric.Canvas(canvasElement || canvasRef.current, {
      width: canvasConfig.width,
      height: canvasConfig.height,
      backgroundColor: canvasConfig.backgroundColor
    });
    
    setFabricCanvas(canvas);
    
    // Set up event listeners
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

    // Set up grid if enabled
    if (canvasConfig.showGrid) {
      drawGrid(canvas);
    }
    
    // Set up snap-to-grid behavior
    if (canvasConfig.snapToGrid) {
      setupSnapToGrid(canvas);
    }
    
    return canvas;
  }, [
    canvasConfig.width, 
    canvasConfig.height, 
    canvasConfig.backgroundColor, 
    canvasConfig.showGrid,
    canvasConfig.snapToGrid,
    isDrawing
  ]);

  // Draw grid on canvas
  const drawGrid = useCallback((canvas: fabric.Canvas) => {
    const gridSize = canvasConfig.gridSize;
    const width = canvasConfig.width;
    const height = canvasConfig.height;
    const gridColor = canvasConfig.gridColor || '#e0e0e0';
    
    // Remove any existing grid
    const existingGrid = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
    existingGrid.forEach(obj => canvas.remove(obj));
    
    if (canvasConfig.gridType === 'lines') {
      // Vertical lines
      for (let i = 0; i <= width / gridSize; i++) {
        const line = new fabric.Line([i * gridSize, 0, i * gridSize, height], {
          stroke: gridColor,
          selectable: false,
          evented: false,
          strokeWidth: 1,
          data: { type: 'grid' }
        });
        canvas.add(line);
        line.moveTo(0); // Move to back
      }
      
      // Horizontal lines
      for (let i = 0; i <= height / gridSize; i++) {
        const line = new fabric.Line([0, i * gridSize, width, i * gridSize], {
          stroke: gridColor,
          selectable: false,
          evented: false,
          strokeWidth: 1,
          data: { type: 'grid' }
        });
        canvas.add(line);
        line.moveTo(0); // Move to back
      }
    } 
    else if (canvasConfig.gridType === 'dots') {
      for (let i = 0; i <= width / gridSize; i++) {
        for (let j = 0; j <= height / gridSize; j++) {
          const dot = new fabric.Circle({
            left: i * gridSize,
            top: j * gridSize,
            radius: 1,
            fill: gridColor,
            selectable: false,
            evented: false,
            originX: 'center',
            originY: 'center',
            data: { type: 'grid' }
          });
          canvas.add(dot);
          dot.moveTo(0); // Move to back
        }
      }
    }
    
    canvas.renderAll();
  }, [canvasConfig.gridSize, canvasConfig.width, canvasConfig.height, canvasConfig.gridType, canvasConfig.gridColor]);

  // Set up snap-to-grid functionality
  const setupSnapToGrid = useCallback((canvas: fabric.Canvas) => {
    const gridSize = canvasConfig.gridSize;
    const snapTolerance = canvasConfig.snapTolerance;
    
    canvas.on('object:moving', (options) => {
      const target = options.target;
      if (!target) return;
      
      const snapX = Math.round(target.left! / gridSize) * gridSize;
      const snapY = Math.round(target.top! / gridSize) * gridSize;
      
      const dx = Math.abs(snapX - target.left!);
      const dy = Math.abs(snapY - target.top!);
      
      if (dx <= snapTolerance) {
        target.set({ left: snapX });
      }
      
      if (dy <= snapTolerance) {
        target.set({ top: snapY });
      }
    });
    
    canvas.on('object:scaling', (options) => {
      const target = options.target;
      if (!target) return;
      
      // This is a simplistic approach - ideally we'd snap the corners during scaling
      const width = target.getScaledWidth();
      const height = target.getScaledHeight();
      
      const snapWidth = Math.round(width / gridSize) * gridSize;
      const snapHeight = Math.round(height / gridSize) * gridSize;
      
      if (Math.abs(snapWidth - width) <= snapTolerance) {
        target.scaleToWidth(snapWidth);
      }
      
      if (Math.abs(snapHeight - height) <= snapTolerance) {
        target.scaleToHeight(snapHeight);
      }
    });
    
    canvas.on('object:rotating', (options) => {
      const target = options.target;
      if (!target) return;
      
      // Snap rotation to 15 degree increments
      const ang = target.angle! % 360;
      const snapAng = Math.round(ang / 15) * 15;
      
      if (Math.abs(snapAng - ang) <= 3) {
        target.set({ angle: snapAng });
      }
    });
  }, [canvasConfig.gridSize, canvasConfig.snapTolerance]);

  // Update grid when config changes
  useEffect(() => {
    if (fabricCanvas) {
      if (canvasConfig.showGrid) {
        drawGrid(fabricCanvas);
      } else {
        // Remove grid
        const existingGrid = fabricCanvas.getObjects().filter(obj => obj.data?.type === 'grid');
        existingGrid.forEach(obj => fabricCanvas.remove(obj));
        fabricCanvas.renderAll();
      }
    }
  }, [fabricCanvas, canvasConfig.showGrid, canvasConfig.gridSize, canvasConfig.gridType, drawGrid]);
  
  // Update snap behavior when config changes
  useEffect(() => {
    if (fabricCanvas) {
      // Reset event listeners for snap behavior to avoid duplicates
      fabricCanvas.off('object:moving');
      fabricCanvas.off('object:scaling');
      fabricCanvas.off('object:rotating');
      
      if (canvasConfig.snapToGrid) {
        setupSnapToGrid(fabricCanvas);
      }
    }
  }, [fabricCanvas, canvasConfig.snapToGrid, canvasConfig.gridSize, setupSnapToGrid]);
  
  // Dispose canvas on unmount
  useEffect(() => {
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, [fabricCanvas]);
  
  // Get canvas actions
  const canvasActions = useCanvasActions(fabricCanvas, updateConfig, canvasConfig);
  
  // Get grid actions
  const gridActions = useGridActions(updateConfig, canvasConfig);
  
  return {
    canvasRef,
    fabricCanvas,
    canvasConfig,
    selectedObject,
    isDrawing,
    updateConfig,
    initializeCanvas,
    setSelectedObject,
    setIsDrawing,
    undo,
    redo,
    canUndo,
    canRedo,
    saveHistoryState,
    isHistoryAction,
    ...canvasActions,
    ...gridActions
  };
}
