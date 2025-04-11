
import { useState, useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import {
  GridConfiguration,
  DEFAULT_GRID_CONFIG,
  updateGridOnCanvas,
  removeGridFromCanvas
} from '@/components/wireframe/utils/grid-system';
import {
  convertCanvasObjectsToLayers,
  LayerItem
} from '@/components/wireframe/utils/layer-utils';
import { useToast } from '@/hooks/use-toast';

interface UseWireframeEditorOptions {
  canvasId?: string;
  width?: number;
  height?: number;
  initialGridConfig?: Partial<GridConfiguration>;
}

export function useWireframeEditor({
  canvasId = 'wireframe-canvas',
  width = 1200,
  height = 800,
  initialGridConfig = {}
}: UseWireframeEditorOptions = {}) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [layers, setLayers] = useState<LayerItem[]>([]);
  
  // Grid configuration
  const [gridConfig, setGridConfig] = useState<GridConfiguration>({
    ...DEFAULT_GRID_CONFIG,
    ...initialGridConfig
  });
  
  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return null;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true
    });
    
    setCanvas(fabricCanvas);
    setIsInitializing(false);
    
    // Add initial grid
    updateGridOnCanvas(fabricCanvas, gridConfig, width, height);
    
    return fabricCanvas;
  }, [width, height, gridConfig]);
  
  // Update canvas dimensions
  const updateCanvasDimensions = useCallback((newWidth: number, newHeight: number) => {
    if (!canvas) return;
    
    canvas.setDimensions({ width: newWidth, height: newHeight });
    updateGridOnCanvas(canvas, gridConfig, newWidth, height);
    
    canvas.renderAll();
  }, [canvas, gridConfig, height]);
  
  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    setGridConfig(prev => {
      const updated = { ...prev, visible: !prev.visible };
      
      if (canvas) {
        updateGridOnCanvas(canvas, updated, width, height);
      }
      
      toast({
        title: updated.visible ? 'Grid Enabled' : 'Grid Disabled',
        description: updated.visible 
          ? 'Grid is now visible.' 
          : 'Grid is now hidden.'
      });
      
      return updated;
    });
  }, [canvas, width, height, toast]);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setGridConfig(prev => {
      const updated = { ...prev, snapToGrid: !prev.snapToGrid };
      
      toast({
        title: updated.snapToGrid ? 'Snap to Grid Enabled' : 'Snap to Grid Disabled',
        description: updated.snapToGrid 
          ? 'Elements will snap to grid points.' 
          : 'Elements can be placed freely.'
      });
      
      return updated;
    });
  }, [toast]);
  
  // Set grid size
  const setGridSize = useCallback((size: number) => {
    setGridConfig(prev => {
      const updated = { ...prev, size };
      
      if (canvas) {
        updateGridOnCanvas(canvas, updated, width, height);
      }
      
      toast({
        title: 'Grid Size Updated',
        description: `Grid size set to ${size}px.`
      });
      
      return updated;
    });
  }, [canvas, width, height, toast]);
  
  // Set grid type
  const setGridType = useCallback((type: 'lines' | 'dots' | 'columns') => {
    setGridConfig(prev => {
      const updated = { ...prev, type };
      
      if (canvas) {
        updateGridOnCanvas(canvas, updated, width, height);
      }
      
      toast({
        title: 'Grid Type Changed',
        description: `Grid type set to ${type}.`
      });
      
      return updated;
    });
  }, [canvas, width, height, toast]);
  
  // Update column settings
  const updateColumnSettings = useCallback((columns: number, gutterWidth: number, marginWidth: number) => {
    setGridConfig(prev => {
      const updated = { ...prev, columns, gutterWidth, marginWidth };
      
      if (canvas) {
        updateGridOnCanvas(canvas, updated, width, height);
      }
      
      toast({
        title: 'Column Settings Updated',
        description: `Grid now has ${columns} columns.`
      });
      
      return updated;
    });
  }, [canvas, width, height, toast]);
  
  // Update grid configuration
  const updateGridConfig = useCallback((config: Partial<GridConfiguration>) => {
    setGridConfig(prev => {
      const updated = { ...prev, ...config };
      
      if (canvas) {
        updateGridOnCanvas(canvas, updated, width, height);
      }
      
      return updated;
    });
  }, [canvas, width, height]);
  
  // Update layers when canvas changes
  useEffect(() => {
    if (!canvas) return;
    
    const updateLayersList = () => {
      const selectedIds = canvas.getActiveObjects().map(obj => obj.data?.id || obj.id || String(obj.zIndex));
      const layerItems = convertCanvasObjectsToLayers(canvas, selectedIds);
      setLayers(layerItems);
      setSelectedObjects(canvas.getActiveObjects());
    };
    
    // Initial update
    updateLayersList();
    
    // Setup event listeners
    canvas.on('object:added', updateLayersList);
    canvas.on('object:removed', updateLayersList);
    canvas.on('object:modified', updateLayersList);
    canvas.on('selection:created', updateLayersList);
    canvas.on('selection:updated', updateLayersList);
    canvas.on('selection:cleared', updateLayersList);
    
    return () => {
      // Cleanup event listeners
      canvas.off('object:added', updateLayersList);
      canvas.off('object:removed', updateLayersList);
      canvas.off('object:modified', updateLayersList);
      canvas.off('selection:created', updateLayersList);
      canvas.off('selection:updated', updateLayersList);
      canvas.off('selection:cleared', updateLayersList);
    };
  }, [canvas]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (canvas) {
        removeGridFromCanvas(canvas);
        canvas.dispose();
      }
    };
  }, [canvas]);

  return {
    canvasRef,
    canvas,
    initializeCanvas,
    isInitializing,
    selectedObjects,
    layers,
    gridConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    updateColumnSettings,
    updateGridConfig,
    updateCanvasDimensions
  };
}
