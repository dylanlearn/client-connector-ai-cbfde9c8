import { useState, useCallback, useRef } from 'react';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { useToast } from '@/hooks/use-toast';

interface UseFabricOptions {
  initialConfig?: Partial<WireframeCanvasConfig>;
  onConfigChange?: (config: WireframeCanvasConfig) => void;
}

export function useFabric(options: UseFabricOptions = {}) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);
  
  // Default canvas configuration
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>({
    width: 1200,
    height: 800,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 20,
    gridType: 'lines',
    snapTolerance: 10,
    backgroundColor: '#ffffff',
    showSmartGuides: true,
    gridColor: '#e0e0e0',
    showRulers: true,
    rulerSize: 20,
    rulerColor: '#bbbbbb',
    rulerMarkings: true,
    historyEnabled: true,
    maxHistorySteps: 30,
    ...options.initialConfig
  });
  
  // Update configuration with partial updates
  const updateConfig = useCallback((config: Partial<WireframeCanvasConfig>) => {
    setCanvasConfig(prevConfig => {
      const newConfig = { ...prevConfig, ...config };
      
      // Call the onConfigChange callback if provided
      if (options.onConfigChange) {
        options.onConfigChange(newConfig);
      }
      
      return newConfig;
    });
  }, [options.onConfigChange]);

  // Initialize fabric canvas
  const initializeCanvas = useCallback((canvasElement?: HTMLCanvasElement) => {
    // This would normally initialize the fabric.js canvas
    // For now, we'll just set up a stub
    setFabricCanvas({});
    return {};
  }, []);
  
  // Toggle grid visibility
  const toggleGrid = useCallback(() => {
    updateConfig({ showGrid: !canvasConfig.showGrid });
    
    toast({
      title: canvasConfig.showGrid ? "Grid Hidden" : "Grid Shown",
      description: canvasConfig.showGrid 
        ? "The grid has been hidden." 
        : "The grid is now visible.",
      duration: 2000,
    });
  }, [canvasConfig.showGrid, updateConfig, toast]);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    updateConfig({ snapToGrid: !canvasConfig.snapToGrid });
    
    toast({
      title: canvasConfig.snapToGrid ? "Snap to Grid Disabled" : "Snap to Grid Enabled",
      description: canvasConfig.snapToGrid 
        ? "Objects will move freely." 
        : "Objects will snap to grid points.",
      duration: 2000,
    });
  }, [canvasConfig.snapToGrid, updateConfig, toast]);
  
  // Change grid size
  const setGridSize = useCallback((size: number) => {
    updateConfig({ gridSize: size });
    
    toast({
      title: "Grid Size Updated",
      description: `Grid size set to ${size}px.`,
      duration: 2000,
    });
  }, [updateConfig, toast]);
  
  // Change grid type
  const setGridType = useCallback((type: 'lines' | 'dots' | 'columns') => {
    updateConfig({ gridType: type });
    
    toast({
      title: "Grid Type Changed",
      description: `Grid type set to ${type}.`,
      duration: 2000,
    });
  }, [updateConfig, toast]);
  
  // Toggle rulers
  const toggleRulers = useCallback(() => {
    updateConfig({ showRulers: !canvasConfig.showRulers });
    
    toast({
      title: canvasConfig.showRulers ? "Rulers Hidden" : "Rulers Shown",
      description: canvasConfig.showRulers 
        ? "The rulers have been hidden." 
        : "The rulers are now visible.",
      duration: 2000,
    });
  }, [canvasConfig.showRulers, updateConfig, toast]);
  
  // Set background color
  const setBackgroundColor = useCallback((color: string) => {
    updateConfig({ backgroundColor: color });
  }, [updateConfig]);
  
  // Set zoom level
  const setZoom = useCallback((zoom: number) => {
    updateConfig({ zoom });
  }, [updateConfig]);
  
  // Zoom in
  const zoomIn = useCallback(() => {
    updateConfig({ zoom: Math.min(5, canvasConfig.zoom + 0.1) });
  }, [canvasConfig.zoom, updateConfig]);
  
  // Zoom out
  const zoomOut = useCallback(() => {
    updateConfig({ zoom: Math.max(0.1, canvasConfig.zoom - 0.1) });
  }, [canvasConfig.zoom, updateConfig]);
  
  // Reset zoom
  const resetZoom = useCallback(() => {
    updateConfig({ 
      zoom: 1,
      panOffset: { x: 0, y: 0 }
    });
  }, [updateConfig]);
  
  // Set pan offset
  const setPanOffset = useCallback((x: number, y: number) => {
    updateConfig({ panOffset: { x, y } });
  }, [updateConfig]);
  
  // Set grid color
  const setGridColor = useCallback((gridColor: string) => {
    updateConfig({ gridColor });
  }, [updateConfig]);

  return {
    canvasRef,
    fabricCanvas,
    canvasConfig,
    updateConfig,
    toggleGrid,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    toggleRulers,
    setBackgroundColor,
    setZoom,
    setPanOffset,
    setGridColor,
    zoomIn,
    zoomOut,
    resetZoom,
    initializeCanvas
  };
}
