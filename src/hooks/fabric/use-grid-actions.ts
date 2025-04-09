
import { useCallback } from 'react';
import { WireframeCanvasConfig } from '@/types/wireframe';

export function useGridActions(
  updateConfig: (config: Partial<WireframeCanvasConfig>) => void,
  canvasConfig: WireframeCanvasConfig
) {
  // Grid management
  const toggleGrid = useCallback(() => {
    updateConfig({ showGrid: !canvasConfig.showGrid });
  }, [canvasConfig.showGrid, updateConfig]);
  
  const toggleSnapToGrid = useCallback(() => {
    updateConfig({ snapToGrid: !canvasConfig.snapToGrid });
  }, [canvasConfig.snapToGrid, updateConfig]);
  
  const setGridSize = useCallback((size: number) => {
    updateConfig({ gridSize: size });
  }, [updateConfig]);

  return {
    toggleGrid,
    toggleSnapToGrid,
    setGridSize
  };
}
