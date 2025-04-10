import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';

// Utility function to create a grid on the canvas
const createCanvasGrid = (
  canvas: fabric.Canvas, 
  gridSize: number,
  color: string = '#e0e0e0'
) => {
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const gridLines: fabric.Line[] = [];

  // Create vertical lines
  for (let i = 0; i <= width; i += gridSize) {
    const line = new fabric.Line([i, 0, i, height], {
      stroke: color,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      data: { type: 'grid' }
    });
    gridLines.push(line);
  }

  // Create horizontal lines
  for (let i = 0; i <= height; i += gridSize) {
    const line = new fabric.Line([0, i, width, i], {
      stroke: color,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      data: { type: 'grid' }
    });
    gridLines.push(line);
  }

  return gridLines;
};

export interface UseEnhancedCanvasEngineOptions {
  width?: number;
  height?: number;
  initialConfig?: Partial<WireframeCanvasConfig>;
  onSelectionChange?: (selectedObject: fabric.Object | null) => void;
  onCanvasChange?: (canvas: fabric.Canvas) => void;
}

export function useEnhancedCanvasEngine({
  width = 1200,
  height = 800,
  initialConfig = {},
  onSelectionChange,
  onCanvasChange
}: UseEnhancedCanvasEngineOptions = {}) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Config state
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
    rulerColor: '#bbbbbb',
    rulerMarkings: true,
    historyEnabled: true,
    maxHistorySteps: 50,
    gridColor: '#e0e0e0',
    ...initialConfig
  });
  
  // Canvas history
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    saveHistoryState 
  } = useCanvasHistory({ 
    canvas,
    maxHistorySteps: 50
  });
  
  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return null;
    
    try {
      // Create fabric canvas
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: config.width,
        height: config.height,
        backgroundColor: config.backgroundColor,
        selection: true,
        preserveObjectStacking: true
      });
      
      setCanvas(fabricCanvas);
      setIsInitialized(true);
      
      // Set up event listeners
      fabricCanvas.on('selection:created', (e) => {
        const selectedObj = e.selected?.[0] || null;
        setSelectedObject(selectedObj);
        if (onSelectionChange) {
          onSelectionChange(selectedObj);
        }
      });
      
      fabricCanvas.on('selection:updated', (e) => {
        const selectedObj = e.selected?.[0] || null;
        setSelectedObject(selectedObj);
        if (onSelectionChange) {
          onSelectionChange(selectedObj);
        }
      });
      
      fabricCanvas.on('selection:cleared', () => {
        setSelectedObject(null);
        if (onSelectionChange) {
          onSelectionChange(null);
        }
      });
      
      fabricCanvas.on('object:modified', () => {
        saveHistoryState('Object modified');
        if (onCanvasChange) {
          onCanvasChange(fabricCanvas);
        }
      });
      
      // Add keyboard event listeners
      const handleKeyDown = (e: KeyboardEvent) => {
        // Undo/Redo
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
        
        // Delete selected object
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (selectedObject && fabricCanvas.getActiveObject()) {
            fabricCanvas.remove(fabricCanvas.getActiveObject());
            fabricCanvas.renderAll();
            saveHistoryState('Object deleted');
          }
        }
        
        // Start panning with spacebar
        if (e.code === 'Space' && !e.repeat) {
          setIsPanning(true);
          fabricCanvas.defaultCursor = 'grab';
          fabricCanvas.hoverCursor = 'grab';
        }
      };
      
      const handleKeyUp = (e: KeyboardEvent) => {
        // Stop panning when spacebar is released
        if (e.code === 'Space') {
          setIsPanning(false);
          fabricCanvas.defaultCursor = 'default';
          fabricCanvas.hoverCursor = 'move';
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      // Add mouse event handlers for panning
      fabricCanvas.on('mouse:down', (e) => {
        if (isPanning || e.e.altKey) {
          fabricCanvas.defaultCursor = 'grabbing';
          fabricCanvas.hoverCursor = 'grabbing';
          fabricCanvas.selection = false;
          fabricCanvas.discardActiveObject();
          fabricCanvas.renderAll();
        }
      });
      
      fabricCanvas.on('mouse:move', (e) => {
        if ((isPanning || e.e.altKey) && e.e.buttons === 1) {
          const delta = new fabric.Point(e.e.movementX, e.e.movementY);
          fabricCanvas.relativePan(delta);
          
          // Update pan offset in config
          setConfig(prev => ({
            ...prev,
            panOffset: {
              x: (prev.panOffset.x || 0) + e.e.movementX,
              y: (prev.panOffset.y || 0) + e.e.movementY
            }
          }));
        }
      });
      
      fabricCanvas.on('mouse:up', () => {
        if (isPanning) {
          fabricCanvas.defaultCursor = 'grab';
          fabricCanvas.hoverCursor = 'grab';
        } else {
          fabricCanvas.defaultCursor = 'default';
          fabricCanvas.hoverCursor = 'move';
        }
        fabricCanvas.selection = true;
      });
      
      // Handle mouse wheel for zooming
      fabricCanvas.on('mouse:wheel', (e) => {
        if (!e.e.ctrlKey && !e.e.metaKey) return;
        
        e.e.preventDefault();
        e.e.stopPropagation();
        
        const delta = e.e.deltaY;
        let zoom = fabricCanvas.getZoom();
        zoom = delta > 0 ? Math.max(0.1, zoom - 0.1) : Math.min(3, zoom + 0.1);
        
        fabricCanvas.zoomToPoint(
          new fabric.Point(e.e.offsetX, e.e.offsetY),
          zoom
        );
        
        setConfig(prev => ({
          ...prev,
          zoom
        }));
      });
      
      // Draw grid if needed
      if (config.showGrid) {
        const gridLines = createCanvasGrid(fabricCanvas, config.gridSize, config.gridColor);
        gridLines.forEach(line => fabricCanvas.add(line));
        fabricCanvas.renderAll();
      }
      
      // Setup snap-to-grid
      if (config.snapToGrid) {
        fabricCanvas.on('object:moving', (e) => {
          if (!e.target) return;
          
          const gridSize = config.gridSize;
          const target = e.target;
          
          // Snap to nearest grid point
          if (target.left !== undefined) {
            target.set({
              left: Math.round(target.left / gridSize) * gridSize
            });
          }
          
          if (target.top !== undefined) {
            target.set({
              top: Math.round(target.top / gridSize) * gridSize
            });
          }
        });
      }
      
      // Clean up
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        fabricCanvas.dispose();
      };
      
      return fabricCanvas;
    } catch (error) {
      console.error('Error initializing canvas:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize canvas',
        variant: 'destructive'
      });
      return null;
    }
  }, [
    config.backgroundColor, 
    config.width, 
    config.height, 
    config.gridSize, 
    config.showGrid, 
    config.snapToGrid,
    isPanning, 
    selectedObject, 
    onSelectionChange, 
    onCanvasChange,
    saveHistoryState,
    undo, 
    redo,
    toast
  ]);
  
  // Zoom and pan methods
  const zoomIn = useCallback(() => {
    if (!canvas) return;
    
    const newZoom = Math.min(3, config.zoom + 0.1);
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
  
  // Grid management
  const toggleGrid = useCallback(() => {
    if (!canvas) return;
    
    setConfig(prev => {
      const showGrid = !prev.showGrid;
      
      // Remove existing grid
      const gridObjects = canvas.getObjects().filter(obj => (obj as any).data?.type === 'grid');
      gridObjects.forEach(obj => canvas.remove(obj));
      
      // Add grid if needed
      if (showGrid) {
        const gridLines = createCanvasGrid(canvas, prev.gridSize, config.gridColor);
        gridLines.forEach(line => canvas.add(line));
      }
      
      canvas.renderAll();
      return { ...prev, showGrid };
    });
  }, [canvas, config.gridColor]);
  
  const toggleSnapToGrid = useCallback(() => {
    setConfig(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  }, []);
  
  // Add new objects
  const addRectangle = useCallback(() => {
    if (!canvas) return;
    
    const rect = new fabric.Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      fill: '#f5f5f5',
      stroke: '#333333',
      strokeWidth: 1,
      cornerSize: 10,
      transparentCorners: false
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    saveHistoryState('Added rectangle');
  }, [canvas, saveHistoryState]);
  
  const addCircle = useCallback(() => {
    if (!canvas) return;
    
    const circle = new fabric.Circle({
      left: 50,
      top: 50,
      radius: 50,
      fill: '#f5f5f5',
      stroke: '#333333',
      strokeWidth: 1,
      cornerSize: 10,
      transparentCorners: false
    });
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    saveHistoryState('Added circle');
  }, [canvas, saveHistoryState]);
  
  const addText = useCallback((text = 'Text') => {
    if (!canvas) return;
    
    const textObj = new fabric.Text(text, {
      left: 50,
      top: 50,
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#333333'
    });
    
    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
    saveHistoryState('Added text');
  }, [canvas, saveHistoryState]);
  
  // Update config
  const updateCanvasConfig = useCallback((updates: Partial<WireframeCanvasConfig>) => {
    if (!canvas) return;
    
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      // Update canvas dimensions if they changed
      if (updates.width || updates.height) {
        canvas.setDimensions({ 
          width: updates.width || prev.width, 
          height: updates.height || prev.height 
        });
      }
      
      // Update background color
      if (updates.backgroundColor) {
        canvas.setBackgroundColor(updates.backgroundColor, () => {
          canvas.renderAll();
        });
      }
      
      // Update zoom
      if (updates.zoom && updates.zoom !== prev.zoom) {
        canvas.setZoom(updates.zoom);
        canvas.renderAll();
      }
      
      return newConfig;
    });
  }, [canvas]);
  
  // Save canvas as JSON
  const saveCanvasAsJSON = useCallback(() => {
    if (!canvas) return null;
    
    try {
      return canvas.toJSON(['id', 'name', 'data']);
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast({
        title: 'Error',
        description: 'Failed to save canvas',
        variant: 'destructive'
      });
      return null;
    }
  }, [canvas, toast]);
  
  // Load canvas from JSON
  const loadCanvasFromJSON = useCallback((data: any) => {
    if (!canvas) return;
    
    try {
      canvas.loadFromJSON(data, () => {
        canvas.renderAll();
        saveHistoryState('Canvas loaded');
      });
    } catch (error) {
      console.error('Error loading canvas:', error);
      toast({
        title: 'Error',
        description: 'Failed to load canvas data',
        variant: 'destructive'
      });
    }
  }, [canvas, saveHistoryState, toast]);
  
  return {
    canvas,
    canvasRef,
    containerRef,
    config,
    selectedObject,
    isInitialized,
    isPanning,
    initializeCanvas,
    updateCanvasConfig,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid,
    toggleSnapToGrid,
    addRectangle,
    addCircle,
    addText,
    saveCanvasAsJSON,
    loadCanvasFromJSON,
    undo,
    redo,
    canUndo,
    canRedo
  };
}

export default useEnhancedCanvasEngine;
