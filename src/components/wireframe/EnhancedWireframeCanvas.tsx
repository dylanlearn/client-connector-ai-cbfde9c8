
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedSelection } from '@/hooks/wireframe/use-enhanced-selection';
import { useKeyboardShortcuts } from '@/hooks/wireframe/use-keyboard-shortcuts';
import { GuideHandler } from '@/components/wireframe/preview/alignment-guides';
import EnhancedTransformControls from './controls/EnhancedTransformControls';
import MultiViewportCanvas from './navigation/MultiViewportCanvas';
import CanvasMinimap from './navigation/CanvasMinimap';

export interface EnhancedWireframeCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  initialConfig?: {
    showGrid?: boolean;
    snapToGrid?: boolean;
    showGuides?: boolean;
    gridSize?: number;
    backgroundColor?: string;
  };
  viewportConfig?: {
    showControls?: boolean;
    showMinimap?: boolean;
    allowMultiViewport?: boolean;
    persistViewportState?: boolean;
  };
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onObjectSelected?: (object: fabric.Object | null) => void;
  onObjectsModified?: (objects: fabric.Object[]) => void;
}

const EnhancedWireframeCanvas: React.FC<EnhancedWireframeCanvasProps> = ({
  width = 1200,
  height = 800,
  className,
  initialConfig = {
    showGrid: true,
    snapToGrid: true,
    showGuides: true,
    gridSize: 20,
    backgroundColor: '#ffffff'
  },
  viewportConfig = {
    showControls: true,
    showMinimap: true,
    allowMultiViewport: true,
    persistViewportState: true
  },
  onCanvasReady,
  onObjectSelected,
  onObjectsModified
}) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(initialConfig.showGrid ?? true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(initialConfig.snapToGrid ?? true);
  const [gridSize, setGridSize] = useState<number>(initialConfig.gridSize ?? 20);
  const guideHandlerRef = useRef<any>(null);

  // Initialize enhanced selection
  const {
    selectedObject,
    selectedObjects,
    selectObjectById,
    selectMultipleObjectsById,
    clearSelection
  } = useEnhancedSelection({
    canvas,
    maxHistorySize: 30,
    selectionPriority: 'front-to-back',
    persistSelection: true
  });

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: initialConfig.backgroundColor ?? '#ffffff',
      selection: true,
      preserveObjectStacking: true
    });

    setCanvas(fabricCanvas);
    
    if (onCanvasReady) {
      onCanvasReady(fabricCanvas);
    }

    // Initialize grid if enabled
    if (initialConfig.showGrid) {
      createGrid(fabricCanvas, initialConfig.gridSize ?? 20);
    }

    // Initialize alignment guides if enabled
    if (initialConfig.showGuides) {
      guideHandlerRef.current = new GuideHandler(fabricCanvas, {
        guideColor: '#2563eb',
        snapDistance: 8,
        showDistanceIndicators: true,
        showCenterGuides: true
      });
    }

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Create grid function
  const createGrid = useCallback((canvas: fabric.Canvas, size: number = 20) => {
    // Remove existing grid
    const existingGridLines = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
    existingGridLines.forEach(line => canvas.remove(line));

    // Create new grid
    const canvasWidth = canvas.width ?? width;
    const canvasHeight = canvas.height ?? height;

    // Create horizontal lines
    for (let i = 0; i <= canvasHeight; i += size) {
      const line = new fabric.Line([0, i, canvasWidth, i], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        data: { type: 'grid' }
      });
      canvas.add(line);
      canvas.sendToBack(line);
    }

    // Create vertical lines
    for (let i = 0; i <= canvasWidth; i += size) {
      const line = new fabric.Line([i, 0, i, canvasHeight], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        data: { type: 'grid' }
      });
      canvas.add(line);
      canvas.sendToBack(line);
    }

    canvas.renderAll();
  }, [width, height]);

  // Toggle grid visibility
  const handleToggleGrid = useCallback(() => {
    if (!canvas) return;

    const newShowGrid = !showGrid;
    setShowGrid(newShowGrid);

    const gridLines = canvas.getObjects().filter(obj => obj.data?.type === 'grid');

    if (newShowGrid) {
      // Show grid
      createGrid(canvas, gridSize);
    } else {
      // Hide grid
      gridLines.forEach(line => canvas.remove(line));
    }

    canvas.renderAll();

    toast({
      title: newShowGrid ? "Grid Shown" : "Grid Hidden",
      description: newShowGrid
        ? "The grid is now visible."
        : "The grid has been hidden."
    });
  }, [canvas, showGrid, gridSize, createGrid, toast]);

  // Toggle snap to grid
  const handleToggleSnapToGrid = useCallback(() => {
    if (!canvas) return;

    const newSnapToGrid = !snapToGrid;
    setSnapToGrid(newSnapToGrid);

    toast({
      title: newSnapToGrid ? "Snap to Grid Enabled" : "Snap to Grid Disabled",
      description: newSnapToGrid
        ? "Objects will snap to grid points."
        : "Objects will move freely."
    });
  }, [canvas, snapToGrid, toast]);

  // Update grid size
  useEffect(() => {
    if (canvas && showGrid) {
      createGrid(canvas, gridSize);
    }
  }, [canvas, gridSize, showGrid, createGrid]);

  // Apply snap to grid behavior
  useEffect(() => {
    if (!canvas) return;

    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!snapToGrid || !e.target) return;

      const target = e.target;
      const x = Math.round((target.left ?? 0) / gridSize) * gridSize;
      const y = Math.round((target.top ?? 0) / gridSize) * gridSize;

      target.set({
        left: x,
        top: y
      });
    };

    if (snapToGrid) {
      canvas.on('object:moving', handleObjectMoving);
    }

    return () => {
      canvas.off('object:moving', handleObjectMoving);
    };
  }, [canvas, snapToGrid, gridSize]);

  // Set up keyboard shortcuts
  const { showShortcutsToast } = useKeyboardShortcuts({
    canvas,
    enabled: true,
    skipOnInput: true,
    onDuplicate: () => {
      if (!canvas || !selectedObject) return;
      
      selectedObject.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (selectedObject.left || 0) + 20,
          top: (selectedObject.top || 0) + 20
        });
        
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
      });
    },
    onDelete: () => {
      if (!canvas || !selectedObject) return;
      
      if (selectedObject.type === 'activeSelection') {
        const selection = selectedObject as fabric.ActiveSelection;
        selection.getObjects().forEach(obj => canvas.remove(obj));
        canvas.discardActiveObject();
      } else {
        canvas.remove(selectedObject);
      }
      
      canvas.requestRenderAll();
    },
    onGroup: () => {
      if (!canvas || !selectedObject || selectedObject.type !== 'activeSelection') return;
      
      const group = (selectedObject as fabric.ActiveSelection).toGroup();
      canvas.requestRenderAll();
    },
    onUngroup: () => {
      if (!canvas || !selectedObject || selectedObject.type !== 'group') return;
      
      const objects = (selectedObject as fabric.Group).toActiveSelection();
      canvas.requestRenderAll();
    },
    onBringForward: () => {
      if (!canvas || !selectedObject) return;
      canvas.bringForward(selectedObject);
      canvas.requestRenderAll();
    },
    onSendBackward: () => {
      if (!canvas || !selectedObject) return;
      canvas.sendBackwards(selectedObject);
      canvas.requestRenderAll();
    },
    onToggleGrid: handleToggleGrid,
    onZoomIn: () => {
      // This will be handled by the MultiViewportCanvas
    },
    onZoomOut: () => {
      // This will be handled by the MultiViewportCanvas
    }
  });

  // Call onObjectSelected when selection changes
  useEffect(() => {
    if (onObjectSelected) {
      onObjectSelected(selectedObject);
    }
  }, [selectedObject, onObjectSelected]);

  // Call onObjectsModified when objects are modified
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectModified = (e: fabric.IEvent) => {
      if (onObjectsModified && e.target) {
        onObjectsModified([e.target]);
      }
    };
    
    canvas.on('object:modified', handleObjectModified);
    
    return () => {
      canvas.off('object:modified', handleObjectModified);
    };
  }, [canvas, onObjectsModified]);

  // Show keyboard shortcuts helper
  const handleShowKeyboardShortcuts = useCallback(() => {
    showShortcutsToast();
  }, [showShortcutsToast]);

  return (
    <div className={cn("enhanced-wireframe-canvas relative flex flex-col", className)}>
      <MultiViewportCanvas
        canvas={canvas}
        viewportConfig={viewportConfig}
        className="flex-1"
      >
        <canvas ref={canvasRef} width={width} height={height} />
        
        {selectedObject && (
          <EnhancedTransformControls
            canvas={canvas!}
            activeObject={selectedObject}
            showRotationControl={true}
            showScaleControls={true}
            showFlipControls={true}
          />
        )}
      </MultiViewportCanvas>
      
      <button
        onClick={handleShowKeyboardShortcuts}
        className="absolute bottom-4 left-4 z-20 p-2 rounded-full bg-background/80 hover:bg-background backdrop-blur-sm shadow-sm text-xs"
        title="Show Keyboard Shortcuts"
      >
        ?
      </button>
    </div>
  );
};

export default EnhancedWireframeCanvas;
