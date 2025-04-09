
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import PropertyPanel from './PropertyPanel';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut,
  RotateCcw, 
  Grid, 
  Layers, 
  Trash2, 
  Save, 
  DownloadCloud,
  Upload,
  Undo,
  Redo,
  Magnet,
  Copy,
  ClipboardCopy
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FabricDesignCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onCanvasChanged?: (canvas: fabric.Canvas) => void;
  onSelectionChanged?: (selectedObject: fabric.Object | null) => void;
  initialCanvasConfig?: Partial<WireframeCanvasConfig>;
}

const FabricDesignCanvas: React.FC<FabricDesignCanvasProps> = ({
  width = 800,
  height = 600,
  className,
  onCanvasReady,
  onCanvasChanged,
  onSelectionChanged,
  initialCanvasConfig
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [historyPosition, setHistoryPosition] = useState(-1);
  const [history, setHistory] = useState<string[]>([]);
  
  // Canvas configuration with defaults and provided overrides
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>({
    width: width,
    height: height,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 20,
    gridType: 'lines',
    snapTolerance: 5,
    backgroundColor: '#ffffff',
    showSmartGuides: true,
    gridColor: '#e0e0e0',
    ...(initialCanvasConfig || {})
  });
  
  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasConfig.width,
      height: canvasConfig.height,
      backgroundColor: canvasConfig.backgroundColor,
      selection: true // Allow multiple selection with the mouse
    });
    
    setFabricCanvas(canvas);
    
    // Save initial state to history
    const initialJson = JSON.stringify(canvas.toJSON());
    setHistory([initialJson]);
    setHistoryPosition(0);
    
    // Call onCanvasReady callback if provided
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
    
    // Draw grid if enabled
    if (canvasConfig.showGrid) {
      drawGrid(canvas);
    }
    
    return () => {
      canvas.dispose();
    };
  }, [canvasConfig.width, canvasConfig.height, canvasConfig.backgroundColor, onCanvasReady]);
  
  // Add event listeners
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleSelectionCreated = (options: fabric.IEvent) => {
      const selectedObj = fabricCanvas.getActiveObject();
      setSelectedObject(selectedObj);
      
      if (onSelectionChanged) {
        onSelectionChanged(selectedObj);
      }
    };
    
    const handleSelectionCleared = () => {
      setSelectedObject(null);
      
      if (onSelectionChanged) {
        onSelectionChanged(null);
      }
    };
    
    const handleObjectModified = (options: fabric.IEvent) => {
      addToHistory();
      
      if (onCanvasChanged) {
        onCanvasChanged(fabricCanvas);
      }
    };
    
    fabricCanvas.on('selection:created', handleSelectionCreated);
    fabricCanvas.on('selection:updated', handleSelectionCreated);
    fabricCanvas.on('selection:cleared', handleSelectionCleared);
    fabricCanvas.on('object:modified', handleObjectModified);
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('selection:created', handleSelectionCreated);
        fabricCanvas.off('selection:updated', handleSelectionCreated);
        fabricCanvas.off('selection:cleared', handleSelectionCleared);
        fabricCanvas.off('object:modified', handleObjectModified);
      }
    };
  }, [fabricCanvas, onSelectionChanged, onCanvasChanged]);
  
  // Draw grid lines
  const drawGrid = (canvas: fabric.Canvas) => {
    // Remove any existing grid lines
    const existingGridLines = canvas.getObjects().filter((obj) => {
      return obj.data?.type === 'grid';
    });
    
    existingGridLines.forEach((line) => {
      canvas.remove(line);
    });
    
    // Skip if grid is not shown
    if (!canvasConfig.showGrid) return;
    
    const gridSize = canvasConfig.gridSize;
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    if (canvasConfig.gridType === 'lines') {
      // Draw vertical lines
      for (let i = 0; i < width / gridSize; i++) {
        const line = new fabric.Line([i * gridSize, 0, i * gridSize, height], {
          stroke: canvasConfig.gridColor || '#e0e0e0',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { type: 'grid' }
        });
        canvas.add(line);
        canvas.sendToBack(line);
      }
      
      // Draw horizontal lines
      for (let i = 0; i < height / gridSize; i++) {
        const line = new fabric.Line([0, i * gridSize, width, i * gridSize], {
          stroke: canvasConfig.gridColor || '#e0e0e0',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { type: 'grid' }
        });
        canvas.add(line);
        canvas.sendToBack(line);
      }
    } else if (canvasConfig.gridType === 'dots') {
      // Draw dots at grid intersections
      for (let i = 0; i <= width / gridSize; i++) {
        for (let j = 0; j <= height / gridSize; j++) {
          const dot = new fabric.Circle({
            left: i * gridSize - 1,
            top: j * gridSize - 1,
            radius: 1,
            fill: canvasConfig.gridColor || '#e0e0e0',
            stroke: null,
            selectable: false,
            evented: false,
            data: { type: 'grid' }
          });
          canvas.add(dot);
          canvas.sendToBack(dot);
        }
      }
    } else if (canvasConfig.gridType === 'columns') {
      // Draw a column-based grid (like in design systems)
      const columns = 12; // Standard 12-column grid
      const gutter = 20; // Gutter between columns
      const margin = 50; // Page margin
      const columnWidth = (width - 2 * margin - (columns - 1) * gutter) / columns;
      
      // Draw margin lines
      const leftMargin = new fabric.Line([margin, 0, margin, height], {
        stroke: canvasConfig.gridColor || '#e0e0e0',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        data: { type: 'grid' }
      });
      
      const rightMargin = new fabric.Line([width - margin, 0, width - margin, height], {
        stroke: canvasConfig.gridColor || '#e0e0e0',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        data: { type: 'grid' }
      });
      
      canvas.add(leftMargin);
      canvas.add(rightMargin);
      
      // Draw column lines
      let x = margin;
      for (let i = 0; i < columns; i++) {
        // Right edge of column
        x += columnWidth;
        const colLine = new fabric.Line([x, 0, x, height], {
          stroke: canvasConfig.gridColor || '#e0e0e0',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { type: 'grid' }
        });
        canvas.add(colLine);
        
        // Only add gutter line if it's not the last column
        if (i < columns - 1) {
          x += gutter;
          const gutterLine = new fabric.Line([x, 0, x, height], {
            stroke: canvasConfig.gridColor || '#e0e0e0',
            strokeDashArray: [4, 4],
            strokeWidth: 1,
            selectable: false,
            evented: false,
            data: { type: 'grid' }
          });
          canvas.add(gutterLine);
        }
      }
    }
    
    canvas.renderAll();
  };
  
  // Add object to canvas
  const addShape = (type: string) => {
    if (!fabricCanvas) return;
    
    let shape: fabric.Object;
    
    if (type === 'rectangle') {
      shape = new fabric.Rect({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
        fill: '#3B82F6',
        stroke: null,
        strokeWidth: 0,
        rx: 0,
        ry: 0
      });
    } else if (type === 'circle') {
      shape = new fabric.Circle({
        left: 50,
        top: 50,
        radius: 50,
        fill: '#10B981',
        stroke: null
      });
    } else if (type === 'triangle') {
      shape = new fabric.Triangle({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
        fill: '#F59E0B',
        stroke: null
      });
    } else if (type === 'text') {
      shape = new fabric.Textbox('Edit this text', {
        left: 50,
        top: 50,
        width: 200,
        fontSize: 20,
        fontFamily: 'Arial',
        fill: '#1F2937'
      });
    } else {
      // Default to rectangle if unknown type
      shape = new fabric.Rect({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
        fill: '#3B82F6'
      });
    }
    
    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    
    // Snap to grid if enabled
    if (canvasConfig.snapToGrid) {
      snapObjectToGrid(shape);
    }
    
    fabricCanvas.renderAll();
    addToHistory();
    
    if (onCanvasChanged) {
      onCanvasChanged(fabricCanvas);
    }
  };
  
  // Snap an object to the grid
  const snapObjectToGrid = (object: fabric.Object) => {
    if (!canvasConfig.snapToGrid || !object) return;
    
    const gridSize = canvasConfig.gridSize;
    
    // Snap to grid
    object.set({
      left: Math.round(object.left! / gridSize) * gridSize,
      top: Math.round(object.top! / gridSize) * gridSize
    });
    
    if (object.width) {
      object.set({
        width: Math.round(object.width / gridSize) * gridSize
      });
    }
    
    if (object.height) {
      object.set({
        height: Math.round(object.height / gridSize) * gridSize
      });
    }
  };
  
  // Toggle grid visibility
  const toggleGrid = () => {
    const newShowGrid = !canvasConfig.showGrid;
    
    setCanvasConfig({
      ...canvasConfig,
      showGrid: newShowGrid
    });
    
    if (fabricCanvas) {
      drawGrid(fabricCanvas);
    }
    
    toast({
      title: newShowGrid ? "Grid Visible" : "Grid Hidden",
      description: newShowGrid ? "Showing grid for better alignment" : "Grid is now hidden"
    });
  };
  
  // Toggle snap to grid
  const toggleSnapToGrid = () => {
    const newSnapToGrid = !canvasConfig.snapToGrid;
    
    setCanvasConfig({
      ...canvasConfig,
      snapToGrid: newSnapToGrid
    });
    
    toast({
      title: newSnapToGrid ? "Snap to Grid Enabled" : "Snap to Grid Disabled",
      description: newSnapToGrid ? "Objects will snap to grid" : "Objects can be placed freely"
    });
  };
  
  // Zoom in
  const zoomIn = () => {
    if (!fabricCanvas) return;
    
    const newZoom = Math.min(5, canvasConfig.zoom + 0.1);
    fabricCanvas.setZoom(newZoom);
    
    setCanvasConfig({
      ...canvasConfig,
      zoom: newZoom
    });
  };
  
  // Zoom out
  const zoomOut = () => {
    if (!fabricCanvas) return;
    
    const newZoom = Math.max(0.1, canvasConfig.zoom - 0.1);
    fabricCanvas.setZoom(newZoom);
    
    setCanvasConfig({
      ...canvasConfig,
      zoom: newZoom
    });
  };
  
  // Reset zoom
  const resetZoom = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.setZoom(1);
    fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    
    setCanvasConfig({
      ...canvasConfig,
      zoom: 1,
      panOffset: { x: 0, y: 0 }
    });
  };
  
  // Delete selected object
  const deleteObject = () => {
    if (!fabricCanvas) return;
    
    const activeObjects = fabricCanvas.getActiveObjects();
    
    if (activeObjects.length > 0) {
      fabricCanvas.remove(...activeObjects);
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      setSelectedObject(null);
      
      addToHistory();
      
      if (onCanvasChanged) {
        onCanvasChanged(fabricCanvas);
      }
      
      toast({
        title: activeObjects.length === 1 ? "Object Deleted" : "Objects Deleted",
        description: `Deleted ${activeObjects.length} element${activeObjects.length !== 1 ? 's' : ''}`
      });
    }
  };
  
  // Duplicate selected object
  const duplicateObject = () => {
    if (!fabricCanvas || !selectedObject) return;
    
    fabricCanvas.getActiveObject().clone((cloned: fabric.Object) => {
      fabricCanvas.discardActiveObject();
      
      cloned.set({
        left: cloned.left! + 20,
        top: cloned.top! + 20,
        evented: true
      });
      
      if (cloned.type === 'activeSelection') {
        // @ts-ignore
        cloned.canvas = fabricCanvas;
        // @ts-ignore
        cloned.forEachObject((obj: fabric.Object) => {
          fabricCanvas.add(obj);
        });
        
        cloned.setCoords();
      } else {
        fabricCanvas.add(cloned);
      }
      
      fabricCanvas.setActiveObject(cloned);
      fabricCanvas.renderAll();
      
      addToHistory();
      
      if (onCanvasChanged) {
        onCanvasChanged(fabricCanvas);
      }
      
      toast({
        title: "Object Duplicated",
        description: "Created a copy of the selected object"
      });
    });
  };
  
  // Add to history stack
  const addToHistory = () => {
    if (!fabricCanvas) return;
    
    const json = JSON.stringify(fabricCanvas.toJSON());
    
    // If we're not at the end of history, remove everything after current position
    if (historyPosition < history.length - 1) {
      const newHistory = history.slice(0, historyPosition + 1);
      setHistory([...newHistory, json]);
      setHistoryPosition(historyPosition + 1);
    } else {
      setHistory([...history, json]);
      setHistoryPosition(historyPosition + 1);
    }
    
    setCanUndo(true);
    setCanRedo(false);
  };
  
  // Undo last action
  const undo = () => {
    if (!fabricCanvas || historyPosition <= 0) return;
    
    const newPosition = historyPosition - 1;
    const json = JSON.parse(history[newPosition]);
    
    fabricCanvas.loadFromJSON(json, () => {
      fabricCanvas.renderAll();
      
      setHistoryPosition(newPosition);
      setCanUndo(newPosition > 0);
      setCanRedo(true);
      
      if (onCanvasChanged) {
        onCanvasChanged(fabricCanvas);
      }
    });
  };
  
  // Redo previously undone action
  const redo = () => {
    if (!fabricCanvas || historyPosition >= history.length - 1) return;
    
    const newPosition = historyPosition + 1;
    const json = JSON.parse(history[newPosition]);
    
    fabricCanvas.loadFromJSON(json, () => {
      fabricCanvas.renderAll();
      
      setHistoryPosition(newPosition);
      setCanUndo(true);
      setCanRedo(newPosition < history.length - 1);
      
      if (onCanvasChanged) {
        onCanvasChanged(fabricCanvas);
      }
    });
  };
  
  // Export canvas as JSON
  const exportCanvas = () => {
    if (!fabricCanvas) return;
    
    const json = JSON.stringify(fabricCanvas.toJSON());
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas-design.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Design Exported",
      description: "Your design has been downloaded as a JSON file"
    });
  };
  
  return (
    <div className="fabric-design-canvas space-y-4">
      <div className="canvas-toolbar flex flex-wrap gap-2 mb-4">
        <Button onClick={() => addShape('rectangle')} variant="outline" size="sm">Rectangle</Button>
        <Button onClick={() => addShape('circle')} variant="outline" size="sm">Circle</Button>
        <Button onClick={() => addShape('triangle')} variant="outline" size="sm">Triangle</Button>
        <Button onClick={() => addShape('text')} variant="outline" size="sm">Text</Button>
        
        <div className="grow"></div>
        
        <Button onClick={toggleGrid} variant="ghost" size="icon" className={cn(canvasConfig.showGrid && "bg-accent")}>
          <Grid size={18} />
        </Button>
        <Button onClick={toggleSnapToGrid} variant="ghost" size="icon" className={cn(canvasConfig.snapToGrid && "bg-accent")}>
          <Magnet size={18} />
        </Button>
        <Button onClick={zoomIn} variant="ghost" size="icon">
          <ZoomIn size={18} />
        </Button>
        <Button onClick={zoomOut} variant="ghost" size="icon">
          <ZoomOut size={18} />
        </Button>
        <Button onClick={resetZoom} variant="ghost" size="icon">
          <RotateCcw size={18} />
        </Button>
        <Button onClick={deleteObject} variant="ghost" size="icon" disabled={!selectedObject}>
          <Trash2 size={18} />
        </Button>
        <Button onClick={duplicateObject} variant="ghost" size="icon" disabled={!selectedObject}>
          <Copy size={18} />
        </Button>
        <Button onClick={undo} variant="ghost" size="icon" disabled={!canUndo}>
          <Undo size={18} />
        </Button>
        <Button onClick={redo} variant="ghost" size="icon" disabled={!canRedo}>
          <Redo size={18} />
        </Button>
        <Button onClick={exportCanvas} variant="ghost" size="icon">
          <DownloadCloud size={18} />
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className={cn(
          "canvas-container border rounded-lg overflow-hidden shadow-sm",
          className
        )}>
          <canvas ref={canvasRef} />
        </div>
        
        {selectedObject && (
          <PropertyPanel 
            selectedObject={selectedObject} 
            fabricCanvas={fabricCanvas} 
          />
        )}
      </div>
    </div>
  );
};

export default FabricDesignCanvas;
