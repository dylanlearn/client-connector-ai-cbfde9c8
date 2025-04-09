
import { useState, useEffect, useCallback, RefObject } from 'react';

interface CanvasConfig {
  zoom?: number;
  panOffset?: { x: number; y: number };
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  gridType?: 'lines' | 'dots' | 'columns';
  snapTolerance?: number;
  showSmartGuides?: boolean;
}

interface CanvasPosition {
  x: number;
  y: number;
}

interface GuidelinePosition {
  position: number;
  orientation: 'horizontal' | 'vertical';
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
  const [guidelines, setGuidelines] = useState<GuidelinePosition[]>([]);
  
  // Initialize with default config values
  const [config, setConfig] = useState<CanvasConfig>({
    zoom: initialConfig.zoom || 1,
    panOffset: initialConfig.panOffset || { x: 0, y: 0 },
    showGrid: initialConfig.showGrid ?? true,
    snapToGrid: initialConfig.snapToGrid ?? true,
    gridSize: initialConfig.gridSize || 10,
    gridType: initialConfig.gridType || 'lines',
    snapTolerance: initialConfig.snapTolerance || 5,
    showSmartGuides: initialConfig.showSmartGuides ?? true
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
  
  // Mouse event handlers with proper TypeScript types
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
  
  const handleMouseUp = useCallback(() => {
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
  
  const toggleSmartGuides = useCallback(() => {
    updateConfig({ showSmartGuides: !(config.showSmartGuides || false) });
  }, [config.showSmartGuides, updateConfig]);
  
  const setGridType = useCallback((gridType: CanvasConfig['gridType']) => {
    updateConfig({ gridType });
  }, [updateConfig]);
  
  const setGridSize = useCallback((gridSize: number) => {
    updateConfig({ gridSize });
  }, [updateConfig]);
  
  const setSnapTolerance = useCallback((snapTolerance: number) => {
    updateConfig({ snapTolerance });
  }, [updateConfig]);
  
  // Smart guide utilities
  const calculateGuidelines = useCallback((elements: DOMRect[], currentElement: DOMRect) => {
    const newGuidelines: GuidelinePosition[] = [];
    const tolerance = config.snapTolerance || 5;
    
    // Check horizontal alignments (tops, centers, bottoms)
    elements.forEach(rect => {
      // Top alignment
      if (Math.abs(rect.top - currentElement.top) <= tolerance) {
        newGuidelines.push({
          position: rect.top,
          orientation: 'horizontal'
        });
      }
      
      // Center alignment
      const rectCenterY = rect.top + rect.height / 2;
      const currentCenterY = currentElement.top + currentElement.height / 2;
      if (Math.abs(rectCenterY - currentCenterY) <= tolerance) {
        newGuidelines.push({
          position: rectCenterY,
          orientation: 'horizontal'
        });
      }
      
      // Bottom alignment
      if (Math.abs((rect.top + rect.height) - (currentElement.top + currentElement.height)) <= tolerance) {
        newGuidelines.push({
          position: rect.top + rect.height,
          orientation: 'horizontal'
        });
      }
      
      // Similar checks for vertical alignments (lefts, centers, rights)
      if (Math.abs(rect.left - currentElement.left) <= tolerance) {
        newGuidelines.push({
          position: rect.left,
          orientation: 'vertical'
        });
      }
      
      const rectCenterX = rect.left + rect.width / 2;
      const currentCenterX = currentElement.left + currentElement.width / 2;
      if (Math.abs(rectCenterX - currentCenterX) <= tolerance) {
        newGuidelines.push({
          position: rectCenterX,
          orientation: 'vertical'
        });
      }
      
      if (Math.abs((rect.left + rect.width) - (currentElement.left + currentElement.width)) <= tolerance) {
        newGuidelines.push({
          position: rect.left + rect.width,
          orientation: 'vertical'
        });
      }
    });
    
    setGuidelines(newGuidelines);
    return newGuidelines;
  }, [config.snapTolerance]);
  
  // Snapping functionality
  const snapToGridPosition = useCallback((position: CanvasPosition): CanvasPosition => {
    if (!config.snapToGrid || !config.gridSize) return position;
    
    const gridSize = config.gridSize;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize
    };
  }, [config.snapToGrid, config.gridSize]);
  
  const snapToGuideline = useCallback((position: CanvasPosition, rect: DOMRect): CanvasPosition => {
    if (!config.showSmartGuides || guidelines.length === 0) return position;
    
    let newPosition = { ...position };
    const tolerance = config.snapTolerance || 5;
    
    // Check for horizontal guidelines
    const horizontalGuidelines = guidelines.filter(g => g.orientation === 'horizontal');
    for (const guide of horizontalGuidelines) {
      // Snap top
      if (Math.abs(guide.position - position.y) <= tolerance) {
        newPosition.y = guide.position;
        break;
      }
      
      // Snap center
      const centerY = position.y + rect.height / 2;
      if (Math.abs(guide.position - centerY) <= tolerance) {
        newPosition.y = guide.position - rect.height / 2;
        break;
      }
      
      // Snap bottom
      const bottom = position.y + rect.height;
      if (Math.abs(guide.position - bottom) <= tolerance) {
        newPosition.y = guide.position - rect.height;
        break;
      }
    }
    
    // Check for vertical guidelines
    const verticalGuidelines = guidelines.filter(g => g.orientation === 'vertical');
    for (const guide of verticalGuidelines) {
      // Snap left
      if (Math.abs(guide.position - position.x) <= tolerance) {
        newPosition.x = guide.position;
        break;
      }
      
      // Snap center
      const centerX = position.x + rect.width / 2;
      if (Math.abs(guide.position - centerX) <= tolerance) {
        newPosition.x = guide.position - rect.width / 2;
        break;
      }
      
      // Snap right
      const right = position.x + rect.width;
      if (Math.abs(guide.position - right) <= tolerance) {
        newPosition.x = guide.position - rect.width;
        break;
      }
    }
    
    return newPosition;
  }, [guidelines, config.showSmartGuides, config.snapTolerance]);
  
  const clearGuidelines = useCallback(() => {
    setGuidelines([]);
  }, []);
  
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
    toggleSmartGuides,
    setGridType,
    setGridSize,
    setSnapTolerance,
    calculateGuidelines,
    snapToGridPosition,
    snapToGuideline,
    clearGuidelines,
    isDragging,
    isSpacePressed,
    config,
    guidelines
  };
}
