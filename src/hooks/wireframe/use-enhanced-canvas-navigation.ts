import { useState, useCallback, useMemo } from 'react';

// Export these types explicitly
export type ViewMode = 'single' | 'split' | 'quad' | 'grid';

export interface FocusArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewportState {
  id: string;
  zoom: number;
  rotation: number;
  pan: { x: number, y: number };
  focusArea: FocusArea | null;
  visible: boolean;
}

interface NavigationHistoryItem {
  viewports: ViewportState[];
  viewMode: ViewMode;
  activeViewport: number;
  timestamp: number;
  description?: string;
}

export interface EnhancedNavigationConfig {
  maxHistorySize: number;
  animationDuration: number;
  enableSnapToGrid: boolean;
  gridSize: number;
  showMinimap: boolean;
}

const DEFAULT_CONFIG: EnhancedNavigationConfig = {
  maxHistorySize: 50,
  animationDuration: 300,
  enableSnapToGrid: true,
  gridSize: 10,
  showMinimap: true
};

export function useEnhancedCanvasNavigation(initialConfig?: Partial<EnhancedNavigationConfig>) {
  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...initialConfig }), [initialConfig]);
  
  // Viewports state
  const [viewports, setViewports] = useState<ViewportState[]>([
    {
      id: 'default',
      zoom: 1,
      rotation: 0,
      pan: { x: 0, y: 0 },
      focusArea: null,
      visible: true
    }
  ]);
  
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [activeViewport, setActiveViewport] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // History state
  const [history, setHistory] = useState<NavigationHistoryItem[]>([
    {
      viewports: [...viewports], 
      viewMode, 
      activeViewport,
      timestamp: Date.now()
    }
  ]);
  const [historyPosition, setHistoryPosition] = useState<number>(0);
  
  // Calculate active viewport ID
  const activeViewportId = viewports[activeViewport]?.id || 'default';
  
  // Extract current viewport properties
  const zoom = viewports[activeViewport]?.zoom || 1;
  const rotation = viewports[activeViewport]?.rotation || 0;
  const pan = viewports[activeViewport]?.pan || { x: 0, y: 0 };
  
  // Calculate canvas transform for current viewport
  const canvasTransform = useMemo(() => {
    return `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`;
  }, [zoom, rotation, pan]);
  
  // Add history entry
  const addHistoryEntry = useCallback((description?: string) => {
    setHistory(prev => {
      const newEntry = {
        viewports: JSON.parse(JSON.stringify(viewports)),
        viewMode,
        activeViewport,
        timestamp: Date.now(),
        description
      };
      
      const newHistory = [
        ...prev.slice(0, historyPosition + 1),
        newEntry
      ].slice(-config.maxHistorySize);
      
      return newHistory;
    });
    
    setHistoryPosition(prev => {
      const newPos = Math.min(prev + 1, config.maxHistorySize - 1);
      return newPos;
    });
  }, [viewports, viewMode, activeViewport, historyPosition, config.maxHistorySize]);
  
  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setViewports(prev => {
      const newViewports = [...prev];
      newViewports[activeViewport] = {
        ...newViewports[activeViewport],
        zoom: Math.min(5, (newViewports[activeViewport].zoom || 1) + 0.1)
      };
      return newViewports;
    });
    addHistoryEntry('Zoom in');
  }, [activeViewport, addHistoryEntry]);
  
  const handleZoomOut = useCallback(() => {
    setViewports(prev => {
      const newViewports = [...prev];
      newViewports[activeViewport] = {
        ...newViewports[activeViewport],
        zoom: Math.max(0.1, (newViewports[activeViewport].zoom || 1) - 0.1)
      };
      return newViewports;
    });
    addHistoryEntry('Zoom out');
  }, [activeViewport, addHistoryEntry]);
  
  const handleZoomReset = useCallback(() => {
    setViewports(prev => {
      const newViewports = [...prev];
      newViewports[activeViewport] = {
        ...newViewports[activeViewport],
        zoom: 1
      };
      return newViewports;
    });
    addHistoryEntry('Reset zoom');
  }, [activeViewport, addHistoryEntry]);
  
  // Rotation controls
  const handleRotateClockwise = useCallback(() => {
    setViewports(prev => {
      const newViewports = [...prev];
      newViewports[activeViewport] = {
        ...newViewports[activeViewport],
        rotation: (newViewports[activeViewport].rotation || 0) + 15
      };
      return newViewports;
    });
    addHistoryEntry('Rotate clockwise');
  }, [activeViewport, addHistoryEntry]);
  
  const handleRotateCounterClockwise = useCallback(() => {
    setViewports(prev => {
      const newViewports = [...prev];
      newViewports[activeViewport] = {
        ...newViewports[activeViewport],
        rotation: (newViewports[activeViewport].rotation || 0) - 15
      };
      return newViewports;
    });
    addHistoryEntry('Rotate counter-clockwise');
  }, [activeViewport, addHistoryEntry]);
  
  const handleRotateReset = useCallback(() => {
    setViewports(prev => {
      const newViewports = [...prev];
      newViewports[activeViewport] = {
        ...newViewports[activeViewport],
        rotation: 0
      };
      return newViewports;
    });
    addHistoryEntry('Reset rotation');
  }, [activeViewport, addHistoryEntry]);
  
  // Pan controls
  const handlePan = useCallback((x: number, y: number) => {
    setViewports(prev => {
      const newViewports = [...prev];
      newViewports[activeViewport] = {
        ...newViewports[activeViewport],
        pan: {
          x: (newViewports[activeViewport].pan?.x || 0) + x,
          y: (newViewports[activeViewport].pan?.y || 0) + y
        }
      };
      return newViewports;
    });
  }, [activeViewport]);
  
  const finalizeViewportPan = useCallback(() => {
    addHistoryEntry('Pan viewport');
  }, [addHistoryEntry]);
  
  // View mode toggle
  const handleViewModeToggle = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    addHistoryEntry(`Switch to ${mode} view`);
    
    // Adjust viewports for the new mode
    const currentViewports = [...viewports];
    
    if (mode === 'single' && currentViewports.length !== 1) {
      setViewports([currentViewports[activeViewport]]);
      setActiveViewport(0);
    } else if (mode === 'split' && currentViewports.length !== 2) {
      if (currentViewports.length < 2) {
        // Add another viewport
        setViewports([
          currentViewports[0],
          {
            id: `viewport-${Date.now()}`,
            zoom: 1,
            rotation: 0,
            pan: { x: 0, y: 0 },
            focusArea: null,
            visible: true
          }
        ]);
      } else {
        // Keep only first two
        setViewports(currentViewports.slice(0, 2));
      }
      setActiveViewport(0);
    } else if (mode === 'quad' && currentViewports.length !== 4) {
      const newViewports = [...currentViewports];
      
      while (newViewports.length < 4) {
        newViewports.push({
          id: `viewport-${Date.now()}-${newViewports.length}`,
          zoom: 1,
          rotation: 0,
          pan: { x: 0, y: 0 },
          focusArea: null,
          visible: true
        });
      }
      
      setViewports(newViewports.slice(0, 4));
      setActiveViewport(0);
    } else if (mode === 'grid' && currentViewports.length !== 6) {
      const newViewports = [...currentViewports];
      
      while (newViewports.length < 6) {
        newViewports.push({
          id: `viewport-${Date.now()}-${newViewports.length}`,
          zoom: 1,
          rotation: 0,
          pan: { x: 0, y: 0 },
          focusArea: null,
          visible: true
        });
      }
      
      setViewports(newViewports.slice(0, 6));
      setActiveViewport(0);
    }
  }, [viewports, activeViewport, addHistoryEntry]);
  
  // Focus area
  const handleApplyFocusArea = useCallback((area: FocusArea) => {
    setViewports(prev => {
      const newViewports = [...prev];
      newViewports[activeViewport] = {
        ...newViewports[activeViewport],
        focusArea: area,
        zoom: 1.5,
        pan: {
          x: -area.x + (area.width / 2),
          y: -area.y + (area.height / 2)
        }
      };
      return newViewports;
    });
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, config.animationDuration);
    
    addHistoryEntry('Focus on area');
  }, [activeViewport, addHistoryEntry, config.animationDuration]);
  
  // Manage viewports
  const addViewport = useCallback(() => {
    setViewports(prev => [
      ...prev,
      {
        id: `viewport-${Date.now()}`,
        zoom: 1,
        rotation: 0,
        pan: { x: 0, y: 0 },
        focusArea: null,
        visible: true
      }
    ]);
    
    addHistoryEntry('Add viewport');
    
    // If we have too many viewports for current mode, switch to grid
    if (viewMode === 'single') {
      setViewMode('split');
    } else if (viewMode === 'split' && viewports.length >= 2) {
      setViewMode('quad');
    } else if (viewMode === 'quad' && viewports.length >= 4) {
      setViewMode('grid');
    }
  }, [viewports.length, viewMode, addHistoryEntry]);
  
  const removeViewport = useCallback((index: number) => {
    if (viewports.length <= 1) {
      return; // Don't remove last viewport
    }
    
    setViewports(prev => prev.filter((_, i) => i !== index));
    
    // Adjust active viewport if needed
    if (activeViewport === index) {
      setActiveViewport(0);
    } else if (activeViewport > index) {
      setActiveViewport(prev => prev - 1);
    }
    
    addHistoryEntry('Remove viewport');
    
    // Adjust view mode if needed
    if (viewports.length - 1 === 1) {
      setViewMode('single');
    } else if (viewports.length - 1 === 2) {
      setViewMode('split');
    } else if (viewports.length - 1 === 4) {
      setViewMode('quad');
    }
  }, [viewports.length, activeViewport, addHistoryEntry]);
  
  // History navigation
  const canUndo = historyPosition > 0;
  const canRedo = historyPosition < history.length - 1;
  
  const undo = useCallback(() => {
    if (!canUndo) return;
    
    const prevPosition = historyPosition - 1;
    const prevState = history[prevPosition];
    
    setViewports(prevState.viewports);
    setViewMode(prevState.viewMode);
    setActiveViewport(prevState.activeViewport);
    setHistoryPosition(prevPosition);
  }, [canUndo, history, historyPosition]);
  
  const redo = useCallback(() => {
    if (!canRedo) return;
    
    const nextPosition = historyPosition + 1;
    const nextState = history[nextPosition];
    
    setViewports(nextState.viewports);
    setViewMode(nextState.viewMode);
    setActiveViewport(nextState.activeViewport);
    setHistoryPosition(nextPosition);
  }, [canRedo, history, historyPosition]);
  
  const updateConfig = useCallback((updates: Partial<EnhancedNavigationConfig>) => {
    // This is just for type checking - the actual implementation would
    // update the config object with the new values
  }, []);
  
  return {
    viewports,
    viewMode,
    activeViewport,
    history,
    historyPosition,
    activeViewportId,
    config,
    isAnimating,
    zoom,
    rotation,
    pan,
    canvasTransform,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleRotateClockwise,
    handleRotateCounterClockwise,
    handleRotateReset,
    handlePan,
    finalizeViewportPan,
    handleViewModeToggle,
    handleApplyFocusArea,
    addViewport,
    removeViewport,
    setActiveViewport,
    canUndo,
    canRedo,
    undo,
    redo,
    updateConfig
  };
}
