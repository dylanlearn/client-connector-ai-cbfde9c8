
import { useState, useCallback, useRef, RefObject } from 'react';

interface Position {
  x: number;
  y: number;
}

interface CanvasConfig {
  zoom: number;
  panOffset: Position;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

interface UseCanvasInteractionsProps {
  canvasRef: RefObject<HTMLDivElement>;
  initialConfig?: Partial<CanvasConfig>;
  onConfigChange?: (config: Partial<CanvasConfig>) => void;
}

export const useCanvasInteractions = ({ 
  canvasRef, 
  initialConfig,
  onConfigChange 
}: UseCanvasInteractionsProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Use defaults if not provided
  const defaultConfig: CanvasConfig = {
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 8
  };

  const [config, setConfig] = useState<CanvasConfig>({
    ...defaultConfig,
    ...initialConfig
  });

  // Update internal config and notify parent if callback provided
  const updateConfig = useCallback((updates: Partial<CanvasConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      if (onConfigChange) {
        onConfigChange(updates);
      }
      
      return newConfig;
    });
  }, [onConfigChange]);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only start dragging when space is pressed (pan mode)
    if (isSpacePressed) {
      setIsDragging(true);
      setLastPosition({ x: e.clientX, y: e.clientY });
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }
    }
  }, [isSpacePressed, canvasRef]);

  // Handle mouse move for panning
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!isDragging || !isSpacePressed) return;

    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;

    setLastPosition({ x: e.clientX, y: e.clientY });

    updateConfig({
      panOffset: {
        x: config.panOffset.x + deltaX,
        y: config.panOffset.y + deltaY
      }
    });
  }, [isDragging, isSpacePressed, lastPosition, config.panOffset, updateConfig]);

  // Handle mouse up to stop panning
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isSpacePressed ? 'grab' : 'default';
      }
    }
  }, [isDragging, isSpacePressed, canvasRef]);

  // Handle wheel for zooming
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Determine zoom direction and speed
    const zoomSpeed = 0.05;
    const deltaZoom = e.deltaY < 0 ? zoomSpeed : -zoomSpeed;
    
    // Calculate new zoom (constrained between 0.1 and 3)
    const newZoom = Math.max(0.1, Math.min(3, config.zoom + deltaZoom));
    
    updateConfig({ zoom: newZoom });
  }, [config.zoom, updateConfig]);

  // Handle key press for space bar
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
    // Space key for panning mode
    if (e.code === 'Space' && !isSpacePressed) {
      setIsSpacePressed(true);
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
      
      // Prevent default space behavior (typically page scrolling)
      e.preventDefault();
    }
  }, [isSpacePressed, isDragging, canvasRef]);

  // Handle key release
  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsSpacePressed(false);
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'default';
      }
    }
  }, [canvasRef]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    updateConfig({ zoom: Math.min(3, config.zoom + 0.1) });
  }, [config.zoom, updateConfig]);

  const zoomOut = useCallback(() => {
    updateConfig({ zoom: Math.max(0.1, config.zoom - 0.1) });
  }, [config.zoom, updateConfig]);

  const resetZoom = useCallback(() => {
    updateConfig({ 
      zoom: 1,
      panOffset: { x: 0, y: 0 }
    });
  }, [updateConfig]);

  // Grid controls
  const toggleGrid = useCallback(() => {
    updateConfig({ showGrid: !config.showGrid });
  }, [config.showGrid, updateConfig]);

  const toggleSnapToGrid = useCallback(() => {
    updateConfig({ snapToGrid: !config.snapToGrid });
  }, [config.snapToGrid, updateConfig]);

  return {
    config,
    isDragging,
    isSpacePressed,
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
    updateConfig
  };
};
