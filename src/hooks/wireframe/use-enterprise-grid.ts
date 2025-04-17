
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { 
  EnterpriseGridConfig, 
  GridBreakpoint,
  GridGuideConfig
} from '@/components/wireframe/types/canvas-types';
import { DEFAULT_GRID_CONFIG, DEFAULT_GUIDE_CONFIG } from '@/components/wireframe/grid/EnterpriseGrid';
import { useToast } from '@/hooks/use-toast';

interface UseEnterpriseGridOptions {
  canvas: fabric.Canvas | null;
  width?: number;
  height?: number;
  initialConfig?: Partial<EnterpriseGridConfig>;
  initialGuideConfig?: Partial<GridGuideConfig>;
  persistConfig?: boolean;
}

export function useEnterpriseGrid({
  canvas,
  width = 1200,
  height = 800,
  initialConfig = {},
  initialGuideConfig = {},
  persistConfig = false
}: UseEnterpriseGridOptions) {
  const { toast } = useToast();
  
  // Initialize grid configuration state
  const [gridConfig, setGridConfig] = useState<EnterpriseGridConfig>(() => {
    // Start with default config
    let config = { ...DEFAULT_GRID_CONFIG, ...initialConfig };
    
    // Load from localStorage if persistConfig is enabled
    if (persistConfig) {
      try {
        const storedConfig = localStorage.getItem('enterprise-grid-config');
        if (storedConfig) {
          config = { ...config, ...JSON.parse(storedConfig) };
        }
      } catch (error) {
        console.error('Failed to load grid config from localStorage:', error);
      }
    }
    
    return config;
  });
  
  // Initialize guide configuration state
  const [guideConfig, setGuideConfig] = useState<GridGuideConfig>(() => {
    // Start with default guide config
    let config = { ...DEFAULT_GUIDE_CONFIG, ...initialGuideConfig };
    
    // Load from localStorage if persistConfig is enabled
    if (persistConfig) {
      try {
        const storedConfig = localStorage.getItem('enterprise-grid-guide-config');
        if (storedConfig) {
          config = { ...config, ...JSON.parse(storedConfig) };
        }
      } catch (error) {
        console.error('Failed to load guide config from localStorage:', error);
      }
    }
    
    return config;
  });
  
  // Store grid configuration in localStorage when it changes
  useEffect(() => {
    if (persistConfig) {
      try {
        localStorage.setItem('enterprise-grid-config', JSON.stringify(gridConfig));
      } catch (error) {
        console.error('Failed to save grid config to localStorage:', error);
      }
    }
  }, [gridConfig, persistConfig]);
  
  // Store guide configuration in localStorage when it changes
  useEffect(() => {
    if (persistConfig) {
      try {
        localStorage.setItem('enterprise-grid-guide-config', JSON.stringify(guideConfig));
      } catch (error) {
        console.error('Failed to save guide config to localStorage:', error);
      }
    }
  }, [guideConfig, persistConfig]);
  
  // Update grid config
  const updateGridConfig = useCallback((updates: Partial<EnterpriseGridConfig>) => {
    setGridConfig(prev => ({ ...prev, ...updates }));
    
    // Show toast notification for certain updates
    if ('visible' in updates) {
      toast({
        title: updates.visible ? 'Grid Enabled' : 'Grid Disabled',
        description: updates.visible 
          ? 'Grid is now visible on the canvas.' 
          : 'Grid is now hidden.'
      });
    }
    
    if ('snapToGrid' in updates) {
      toast({
        title: updates.snapToGrid ? 'Snap to Grid Enabled' : 'Snap to Grid Disabled',
        description: updates.snapToGrid 
          ? 'Elements will snap to grid points when moved.' 
          : 'Elements can be positioned freely.'
      });
    }
    
    if ('responsive' in updates) {
      toast({
        title: updates.responsive ? 'Responsive Grid Enabled' : 'Responsive Grid Disabled',
        description: updates.responsive 
          ? 'Grid will adapt based on breakpoints.' 
          : 'Grid will use fixed settings.'
      });
    }
  }, [toast]);
  
  // Update guide config
  const updateGuideConfig = useCallback((updates: Partial<GridGuideConfig>) => {
    setGuideConfig(prev => ({ ...prev, ...updates }));
    
    // Show toast notification for certain updates
    if ('snapToGuides' in updates) {
      toast({
        title: updates.snapToGuides ? 'Snap to Guides Enabled' : 'Snap to Guides Disabled',
        description: updates.snapToGuides 
          ? 'Elements will snap to guide lines when moved.' 
          : 'Guide snapping is disabled.'
      });
    }
  }, [toast]);
  
  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    updateGridConfig({ visible: !gridConfig.visible });
  }, [gridConfig.visible, updateGridConfig]);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    updateGridConfig({ snapToGrid: !gridConfig.snapToGrid });
  }, [gridConfig.snapToGrid, updateGridConfig]);
  
  // Set grid type
  const setGridType = useCallback((type: 'lines' | 'dots' | 'columns' | 'custom') => {
    updateGridConfig({ type });
    
    toast({
      title: 'Grid Type Changed',
      description: `Grid type set to ${type}`
    });
  }, [updateGridConfig, toast]);
  
  // Set grid size
  const setGridSize = useCallback((size: number) => {
    updateGridConfig({ size });
  }, [updateGridConfig]);
  
  // Update columns configuration
  const updateColumnSettings = useCallback((columns: number, gutterWidth: number, marginWidth: number) => {
    updateGridConfig({ columns, gutterWidth, marginWidth });
    
    toast({
      title: 'Column Settings Updated',
      description: `Layout set to ${columns} columns with ${gutterWidth}px gutters`
    });
  }, [updateGridConfig, toast]);
  
  // Toggle responsive grid
  const toggleResponsiveGrid = useCallback(() => {
    updateGridConfig({ responsive: !gridConfig.responsive });
  }, [gridConfig.responsive, updateGridConfig]);
  
  // Update breakpoint
  const updateBreakpoint = useCallback((name: string, updates: Partial<GridBreakpoint>) => {
    const index = gridConfig.breakpoints.findIndex(bp => bp.name === name);
    if (index === -1) return;
    
    const updatedBreakpoints = [...gridConfig.breakpoints];
    updatedBreakpoints[index] = { ...updatedBreakpoints[index], ...updates };
    
    updateGridConfig({ breakpoints: updatedBreakpoints });
    
    toast({
      title: 'Breakpoint Updated',
      description: `Breakpoint ${name} configuration updated`
    });
  }, [gridConfig.breakpoints, updateGridConfig, toast]);
  
  // Set current breakpoint
  const setCurrentBreakpoint = useCallback((breakpointName: string) => {
    const breakpoint = gridConfig.breakpoints.find(bp => bp.name === breakpointName);
    if (!breakpoint) return;
    
    updateGridConfig({ currentBreakpoint: breakpointName });
    
    toast({
      title: 'Breakpoint Changed',
      description: `Current breakpoint set to ${breakpointName}`
    });
  }, [gridConfig.breakpoints, updateGridConfig, toast]);
  
  // Get appropriate grid config for a specific width (responsive)
  const getResponsiveGridConfig = useCallback((viewportWidth: number): EnterpriseGridConfig => {
    if (!gridConfig.responsive) return gridConfig;
    
    // Find the appropriate breakpoint
    const sortedBreakpoints = [...gridConfig.breakpoints].sort((a, b) => b.width - a.width);
    const activeBreakpoint = sortedBreakpoints.find(bp => viewportWidth >= bp.width) || sortedBreakpoints[sortedBreakpoints.length - 1];
    
    if (!activeBreakpoint) return gridConfig;
    
    // Return grid config with the active breakpoint's settings
    return {
      ...gridConfig,
      columns: activeBreakpoint.columns,
      gutterWidth: activeBreakpoint.gutterWidth,
      marginWidth: activeBreakpoint.marginWidth,
      currentBreakpoint: activeBreakpoint.name
    };
  }, [gridConfig]);
  
  // Reset to default configuration
  const resetToDefaults = useCallback(() => {
    setGridConfig(DEFAULT_GRID_CONFIG);
    setGuideConfig(DEFAULT_GUIDE_CONFIG);
    
    toast({
      title: 'Grid Settings Reset',
      description: 'Grid configuration has been reset to default values'
    });
  }, [toast]);

  return {
    gridConfig,
    guideConfig,
    updateGridConfig,
    updateGuideConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridType,
    setGridSize,
    updateColumnSettings,
    toggleResponsiveGrid,
    updateBreakpoint,
    setCurrentBreakpoint,
    getResponsiveGridConfig,
    resetToDefaults
  };
}
