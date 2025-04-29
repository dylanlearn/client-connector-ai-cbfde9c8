import { useRef, useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { useHighPerformanceCanvas } from './use-high-performance-canvas';
import { useEnhancedCanvasControls } from './use-enhanced-canvas-controls';

export interface GridOptions {
  visible: boolean;
  size: number;
  snapTo: boolean;
  color: string;
  type: 'lines' | 'dots';
}

export interface CanvasOptions {
  width: number;
  height: number;
  backgroundColor: string;
  preserveObjectStacking: boolean;
}

export interface EnhancedCanvasEngineOptions {
  canvasOptions: Partial<CanvasOptions>;
  gridOptions: Partial<GridOptions>;
  optimizationOptions?: {
    useLayerCaching?: boolean;
    incrementalRendering?: boolean;
    hardwareAcceleration?: boolean;
  };
  memoryOptions?: {
    autoGarbageCollection?: boolean;
    objectPooling?: boolean;
  };
}

export function useEnhancedCanvasEngine(options: Partial<EnhancedCanvasEngineOptions> = {}) {
  // Refs and state
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [gridVisible, setGridVisible] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  
  // Default options
  const defaultOptions: EnhancedCanvasEngineOptions = {
    canvasOptions: {
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true
    },
    gridOptions: {
      visible: true,
      size: 20,
      snapTo: true,
      color: '#e0e0e0',
      type: 'lines'
    },
    optimizationOptions: {
      useLayerCaching: true,
      incrementalRendering: true,
      hardwareAcceleration: true
    },
    memoryOptions: {
      autoGarbageCollection: true,
      objectPooling: true
    }
  };
  
  // Merge options with defaults
  const mergedOptions = {
    canvasOptions: { ...defaultOptions.canvasOptions, ...options.canvasOptions },
    gridOptions: { ...defaultOptions.gridOptions, ...options.gridOptions },
    optimizationOptions: { ...defaultOptions.optimizationOptions, ...options.optimizationOptions },
    memoryOptions: { ...defaultOptions.memoryOptions, ...options.memoryOptions }
  };
  
  // Initialize high performance canvas with optimization
  const {
    canvas,
    canvasRef,
    performanceMetrics,
    renderCanvas,
    addObject,
    removeObject,
    cleanupResources
  } = useHighPerformanceCanvas({
    width: mergedOptions.canvasOptions.width,
    height: mergedOptions.canvasOptions.height,
    optimizationOptions: mergedOptions.optimizationOptions,
    memoryOptions: mergedOptions.memoryOptions
  });
  
  // Initialize enhanced canvas controls
  const canvasControls = useEnhancedCanvasControls({
    canvas,
    zoom,
    isDragging,
    onZoomIn: () => handleZoom(zoom * 1.1),
    onZoomOut: () => handleZoom(zoom * 0.9),
    onResetZoom: () => handleZoom(1),
    onToggleGrid: () => setGridVisible(!gridVisible),
    onSetZoom: handleZoom
  });
  
  // Handle zoom changes
  function handleZoom(newZoom: number) {
    if (!canvas) return;
    
    // Clamp zoom between 0.1 and 5
    const clampedZoom = Math.max(0.1, Math.min(5, newZoom));
    
    // Apply zoom to canvas
    canvas.setZoom(clampedZoom);
    setZoom(clampedZoom);
    renderCanvas();
  }
  
  // Handle pan
  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    if (!canvas) return;
    
    // Update pan state
    setPan(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    // Apply pan to canvas viewportTransform
    const vpt = canvas.viewportTransform;
    if (vpt) {
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      canvas.setViewportTransform(vpt);
      renderCanvas();
    }
  }, [canvas, renderCanvas]);
  
  // Setup canvas event handlers
  useEffect(() => {
    if (!canvas) return;
    
    // Mouse down handler for pan
    const handleMouseDown = (e: fabric.IEvent) => {
      if (e.e.button !== 1 && !e.e.altKey) return; // Middle mouse button or alt key
      
      setIsDragging(true);
      canvas.selection = false;
      
      const pointer = canvas.getPointer(e.e);
      const lastPos = { x: pointer.x, y: pointer.y };
      
      // Mouse move handler for dragging
      const handleMouseMove = (e: fabric.IEvent) => {
        if (!isDragging) return;
        
        const pointer = canvas.getPointer(e.e);
        const dx = pointer.x - lastPos.x;
        const dy = pointer.y - lastPos.y;
        
        handlePan(dx, dy);
        
        lastPos.x = pointer.x;
        lastPos.y = pointer.y;
      };
      
      // Mouse up handler to end dragging
      const handleMouseUp = () => {
        setIsDragging(false);
        canvas.selection = true;
        
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
      };
      
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
    };
    
    // Selection handler
    const handleSelection = (e: fabric.IEvent) => {
      setSelectedObject(e.selected?.[0] || null);
    };
    
    // Selection cleared handler
    const handleSelectionCleared = () => {
      setSelectedObject(null);
    };
    
    // Mouse wheel handler for zoom
    const handleMouseWheel = (e: fabric.IEvent) => {
      if (!e.e) return;
      const wheelEvent = e.e as WheelEvent;
      
      // Only zoom if ctrl key is pressed
      if (wheelEvent.ctrlKey) {
        wheelEvent.preventDefault();
        wheelEvent.stopPropagation();
        
        const delta = wheelEvent.deltaY;
        const zoom = canvas.getZoom();
        
        // Calculate new zoom (smaller delta for smoother zoom)
        const newZoom = delta > 0 ? zoom * 0.95 : zoom * 1.05;
        
        // Get pointer position
        const pointer = canvas.getPointer(wheelEvent);
        
        // Zoom at pointer
        handleZoomAtPoint(newZoom, { x: pointer.x, y: pointer.y });
      }
    };
    
    // Add event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('mouse:wheel', handleMouseWheel);
    
    return () => {
      // Remove event listeners
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('mouse:wheel', handleMouseWheel);
    };
  }, [canvas, isDragging, handlePan]);
  
  // Draw grid
  useEffect(() => {
    if (!canvas) return;
    
    const drawGrid = () => {
      if (!gridVisible) return;
      
      // Clear existing grid
      canvas.getObjects().forEach(obj => {
        if (obj.data && obj.data.isGrid) {
          canvas.remove(obj);
        }
      });
      
      const gridSize = mergedOptions.gridOptions.size || 20;
      const gridColor = mergedOptions.gridOptions.color || '#e0e0e0';
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      
      if (mergedOptions.gridOptions.type === 'lines') {
        // Create horizontal grid lines
        for (let i = 0; i < canvasHeight; i += gridSize) {
          const line = new fabric.Line([0, i, canvasWidth, i], {
            stroke: gridColor,
            selectable: false,
            evented: false,
            strokeWidth: 0.5,
            data: { isGrid: true }
          });
          canvas.add(line);
          canvas.sendToBack(line);
        }
        
        // Create vertical grid lines
        for (let i = 0; i < canvasWidth; i += gridSize) {
          const line = new fabric.Line([i, 0, i, canvasHeight], {
            stroke: gridColor,
            selectable: false,
            evented: false,
            strokeWidth: 0.5,
            data: { isGrid: true }
          });
          canvas.add(line);
          canvas.sendToBack(line);
        }
      } else if (mergedOptions.gridOptions.type === 'dots') {
        // Create grid dots
        for (let i = 0; i < canvasWidth; i += gridSize) {
          for (let j = 0; j < canvasHeight; j += gridSize) {
            const dot = new fabric.Circle({
              left: i,
              top: j,
              radius: 1,
              fill: gridColor,
              selectable: false,
              evented: false,
              data: { isGrid: true }
            });
            canvas.add(dot);
            canvas.sendToBack(dot);
          }
        }
      }
      
      renderCanvas();
    };
    
    drawGrid();
  }, [canvas, gridVisible, mergedOptions.gridOptions, renderCanvas]);
  
  // Set up object snapping
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!snapToGrid || !e.target) return;
      
      const gridSize = mergedOptions.gridOptions.size || 20;
      const obj = e.target;
      
      // Snap to grid
      obj.set({
        left: Math.round(obj.left! / gridSize) * gridSize,
        top: Math.round(obj.top! / gridSize) * gridSize
      });
    };
    
    canvas.on('object:moving', handleObjectMoving);
    
    return () => {
      canvas.off('object:moving', handleObjectMoving);
    };
  }, [canvas, snapToGrid, mergedOptions.gridOptions]);
  
  // Zoom at specific point
  const handleZoomAtPoint = useCallback((newZoom: number, point: { x: number, y: number }) => {
    if (!canvas) return;
    
    // Clamp zoom between 0.1 and 5
    const clampedZoom = Math.max(0.1, Math.min(5, newZoom));
    
    // Get current zoom
    const oldZoom = canvas.getZoom();
    
    // Calculate new viewport transform
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    const newVpt = [...vpt];
    
    // Zoom around point
    newVpt[0] = clampedZoom;
    newVpt[3] = clampedZoom;
    
    // Adjust pan to keep point fixed
    newVpt[4] = point.x - (point.x - vpt[4]) * (clampedZoom / oldZoom);
    newVpt[5] = point.y - (point.y - vpt[5]) * (clampedZoom / oldZoom);
    
    // Apply new transform
    canvas.setViewportTransform(newVpt);
    setZoom(clampedZoom);
    
    // Update pan state
    setPan({ x: newVpt[4], y: newVpt[5] });
    
    renderCanvas();
  }, [canvas, renderCanvas]);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setSnapToGrid(prev => !prev);
  }, []);
  
  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    
    // Clear all objects except grid
    canvas.getObjects().forEach(obj => {
      if (!obj.data || !obj.data.isGrid) {
        canvas.remove(obj);
      }
    });
    
    renderCanvas();
  }, [canvas, renderCanvas]);
  
  // Add a new object to canvas
  const addNewObject = useCallback((obj: fabric.Object) => {
    if (!canvas) return;
    
    addObject(obj);
    renderCanvas();
  }, [canvas, addObject, renderCanvas]);
  
  // Remove an object from canvas
  const removeSelectedObject = useCallback(() => {
    if (!canvas || !selectedObject) return;
    
    removeObject(selectedObject);
    setSelectedObject(null);
    renderCanvas();
  }, [canvas, selectedObject, removeObject, renderCanvas]);
  
  // Resize canvas
  const resizeCanvas = useCallback((width: number, height: number) => {
    if (!canvas) return;
    
    canvas.setDimensions({ width, height });
    setCanvasSize({ width, height });
    renderCanvas();
  }, [canvas, renderCanvas]);
  
  // Handle window resize
  useEffect(() => {
    if (!containerRef.current || !canvas) return;
    
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        resizeCanvas(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, canvas, resizeCanvas]);
  
  // Export as image
  const exportAsImage = useCallback(() => {
    if (!canvas) return '';
    
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1 / zoom  // Adjust for zoom level
    });
    
    return dataUrl;
  }, [canvas, zoom]);
  
  // Import from JSON
  const importFromJSON = useCallback((json: string) => {
    if (!canvas) return;
    
    try {
      canvas.loadFromJSON(json, () => {
        renderCanvas();
      });
    } catch (error) {
      console.error('Error importing from JSON:', error);
    }
  }, [canvas, renderCanvas]);
  
  // Export to JSON
  const exportToJSON = useCallback(() => {
    if (!canvas) return '';
    
    return JSON.stringify(canvas.toJSON());
  }, [canvas]);
  
  return {
    canvas,
    canvasRef,
    containerRef,
    zoom,
    pan,
    isDragging,
    gridVisible,
    snapToGrid,
    canvasSize,
    selectedObject,
    performanceMetrics,
    canvasControls,
    handleZoom,
    handlePan,
    toggleSnapToGrid,
    setGridVisible,
    clearCanvas,
    addObject: addNewObject,
    removeObject: removeSelectedObject,
    exportAsImage,
    importFromJSON,
    exportToJSON,
    resizeCanvas,
    cleanupResources
  };
}
