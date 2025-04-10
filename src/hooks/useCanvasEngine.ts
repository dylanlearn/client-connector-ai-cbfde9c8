
import { useRef, useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { 
  calculateGridPositions,
  generateSnapGuidelines,
  createCanvasGrid
} from '@/components/wireframe/utils';
import useCanvasHistory from './wireframe/use-canvas-history';

export interface UseCanvasEngineOptions {
  containerId?: string;
  canvasId?: string;
  width?: number;
  height?: number;
}

export function useCanvasEngine(options: UseCanvasEngineOptions = {}) {
  const {
    containerId = 'canvas-container',
    canvasId = 'fabric-canvas',
    width = 1200,
    height = 800
  } = options;
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  
  const [config, setConfig] = useState<WireframeCanvasConfig>({
    width,
    height,
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
    rulerColor: '#bbbbbb',
    rulerMarkings: true,
    historyEnabled: true,
    maxHistorySteps: 50
  });

  // Initialize canvas history
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    saveHistoryState 
  } = useCanvasHistory({ 
    canvas,
    maxHistorySteps: 50,
  });
  
  // Handle keyboard events for panning (space + drag) and undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setIsSpacePressed(true);
        if (canvas) {
          canvas.defaultCursor = 'grab';
          canvas.hoverCursor = 'grab';
        }
      }
      
      // Handle undo/redo keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo(); // Ctrl/Cmd+Shift+Z for redo
          } else {
            undo(); // Ctrl/Cmd+Z for undo
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          redo(); // Ctrl/Cmd+Y for redo
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsDragging(false);
        if (canvas) {
          canvas.defaultCursor = 'default';
          canvas.hoverCursor = 'move';
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvas, undo, redo]);
  
  // Handle mouse events for panning
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (isSpacePressed && e.button === 0 && canvas) {
      setIsDragging(true);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      canvas.defaultCursor = 'grabbing';
      canvas.hoverCursor = 'grabbing';
    }
  }, [isSpacePressed, canvas]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && canvas) {
      const delta = new fabric.Point(e.movementX, e.movementY);
      canvas.relativePan(delta);
      
      const transform = canvas.viewportTransform;
      if (transform) {
        setConfig(prev => ({
          ...prev,
          panOffset: { x: transform[4], y: transform[5] }
        }));
      }
    }
  }, [isDragging, canvas]);
  
  const handleMouseUp = useCallback(() => {
    if (isDragging && canvas) {
      setIsDragging(false);
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
    }
  }, [isDragging, canvas]);
  
  // Initialize the canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvasElement = canvasRef.current;
    
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      width: config.width,
      height: config.height,
      backgroundColor: config.backgroundColor,
      selection: true,
      preserveObjectStacking: true
    });
    
    setCanvas(fabricCanvas);
    setIsInitialized(true);
    
    // Add event listeners for object selection
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    
    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    
    // Add event listeners for object modifications to save history
    fabricCanvas.on('object:modified', () => {
      saveHistoryState('Object modified');
    });
    
    fabricCanvas.on('object:added', (e) => {
      if (e.target?.temporary) return; // Skip temporary objects
      saveHistoryState('Object added');
    });
    
    fabricCanvas.on('object:removed', () => {
      saveHistoryState('Object removed');
    });
    
    // Set up snapping behavior
    if (config.snapToGrid) {
      fabricCanvas.on('object:moving', (e) => {
        if (!e.target) return;
        
        const gridSize = config.gridSize;
        const target = e.target;
        
        target.set({
          left: Math.round(target.left! / gridSize) * gridSize,
          top: Math.round(target.top! / gridSize) * gridSize
        });
      });
    }
    
    if (config.showGrid) {
      const gridLines = createCanvasGrid(fabricCanvas, config.gridSize, config.gridType);
      gridLines.forEach(line => fabricCanvas.add(line));
    }
    
    // Initialize with saved pan/zoom
    if (config.zoom !== 1) {
      fabricCanvas.setZoom(config.zoom);
    }
    
    if (config.panOffset.x !== 0 || config.panOffset.y !== 0) {
      fabricCanvas.absolutePan(new fabric.Point(config.panOffset.x, config.panOffset.y));
    }
    
    // Set up mouse event listeners
    canvasElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Save initial history state
    saveHistoryState('Initial canvas state');
    
    return fabricCanvas;
  }, [config, handleMouseDown, handleMouseMove, handleMouseUp, saveHistoryState]);
  
  // Clean up event listeners when unmounting
  useEffect(() => {
    return () => {
      if (canvas) {
        canvas.dispose();
      }
      
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleMouseDown);
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  // Zoom utility functions
  const zoomIn = useCallback(() => {
    if (!canvas) return;
    
    const newZoom = Math.min(5, config.zoom + 0.1);
    canvas.setZoom(newZoom);
    
    setConfig(prev => ({ ...prev, zoom: newZoom }));
  }, [canvas, config.zoom]);
  
  const zoomOut = useCallback(() => {
    if (!canvas) return;
    
    const newZoom = Math.max(0.1, config.zoom - 0.1);
    canvas.setZoom(newZoom);
    
    setConfig(prev => ({ ...prev, zoom: newZoom }));
  }, [canvas, config.zoom]);
  
  const resetZoom = useCallback(() => {
    if (!canvas) return;
    
    canvas.setZoom(1);
    canvas.absolutePan(new fabric.Point(0, 0));
    
    setConfig(prev => ({ 
      ...prev, 
      zoom: 1, 
      panOffset: { x: 0, y: 0 } 
    }));
  }, [canvas]);
  
  // Grid utility functions
  const toggleGrid = useCallback(() => {
    setConfig(prev => {
      const showGrid = !prev.showGrid;
      
      if (canvas) {
        // Remove existing grid lines
        const existingGridLines = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
        existingGridLines.forEach(line => canvas.remove(line));
        
        // Add new grid lines if needed
        if (showGrid) {
          const gridLines = createCanvasGrid(canvas, prev.gridSize, prev.gridType);
          gridLines.forEach(line => canvas.add(line));
        }
        
        canvas.requestRenderAll();
      }
      
      return { ...prev, showGrid };
    });
  }, [canvas]);
  
  const toggleSnapToGrid = useCallback(() => {
    setConfig(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  }, []);
  
  return {
    canvas,
    canvasRef,
    containerRef,
    config,
    setConfig,
    selectedObject,
    isInitialized,
    initializeCanvas,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid,
    toggleSnapToGrid,
    undo,
    redo,
    canUndo,
    canRedo,
    isDragging,
    isSpacePressed
  };
}

export default useCanvasEngine;
