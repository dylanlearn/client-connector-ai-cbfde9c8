
import { useCallback, useState, useRef } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/services/ai/wireframe/wireframe-types';

export interface CanvasInteractionsProps {
  canvasRef: React.MutableRefObject<HTMLDivElement | null>;
  initialConfig?: Partial<WireframeCanvasConfig>;
  onConfigChange?: (config: Partial<WireframeCanvasConfig>) => void;
}

export function useCanvasInteractions({
  canvasRef,
  initialConfig,
  onConfigChange
}: CanvasInteractionsProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);
  const [lastMousePosition, setLastMousePosition] = useState<{ x: number; y: number } | null>(null);
  
  // Default config
  const defaultConfig: WireframeCanvasConfig = {
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: false,
    gridSize: 10
  };
  
  // Use provided initial config or default
  const [config, setConfig] = useState<WireframeCanvasConfig>({
    ...defaultConfig,
    ...initialConfig
  });

  // Update the config and notify parent if needed
  const updateConfig = useCallback((updates: Partial<WireframeCanvasConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      if (onConfigChange) {
        onConfigChange(newConfig);
      }
      return newConfig;
    });
  }, [onConfigChange]);
  
  // Handle mouse down for dragging the canvas
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only initiate drag if space is pressed (pan mode)
    if (isSpacePressed && e.button === 0) {
      setIsDragging(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, [isSpacePressed]);
  
  // Handle mouse move for dragging the canvas
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && lastMousePosition) {
      const dx = e.clientX - lastMousePosition.x;
      const dy = e.clientY - lastMousePosition.y;
      
      updateConfig({
        panOffset: {
          x: config.panOffset.x + dx,
          y: config.panOffset.y + dy
        }
      });
      
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, lastMousePosition, config.panOffset, updateConfig]);
  
  // Handle mouse up to end dragging
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      setLastMousePosition(null);
    }
  }, [isDragging]);
  
  // Handle wheel event for zooming
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const delta = e.deltaY;
      const zoom = Math.min(Math.max(config.zoom - delta * 0.001, 0.5), 2);
      
      updateConfig({ zoom });
    }
  }, [config.zoom, updateConfig]);
  
  // Handle key down events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !isSpacePressed) {
      setIsSpacePressed(true);
      
      if (document.body) {
        document.body.style.cursor = 'grab';
      }
    }
  }, [isSpacePressed]);
  
  // Handle key up events
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsSpacePressed(false);
      
      if (document.body) {
        document.body.style.cursor = 'default';
      }
    }
  }, []);

  // Zoom control functions
  const zoomIn = useCallback(() => {
    updateConfig({ zoom: Math.min(config.zoom + 0.1, 2) });
  }, [config.zoom, updateConfig]);
  
  const zoomOut = useCallback(() => {
    updateConfig({ zoom: Math.max(config.zoom - 0.1, 0.5) });
  }, [config.zoom, updateConfig]);
  
  const resetZoom = useCallback(() => {
    updateConfig({
      zoom: 1,
      panOffset: { x: 0, y: 0 }
    });
  }, [updateConfig]);
  
  // Toggle grid display
  const toggleGrid = useCallback(() => {
    updateConfig({ showGrid: !config.showGrid });
  }, [config.showGrid, updateConfig]);
  
  // Toggle snap to grid
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
