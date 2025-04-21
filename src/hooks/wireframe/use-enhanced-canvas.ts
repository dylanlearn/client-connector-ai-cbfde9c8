
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GridOptions {
  visible: boolean;
  size: number;
  color: string;
  snapToGrid: boolean;
}

interface CanvasOptions {
  width: number;
  height: number;
  backgroundColor: string;
  id?: string;
}

export function useEnhancedCanvas() {
  const { toast } = useToast();
  const [canvas, setCanvas] = useState<any | null>(null);
  const [gridOptions, setGridOptions] = useState<GridOptions>({
    visible: true,
    size: 10,
    color: 'rgba(0,0,0,0.1)',
    snapToGrid: true,
  });
  const [canvasOptions, setCanvasOptions] = useState<CanvasOptions>({
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  // Initialize canvas
  const initializeCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    if (!canvasElement) {
      console.error('Canvas element not found');
      return;
    }
    
    // In a real implementation, this would create a canvas instance
    // For now, we'll just mock it
    const mockCanvas = {
      width: canvasOptions.width,
      height: canvasOptions.height,
      element: canvasElement,
      objects: [],
      addObject: (obj: any) => {
        mockCanvas.objects.push(obj);
      },
      removeObject: (obj: any) => {
        mockCanvas.objects = mockCanvas.objects.filter(o => o !== obj);
      },
      render: () => {
        console.log('Canvas rendered');
      },
      setZoom: (z: number) => {
        console.log(`Zoom set to ${z}`);
      },
      setGridOptions: (opts: GridOptions) => {
        console.log('Grid options updated', opts);
      }
    };
    
    setCanvas(mockCanvas);
    
    toast({
      title: 'Canvas Initialized',
      description: `Canvas dimensions: ${canvasOptions.width}×${canvasOptions.height}`,
    });
    
    return mockCanvas;
  }, [canvasOptions, toast]);
  
  // Update grid options
  const updateGridOptions = useCallback((options: Partial<GridOptions>) => {
    setGridOptions(prev => {
      const updated = { ...prev, ...options };
      
      if (canvas) {
        // This would be a real integration with the canvas grid system
        canvas.setGridOptions(updated);
      }
      
      return updated;
    });
  }, [canvas]);
  
  // Toggle grid visibility
  const toggleGrid = useCallback(() => {
    updateGridOptions({ visible: !gridOptions.visible });
    
    toast({
      title: gridOptions.visible ? 'Grid Hidden' : 'Grid Shown',
      description: gridOptions.visible 
        ? 'Grid is now hidden from view' 
        : 'Grid is now visible on the canvas',
    });
  }, [gridOptions.visible, updateGridOptions, toast]);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    updateGridOptions({ snapToGrid: !gridOptions.snapToGrid });
    
    toast({
      title: gridOptions.snapToGrid ? 'Snap to Grid Disabled' : 'Snap to Grid Enabled',
      description: gridOptions.snapToGrid 
        ? 'Objects will move freely on the canvas' 
        : 'Objects will snap to the grid points',
    });
  }, [gridOptions.snapToGrid, updateGridOptions, toast]);
  
  // Set grid size
  const setGridSize = useCallback((size: number) => {
    updateGridOptions({ size });
  }, [updateGridOptions]);
  
  // Update canvas options
  const updateCanvasOptions = useCallback((options: Partial<CanvasOptions>) => {
    setCanvasOptions(prev => ({ ...prev, ...options }));
    
    if (canvas) {
      // Update canvas dimensions, etc.
      if (options.width) canvas.width = options.width;
      if (options.height) canvas.height = options.height;
      if (options.backgroundColor) canvas.backgroundColor = options.backgroundColor;
      canvas.render();
    }
  }, [canvas]);
  
  return {
    canvas,
    gridOptions,
    canvasOptions,
    isDragging,
    isZooming,
    zoom,
    initializeCanvas,
    updateGridOptions,
    toggleGrid,
    toggleSnapToGrid,
    setGridSize,
    updateCanvasOptions,
    setIsDragging,
    setIsZooming,
    setZoom,
  };
}
