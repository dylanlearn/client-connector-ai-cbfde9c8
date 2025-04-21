
import { useRef, useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/components/ui/use-toast';
import { createCanvasGrid } from '@/utils/monitoring/grid-utils';

interface CanvasOptions {
  width: number;
  height: number;
  backgroundColor: string;
  showRulers: boolean;
}

interface GridOptions {
  visible: boolean;
  size: number;
  type: 'lines' | 'dots' | 'columns';
  color: string;
  opacity: number;
}

interface UseEnhancedCanvasEngineOptions {
  canvasOptions?: Partial<CanvasOptions>;
  gridOptions?: Partial<GridOptions>;
}

export function useEnhancedCanvasEngine(options: UseEnhancedCanvasEngineOptions = {}) {
  const { toast } = useToast();
  
  // Default options merged with provided options
  const canvasOptions: CanvasOptions = {
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff',
    showRulers: true,
    ...options.canvasOptions
  };
  
  const gridOptions: GridOptions = {
    visible: true,
    size: 20,
    type: 'lines',
    color: '#e0e0e0',
    opacity: 0.4,
    ...options.gridOptions
  };
  
  // Canvas state
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [gridVisible, setGridVisible] = useState(gridOptions.visible);
  
  // Init canvas
  const initializeCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    // Create new Fabric.js canvas
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      width: canvasOptions.width,
      height: canvasOptions.height,
      backgroundColor: canvasOptions.backgroundColor,
      selection: true
    });
    
    // Set up event listeners
    fabricCanvas.on('mouse:down', () => {
      if (fabricCanvas.isDrawingMode) {
        setIsDragging(true);
      }
    });
    
    fabricCanvas.on('mouse:up', () => {
      setIsDragging(false);
    });
    
    fabricCanvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let newZoom = zoom;
      
      if (delta > 0) {
        newZoom = Math.max(0.1, zoom - 0.1);
      } else {
        newZoom = Math.min(5, zoom + 0.1);
      }
      
      setZoom(newZoom);
      setIsZooming(true);
      
      // Apply zoom
      fabricCanvas.zoomToPoint(
        new fabric.Point(opt.e.offsetX, opt.e.offsetY),
        newZoom
      );
      
      opt.e.preventDefault();
      opt.e.stopPropagation();
      
      setTimeout(() => {
        setIsZooming(false);
      }, 300);
    });
    
    // Create initial grid
    if (gridOptions.visible) {
      const gridResult = createCanvasGrid(fabricCanvas, gridOptions.size, gridOptions.type);
      gridResult.gridLines.forEach(line => {
        fabricCanvas.add(line);
        fabricCanvas.sendToBack(line);
      });
    }
    
    setCanvas(fabricCanvas);
    return fabricCanvas;
  }, [canvasOptions.backgroundColor, canvasOptions.height, canvasOptions.width, gridOptions.size, gridOptions.type, gridOptions.visible, zoom]);
  
  // Canvas navigation
  const pan = useCallback((deltaX: number, deltaY: number) => {
    if (!canvas) return;
    
    const vpPoint = new fabric.Point(deltaX, deltaY);
    canvas.relativePan(vpPoint);
  }, [canvas]);
  
  // Zoom controls
  const zoomIn = useCallback(() => {
    if (!canvas) return;
    
    const newZoom = Math.min(5, zoom + 0.1);
    setZoom(newZoom);
    
    const center = new fabric.Point(
      canvas.getWidth() / 2, 
      canvas.getHeight() / 2
    );
    
    canvas.zoomToPoint(center, newZoom);
    
    toast({
      title: "Zoom Updated",
      description: `Zoomed in to ${Math.round(newZoom * 100)}%`
    });
  }, [canvas, zoom, toast]);
  
  const zoomOut = useCallback(() => {
    if (!canvas) return;
    
    const newZoom = Math.max(0.1, zoom - 0.1);
    setZoom(newZoom);
    
    const center = new fabric.Point(
      canvas.getWidth() / 2, 
      canvas.getHeight() / 2
    );
    
    canvas.zoomToPoint(center, newZoom);
    
    toast({
      title: "Zoom Updated",
      description: `Zoomed out to ${Math.round(newZoom * 100)}%`
    });
  }, [canvas, zoom, toast]);
  
  const resetZoom = useCallback(() => {
    if (!canvas) return;
    
    setZoom(1);
    
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.renderAll();
    
    toast({
      title: "View Reset",
      description: "View reset to 100%"
    });
  }, [canvas, toast]);
  
  // Grid controls
  const toggleGridVisibility = useCallback(() => {
    if (!canvas) return;
    
    const newVisibility = !gridVisible;
    setGridVisible(newVisibility);
    
    if (newVisibility) {
      // Show grid
      const gridResult = createCanvasGrid(canvas, gridOptions.size, gridOptions.type);
      gridResult.gridLines.forEach(line => {
        canvas.add(line);
        canvas.sendToBack(line);
      });
    } else {
      // Hide grid - remove all grid lines
      const gridLines = canvas.getObjects().filter(obj => 
        obj.data && obj.data.isGridLine
      );
      
      gridLines.forEach(line => {
        canvas.remove(line);
      });
    }
    
    canvas.renderAll();
    
    toast({
      title: "Grid Visibility",
      description: newVisibility ? "Grid shown" : "Grid hidden"
    });
  }, [canvas, gridOptions.size, gridOptions.type, gridVisible, toast]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvas]);
  
  return {
    canvas,
    isDragging,
    isZooming,
    zoom,
    gridVisible,
    initializeCanvas,
    pan,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    toggleGridVisibility
  };
}
