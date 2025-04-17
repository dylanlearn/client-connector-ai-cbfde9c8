
import { useState, useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import {
  GridConfiguration,
  DEFAULT_GRID_CONFIG,
  removeGridFromCanvas
} from '@/components/wireframe/utils/grid-system';
import { useGridManagement } from './use-grid-management';
import { useLayerManagement } from './use-layer-management';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  
  // Use our custom hooks
  const { gridConfig, toggleGridVisibility, toggleSnapToGrid, 
          setGridSize, setGridType, updateColumnSettings, 
          updateGridConfig } = useGridManagement(canvas, width, height, initialGridConfig);
          
  const { layers, selectedObjects } = useLayerManagement(canvas);
  
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
    
    // Initial grid will be handled by the useGridManagement hook after canvas is set
    
    return fabricCanvas;
  }, [width, height]);
  
  // Update canvas dimensions
  const updateCanvasDimensions = useCallback((newWidth: number, newHeight: number) => {
    if (!canvas) return;
    
    canvas.setDimensions({ width: newWidth, height: newHeight });
    updateGridConfig({ ...gridConfig }); // Force grid update with current config
    
    canvas.renderAll();
  }, [canvas, gridConfig, updateGridConfig]);
  
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
