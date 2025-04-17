
import { useCallback } from 'react';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { EnterpriseGridConfig } from '@/components/wireframe/types/canvas-types';

export function useGridActions(
  updateConfig: (config: Partial<WireframeCanvasConfig>) => void,
  canvasConfig: WireframeCanvasConfig
) {
  // Toggle grid visibility
  const toggleGrid = useCallback(() => {
    updateConfig({ showGrid: !canvasConfig.showGrid });
  }, [updateConfig, canvasConfig.showGrid]);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    updateConfig({ snapToGrid: !canvasConfig.snapToGrid });
  }, [updateConfig, canvasConfig.snapToGrid]);
  
  // Set grid size
  const setGridSize = useCallback((size: number) => {
    updateConfig({ gridSize: size });
  }, [updateConfig]);
  
  // Change grid type (lines, dots, etc.)
  const setGridType = useCallback((type: 'lines' | 'dots' | 'columns') => {
    updateConfig({ gridType: type });
  }, [updateConfig]);
  
  // Set grid color
  const setGridColor = useCallback((color: string) => {
    updateConfig({ gridColor: color });
  }, [updateConfig]);
  
  // Set snap tolerance
  const setSnapTolerance = useCallback((tolerance: number) => {
    updateConfig({ snapTolerance: tolerance });
  }, [updateConfig]);
  
  // Update enterprise grid config (bridge to new system)
  const updateEnterpriseGrid = useCallback((enterpriseConfig: Partial<EnterpriseGridConfig>) => {
    // Map enterprise grid config to legacy config for compatibility
    const compatConfig: Partial<WireframeCanvasConfig> = {};
    
    if ('visible' in enterpriseConfig) {
      compatConfig.showGrid = enterpriseConfig.visible;
    }
    
    if ('type' in enterpriseConfig) {
      compatConfig.gridType = enterpriseConfig.type as 'lines' | 'dots' | 'columns';
    }
    
    if ('size' in enterpriseConfig) {
      compatConfig.gridSize = enterpriseConfig.size;
    }
    
    if ('snapToGrid' in enterpriseConfig) {
      compatConfig.snapToGrid = enterpriseConfig.snapToGrid;
    }
    
    if ('snapThreshold' in enterpriseConfig) {
      compatConfig.snapTolerance = enterpriseConfig.snapThreshold;
    }
    
    if ('color' in enterpriseConfig) {
      compatConfig.gridColor = enterpriseConfig.color;
    }
    
    updateConfig(compatConfig);
  }, [updateConfig]);
  
  return {
    toggleGrid,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    setGridColor,
    setSnapTolerance,
    updateEnterpriseGrid
  };
}
