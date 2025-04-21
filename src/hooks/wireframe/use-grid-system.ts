
import { useCallback, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { 
  GridConfig, 
  DEFAULT_GRID_CONFIG,
  createCanvasGrid,
  removeGridFromCanvas,
  updateCanvasGrid
} from '@/utils/monitoring/grid-utils';

interface UseGridSystemOptions {
  initialConfig?: Partial<GridConfig>;
  canvas: fabric.Canvas | null;
}

export function useGridSystem({ initialConfig = {}, canvas }: UseGridSystemOptions) {
  // Initialize grid config with defaults and any provided overrides
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    ...DEFAULT_GRID_CONFIG,
    ...initialConfig
  });
  
  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    setGridConfig(prev => {
      const newVisibility = !prev.visible;
      
      if (canvas) {
        if (newVisibility) {
          // Show grid
          const gridResult = createCanvasGrid(canvas, prev.size, prev.type);
          gridResult.gridLines.forEach(line => {
            canvas.add(line);
            canvas.sendToBack(line);
          });
        } else {
          // Hide grid
          removeGridFromCanvas(canvas);
        }
        canvas.renderAll();
      }
      
      return { ...prev, visible: newVisibility };
    });
  }, [canvas]);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setGridConfig(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  }, []);
  
  // Set grid size
  const setGridSize = useCallback((size: number) => {
    setGridConfig(prev => {
      if (canvas && prev.visible) {
        const gridResult = updateCanvasGrid(canvas, size, prev.type);
        canvas.renderAll();
      }
      return { ...prev, size };
    });
  }, [canvas]);
  
  // Set grid type
  const setGridType = useCallback((type: 'lines' | 'dots' | 'columns') => {
    setGridConfig(prev => {
      if (canvas && prev.visible) {
        const gridResult = updateCanvasGrid(canvas, prev.size, type);
        canvas.renderAll();
      }
      return { ...prev, type };
    });
  }, [canvas]);
  
  // Update column settings for column grid
  const updateColumnSettings = useCallback((columns: number, gutterWidth: number, marginWidth: number) => {
    setGridConfig(prev => ({ ...prev }));
    
    // Implementation would depend on how you want to handle column grids
  }, []);
  
  // Update the entire grid config
  const updateGridConfig = useCallback((newConfig: Partial<GridConfig>) => {
    setGridConfig(prev => {
      const updated = { ...prev, ...newConfig };
      
      // If visibility changed
      if (canvas && prev.visible !== updated.visible) {
        if (updated.visible) {
          // Show grid
          const gridResult = createCanvasGrid(canvas, updated.size, updated.type);
          gridResult.gridLines.forEach(line => {
            canvas.add(line);
            canvas.sendToBack(line);
          });
        } else {
          // Hide grid
          removeGridFromCanvas(canvas);
        }
      } 
      // If grid is visible and size or type changed
      else if (canvas && updated.visible && 
               (prev.size !== updated.size || prev.type !== updated.type)) {
        const gridResult = updateCanvasGrid(canvas, updated.size, updated.type);
        canvas.renderAll();
      }
      
      return updated;
    });
  }, [canvas]);
  
  // Initialize or update grid when canvas changes
  useEffect(() => {
    if (canvas && gridConfig.visible) {
      // Clear any existing grid
      removeGridFromCanvas(canvas);
      
      // Create new grid
      const gridResult = createCanvasGrid(canvas, gridConfig.size, gridConfig.type);
      gridResult.gridLines.forEach(line => {
        canvas.add(line);
        canvas.sendToBack(line);
      });
      
      canvas.renderAll();
    }
  }, [canvas, gridConfig.visible]);
  
  return {
    gridConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    updateColumnSettings,
    updateGridConfig
  };
}
