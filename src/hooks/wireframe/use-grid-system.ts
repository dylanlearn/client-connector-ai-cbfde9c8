
import { useState, useCallback } from 'react';
import { GridType } from '@/components/wireframe/canvas/EnhancedGridSystem';
import { GridConfig, DEFAULT_GRID_CONFIG, GridBreakpoint } from '@/components/wireframe/utils/grid-utils';
import { ResponsiveOptions, getResponsiveGridConfig } from '@/components/wireframe/utils/responsive-utils';

export interface UseGridSystemOptions {
  initialConfig?: Partial<GridConfig>;
  persistConfig?: boolean;
  responsiveMode?: boolean;
}

export function useGridSystem(options: UseGridSystemOptions = {}) {
  const { 
    initialConfig = {},
    persistConfig = true,
    responsiveMode = true
  } = options;
  
  // Initialize grid configuration
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    ...DEFAULT_GRID_CONFIG,
    ...initialConfig
  });
  
  // Current responsive options
  const [responsiveOptions, setResponsiveOptions] = useState<ResponsiveOptions>({
    device: 'desktop',
    width: window.innerWidth
  });
  
  // Get responsive grid config based on current options
  const responsiveGridConfig = responsiveMode 
    ? getResponsiveGridConfig(gridConfig, responsiveOptions)
    : gridConfig;
  
  // Update grid config
  const updateGridConfig = useCallback((updates: Partial<GridConfig>) => {
    setGridConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      // Save to localStorage if persistConfig is true
      if (persistConfig) {
        try {
          localStorage.setItem('wireframe-grid-config', JSON.stringify(newConfig));
        } catch (e) {
          console.error('Could not save grid config to localStorage');
        }
      }
      
      return newConfig;
    });
  }, [persistConfig]);
  
  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    updateGridConfig({ visible: !gridConfig.visible });
  }, [gridConfig.visible, updateGridConfig]);
  
  // Toggle grid snap
  const toggleSnapToGrid = useCallback(() => {
    updateGridConfig({ snapToGrid: !gridConfig.snapToGrid });
  }, [gridConfig.snapToGrid, updateGridConfig]);
  
  // Toggle breakpoints visibility
  const toggleBreakpointsVisibility = useCallback(() => {
    updateGridConfig({ showBreakpoints: !gridConfig.showBreakpoints });
  }, [gridConfig.showBreakpoints, updateGridConfig]);
  
  // Change grid type
  const changeGridType = useCallback((type: GridType) => {
    updateGridConfig({ type });
  }, [updateGridConfig]);
  
  // Change grid size
  const changeGridSize = useCallback((size: number) => {
    updateGridConfig({ size });
  }, [updateGridConfig]);
  
  // Change columns
  const changeColumns = useCallback((columns: number) => {
    updateGridConfig({ columns });
  }, [updateGridConfig]);
  
  // Change gutter
  const changeGutter = useCallback((gutter: number) => {
    updateGridConfig({ gutter });
  }, [updateGridConfig]);
  
  // Update responsive options
  const updateResponsiveOptions = useCallback((options: Partial<ResponsiveOptions>) => {
    setResponsiveOptions(prev => ({ ...prev, ...options }));
  }, []);
  
  // Handle breakpoint click
  const handleBreakpointClick = useCallback((breakpoint: GridBreakpoint) => {
    updateResponsiveOptions({ width: breakpoint.width });
  }, [updateResponsiveOptions]);
  
  // Reset grid config to defaults
  const resetGridConfig = useCallback(() => {
    setGridConfig(DEFAULT_GRID_CONFIG);
    if (persistConfig) {
      try {
        localStorage.removeItem('wireframe-grid-config');
      } catch (e) {
        console.error('Could not remove grid config from localStorage');
      }
    }
  }, [persistConfig]);

  return {
    // Grid configuration
    gridConfig: responsiveGridConfig,
    baseGridConfig: gridConfig,
    // Responsive options
    responsiveOptions,
    updateResponsiveOptions,
    // Actions
    updateGridConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    toggleBreakpointsVisibility,
    changeGridType,
    changeGridSize,
    changeColumns,
    changeGutter,
    handleBreakpointClick,
    resetGridConfig
  };
}
