
import { useState, useEffect, useCallback, RefObject } from 'react';

interface CanvasConfig {
  zoom?: number;
  panOffset?: { x: number; y: number };
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
}

interface UseCanvasInteractionsProps {
  canvasRef: RefObject<HTMLDivElement>;
  initialConfig?: CanvasConfig;
  onConfigChange?: (config: CanvasConfig) => void;
}

export function useCanvasInteractions({
  canvasRef,
  initialConfig = {},
  onConfigChange
}: UseCanvasInteractionsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  
  // Initialize with default config values
  const [config, setConfig] = useState<CanvasConfig>({
    zoom: initialConfig.zoom || 1,
    panOffset: initialConfig.panOffset || { x: 0, y: 0 },
    showGrid: initialConfig.showGrid ?? true,
    snapToGrid: initialConfig.snapToGrid ?? true,
    gridSize: initialConfig.gridSize || 10
  });
  
  // Update local config when initialConfig changes
  useEffect(() => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...initialConfig
    }));
  }, [initialConfig]);
  
  // Handle config changes and notify parent
  const updateConfig = useCallback((updates: Partial<CanvasConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      if (onConfigChange) {
        onConfigChange(newConfig);
      }
      return newConfig;
    });
  }, [onConfigChange]);
  
  // Mouse event handlers - Fixed to properly type the event parameters
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isSpacePressed && e.button === 0) {
      setIsDragging(true);
      setLastPosition({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, [isSpacePressed]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastPosition.x;
      const deltaY = e.clientY - lastPosition.y;
      
      updateConfig({
        panOffset: {
          x: (config.panOffset?.x || 0) + deltaX,
          y: (config.panOffset?.y || 0) + deltaY
        }
      });
      
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, lastPosition, config.panOffset, updateConfig]);
  
  const handleMouseUp = useCallback((e: MouseEvent | React.MouseEvent) => {
    setIsDragging(false);
  }, []);
  
  // Keyboard event handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !e.repeat) {
      setIsSpacePressed(true);
    }
  }, []);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsSpacePressed(false);
      setIsDragging(false);
    }
  }, []);
  
  // Zoom handling
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, Math.min((config.zoom || 1) + delta, 3));
      
      updateConfig({ zoom: newZoom });
    }
  }, [config.zoom, updateConfig]);
  
  // Utility functions
  const zoomIn = useCallback(() => {
    updateConfig({ zoom: Math.min((config.zoom || 1) + 0.1, 3) });
  }, [config.zoom, updateConfig]);
  
  const zoomOut = useCallback(() => {
    updateConfig({ zoom: Math.max(0.1, (config.zoom || 1) - 0.1) });
  }, [config.zoom, updateConfig]);
  
  const resetZoom = useCallback(() => {
    updateConfig({ zoom: 1, panOffset: { x: 0, y: 0 } });
  }, [updateConfig]);
  
  const toggleGrid = useCallback(() => {
    updateConfig({ showGrid: !(config.showGrid || false) });
  }, [config.showGrid, updateConfig]);
  
  const toggleSnapToGrid = useCallback(() => {
    updateConfig({ snapToGrid: !(config.snapToGrid || false) });
  }, [config.snapToGrid, updateConfig]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleKeyDown,
    handleKeyUp,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid,
    toggleSnapToGrid,
    isDragging,
    isSpacePressed,
    config
  };
}
