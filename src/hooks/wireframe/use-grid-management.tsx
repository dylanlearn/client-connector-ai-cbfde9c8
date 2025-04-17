
import { useState, useCallback } from 'react';
import { fabric } from 'fabric';
import {
  GridConfiguration,
  DEFAULT_GRID_CONFIG,
  updateGridOnCanvas,
  removeGridFromCanvas
} from '@/components/wireframe/utils/grid-system';
import { useToast } from '@/hooks/use-toast';

export function useGridManagement(
  canvas: fabric.Canvas | null,
  width: number,
  height: number,
  initialGridConfig: Partial<GridConfiguration> = {}
) {
  const { toast } = useToast();
  const [gridConfig, setGridConfig] = useState<GridConfiguration>({
    ...DEFAULT_GRID_CONFIG,
    ...initialGridConfig
  });
  
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
