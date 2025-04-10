import { useCallback, useState, useEffect, RefObject } from 'react';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';

interface UseCanvasInteractionsOptions {
  canvasRef: RefObject<HTMLDivElement>;
  initialConfig?: Partial<WireframeCanvasConfig>;
  onConfigChange?: (config: Partial<WireframeCanvasConfig>) => void;
}

export function useCanvasInteractions({
  canvasRef,
  initialConfig,
  onConfigChange
}: UseCanvasInteractionsOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [config, setConfig] = useState<WireframeCanvasConfig>({
    width: 1200,
    height: 800,
    zoom: initialConfig?.zoom || 1,
    panOffset: initialConfig?.panOffset || { x: 0, y: 0 },
    showGrid: initialConfig?.showGrid !== undefined ? initialConfig.showGrid : true,
    snapToGrid: initialConfig?.snapToGrid !== undefined ? initialConfig.snapToGrid : true,
    gridSize: initialConfig?.gridSize || 10,
    gridType: initialConfig?.gridType || 'lines',
    snapTolerance: initialConfig?.snapTolerance || 5,
    backgroundColor: initialConfig?.backgroundColor || '#ffffff',
    showSmartGuides: initialConfig?.showSmartGuides !== undefined ? initialConfig.showSmartGuides : true,
    showRulers: initialConfig?.showRulers !== undefined ? initialConfig.showRulers : true,
    rulerSize: initialConfig?.rulerSize || 20,
    gridColor: initialConfig?.gridColor || '#e0e0e0',
    rulerColor: initialConfig?.rulerColor || '#bbbbbb',
    rulerMarkings: initialConfig?.rulerMarkings !== undefined ? initialConfig.rulerMarkings : true,
    historyEnabled: initialConfig?.historyEnabled !== undefined ? initialConfig.historyEnabled : true,
    maxHistorySteps: initialConfig?.maxHistorySteps || 30
  });

  // Update internal config when external config changes
  useEffect(() => {
    if (initialConfig) {
      setConfig(prev => ({
        ...prev,
        ...initialConfig
      }));
    }
  }, [initialConfig]);

  // Update external config when internal config changes
  const updateConfig = useCallback((updates: Partial<WireframeCanvasConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      if (onConfigChange) {
        onConfigChange(newConfig);
      }
      return newConfig;
    });
  }, [onConfigChange]);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (isSpacePressed && e.button === 0) {
      setIsDragging(true);
      setLastPosition({ x: e.clientX, y: e.clientY });
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }
      
      e.preventDefault();
    }
  }, [isSpacePressed, canvasRef]);

  // Handle mouse move for panning
  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastPosition.x;
      const deltaY = e.clientY - lastPosition.y;
      
      updateConfig({
        panOffset: {
          x: config.panOffset.x + deltaX,
          y: config.panOffset.y + deltaY
        }
      });
      
      setLastPosition({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, [isDragging, lastPosition, config.panOffset, updateConfig]);

  // Handle mouse up to end panning
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isSpacePressed ? 'grab' : 'default';
      }
    }
  }, [isDragging, isSpacePressed, canvasRef]);

  // Handle wheel for zooming
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const delta = e.deltaY;
      const zoom = Math.min(5, Math.max(0.1, config.zoom + (delta > 0 ? -0.1 : 0.1)));
      
      updateConfig({ zoom });
    }
  }, [config.zoom, updateConfig]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    if (e.code === 'Space' && !e.repeat) {
      setIsSpacePressed(true);
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
      
      e.preventDefault();
    }
  }, [isDragging, canvasRef]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsSpacePressed(false);
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'default';
      }
      
      e.preventDefault();
    }
  }, [canvasRef]);
  
  // Zoom utility functions
  const zoomIn = useCallback(() => {
    updateConfig({ zoom: Math.min(5, config.zoom + 0.1) });
  }, [config.zoom, updateConfig]);
  
  const zoomOut = useCallback(() => {
    updateConfig({ zoom: Math.max(0.1, config.zoom - 0.1) });
  }, [config.zoom, updateConfig]);
  
  const resetZoom = useCallback(() => {
    updateConfig({ zoom: 1, panOffset: { x: 0, y: 0 } });
  }, [updateConfig]);
  
  // Grid utility functions
  const toggleGrid = useCallback(() => {
    updateConfig({ showGrid: !config.showGrid });
  }, [config.showGrid, updateConfig]);
  
  const toggleSnapToGrid = useCallback(() => {
    updateConfig({ snapToGrid: !config.snapToGrid });
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
    config,
    updateConfig
  };
}
