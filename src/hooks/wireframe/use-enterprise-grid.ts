
import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_GRID_CONFIG, DEFAULT_GUIDE_CONFIG } from '@/components/wireframe/grid/EnterpriseGrid';
import { EnterpriseGridConfig, GridBreakpoint } from '@/components/wireframe/types/canvas-types';

export function useEnterpriseGrid(initialConfig?: Partial<EnterpriseGridConfig>) {
  // Initialize with default grid config and any provided overrides
  const [gridConfig, setGridConfig] = useState<EnterpriseGridConfig>({
    ...DEFAULT_GRID_CONFIG,
    ...initialConfig
  });
  
  // Update grid config
  const updateGridConfig = useCallback((config: Partial<EnterpriseGridConfig>) => {
    setGridConfig(prevConfig => ({
      ...prevConfig,
      ...config
    }));
  }, []);
  
  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    setGridConfig(prevConfig => ({
      ...prevConfig,
      visible: !prevConfig.visible
    }));
  }, []);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setGridConfig(prevConfig => ({
      ...prevConfig,
      snapToGrid: !prevConfig.snapToGrid
    }));
  }, []);
  
  // Change grid type
  const setGridType = useCallback((type: EnterpriseGridConfig['type']) => {
    setGridConfig(prevConfig => ({
      ...prevConfig,
      type
    }));
  }, []);
  
  // Change grid size
  const setGridSize = useCallback((size: number) => {
    setGridConfig(prevConfig => ({
      ...prevConfig,
      size
    }));
  }, []);
  
  // Update column settings
  const updateColumns = useCallback((columns: number, gutterWidth: number, marginWidth: number) => {
    setGridConfig(prevConfig => ({
      ...prevConfig,
      columns,
      gutterWidth,
      marginWidth
    }));
  }, []);
  
  // Add breakpoint
  const addBreakpoint = useCallback((breakpoint: GridBreakpoint) => {
    setGridConfig(prevConfig => ({
      ...prevConfig,
      breakpoints: [...prevConfig.breakpoints, breakpoint].sort((a, b) => a.width - b.width)
    }));
  }, []);
  
  // Remove breakpoint
  const removeBreakpoint = useCallback((name: string) => {
    setGridConfig(prevConfig => ({
      ...prevConfig,
      breakpoints: prevConfig.breakpoints.filter(bp => bp.name !== name)
    }));
  }, []);
  
  // Set current breakpoint
  const setCurrentBreakpoint = useCallback((breakpointName: string) => {
    setGridConfig(prevConfig => ({
      ...prevConfig,
      currentBreakpoint: breakpointName
    }));
  }, []);
  
  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setGridConfig(DEFAULT_GRID_CONFIG);
  }, []);
  
  // Export grid configuration
  const exportConfig = useCallback(() => {
    return JSON.stringify(gridConfig, null, 2);
  }, [gridConfig]);
  
  // Import grid configuration
  const importConfig = useCallback((configJson: string) => {
    try {
      const parsedConfig = JSON.parse(configJson);
      setGridConfig({
        ...DEFAULT_GRID_CONFIG,
        ...parsedConfig
      });
      return true;
    } catch (error) {
      console.error('Error importing grid configuration:', error);
      return false;
    }
  }, []);
  
  return {
    gridConfig,
    updateGridConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridType,
    setGridSize,
    updateColumns,
    addBreakpoint,
    removeBreakpoint,
    setCurrentBreakpoint,
    resetToDefaults,
    exportConfig,
    importConfig
  };
}
