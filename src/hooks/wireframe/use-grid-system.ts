
import { useCallback, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { 
  DEFAULT_GRID_CONFIG, 
  GridConfig,
  GridBreakpoint,
  createCanvasGrid,
  removeGridFromCanvas,
  updateCanvasGrid,
  getBreakpointFromWidth
} from '@/utils/monitoring/grid-utils';

export interface UseGridSystemOptions {
  canvas: fabric.Canvas | null;
  width: number;
  height: number;
  initialConfig?: Partial<GridConfig>;
}

export function useGridSystem({
  canvas,
  width,
  height,
  initialConfig = {}
}: UseGridSystemOptions) {
  // Initialize grid config with defaults and any overrides
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    ...DEFAULT_GRID_CONFIG,
    ...initialConfig
  });

  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    setGridConfig(prev => ({
      ...prev,
      visible: !prev.visible
    }));
  }, []);

  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setGridConfig(prev => ({
      ...prev,
      snapToGrid: !prev.snapToGrid
    }));
  }, []);

  // Set grid size
  const setGridSize = useCallback((size: number) => {
    setGridConfig(prev => ({
      ...prev,
      size
    }));
  }, []);

  // Set grid type
  const setGridType = useCallback((type: 'lines' | 'dots' | 'columns') => {
    setGridConfig(prev => ({
      ...prev,
      type
    }));
  }, []);

  // Set grid color
  const setGridColor = useCallback((color: string) => {
    setGridConfig(prev => ({
      ...prev,
      color
    }));
  }, []);

  // Update the entire grid config
  const updateGridConfig = useCallback((newConfig: Partial<GridConfig>) => {
    setGridConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  }, []);

  // Render grid when config changes
  useEffect(() => {
    if (!canvas) return;

    // Clear existing grid
    removeGridFromCanvas(canvas);

    // Create new grid if visible
    if (gridConfig.visible) {
      const result = createCanvasGrid(canvas, gridConfig.size, gridConfig.type);
      
      result.gridLines.forEach(line => {
        if (gridConfig.color) {
          line.set('stroke', gridConfig.color);
        }
        canvas.add(line);
        canvas.sendToBack(line);
      });

      canvas.renderAll();
    }
  }, [canvas, gridConfig.visible, gridConfig.size, gridConfig.type, gridConfig.color]);

  // Set up snap to grid
  useEffect(() => {
    if (!canvas) return;

    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!gridConfig.snapToGrid || !e.target) return;

      const target = e.target;
      const gridSize = gridConfig.size;

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
    };

    if (gridConfig.snapToGrid) {
      canvas.on('object:moving', handleObjectMoving);
    } else {
      canvas.off('object:moving', handleObjectMoving);
    }

    return () => {
      canvas.off('object:moving', handleObjectMoving);
    };
  }, [canvas, gridConfig.snapToGrid, gridConfig.size]);

  // Update grid when canvas dimensions change
  useEffect(() => {
    if (!canvas) return;

    // Update grid positions for new dimensions
    removeGridFromCanvas(canvas);
    
    // Create new grid if visible
    if (gridConfig.visible) {
      const result = createCanvasGrid(canvas, gridConfig.size, gridConfig.type);
      
      result.gridLines.forEach(line => {
        if (gridConfig.color) {
          line.set('stroke', gridConfig.color);
        }
        canvas.add(line);
        canvas.sendToBack(line);
      });

      canvas.renderAll();
    }
  }, [canvas, width, height, gridConfig.visible, gridConfig.size, gridConfig.type, gridConfig.color]);

  return {
    gridConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    setGridColor,
    updateGridConfig
  };
}
