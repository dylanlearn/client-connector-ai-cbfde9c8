
import { useCallback } from 'react';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';

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
  const setGridType = useCallback((type: 'lines' | 'dots' | 'grid') => {
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
  
  return {
    toggleGrid,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    setGridColor,
    setSnapTolerance
  };
}
