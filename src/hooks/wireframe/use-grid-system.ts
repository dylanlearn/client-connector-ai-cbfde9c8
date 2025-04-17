
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  GridConfig, 
  DEFAULT_GRID_CONFIG
} from '@/components/wireframe/utils/grid-utils';

/**
 * Hook for managing grid system settings
 */
export function useGridSystem(initialConfig?: Partial<GridConfig>) {
  const { toast } = useToast();
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    ...DEFAULT_GRID_CONFIG,
    ...initialConfig
  });
  
  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    setGridConfig(prev => {
      const updated = { ...prev, visible: !prev.visible };
      
      toast({
        title: updated.visible ? 'Grid Enabled' : 'Grid Disabled',
        description: updated.visible 
          ? 'Grid is now visible.' 
          : 'Grid is now hidden.'
      });
      
      return updated;
    });
  }, [toast]);
  
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
    setGridConfig(prev => ({ ...prev, size }));
    
    toast({
      title: 'Grid Size Updated',
      description: `Grid size set to ${size}px.`
    });
  }, [toast]);
  
  // Set grid type
  const setGridType = useCallback((type: 'lines' | 'dots' | 'columns') => {
    setGridConfig(prev => ({ ...prev, type }));
    
    toast({
      title: 'Grid Type Changed',
      description: `Grid type set to ${type}.`
    });
  }, [toast]);
  
  // Set grid color
  const setGridColor = useCallback((color: string) => {
    setGridConfig(prev => ({ ...prev, color }));
  }, []);
  
  // Set columns
  const setColumns = useCallback((columns: number) => {
    setGridConfig(prev => ({ ...prev, columns }));
    
    toast({
      title: 'Grid Columns Updated',
      description: `Grid now has ${columns} columns.`
    });
  }, [toast]);
  
  // Set responsive grid config
  const setResponsiveGridConfig = useCallback((width: number) => {
    // Implementation would depend on the grid-utils implementation
    // For now, just update the width
    setGridConfig(prev => ({ ...prev, width }));
  }, []);
  
  // Update grid config
  const updateGridConfig = useCallback((config: Partial<GridConfig>) => {
    setGridConfig(prev => ({ ...prev, ...config }));
  }, []);
  
  return {
    gridConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    setGridColor,
    setColumns,
    setResponsiveGridConfig,
    updateGridConfig
  };
}

export default useGridSystem;
