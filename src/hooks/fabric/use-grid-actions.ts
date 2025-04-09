
import { useCallback } from 'react';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';

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
  
  const changeGridType = useCallback((type: "lines" | "dots" | "columns") => {
    updateConfig({ gridType: type });
  }, [updateConfig]);
  
  const setSnapTolerance = useCallback((tolerance: number) => {
    updateConfig({ snapTolerance: tolerance });
  }, [updateConfig]);

  return {
    toggleGrid,
    toggleSnapToGrid,
    setGridSize,
    changeGridType,
    setSnapTolerance
  };
}
