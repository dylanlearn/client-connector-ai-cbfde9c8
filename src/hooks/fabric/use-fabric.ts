
import { useRef, useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { useCanvasActions } from './use-canvas-actions';
import { useGridActions } from './use-grid-actions';

export interface UseFabricOptions {
  persistConfig?: boolean;
  initialConfig?: Partial<WireframeCanvasConfig>;
}

const DEFAULT_CONFIG: WireframeCanvasConfig = {
  width: 1200,
  height: 800,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  showGrid: true,
  snapToGrid: true,
  gridSize: 10,
  gridType: 'lines',
  snapTolerance: 5,
  backgroundColor: '#ffffff',
  showSmartGuides: true,
  gridColor: '#e0e0e0'
};

export function useFabric(options: UseFabricOptions = {}) {
  const { persistConfig = false, initialConfig = {} } = options;
  
  // State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>(() => {
    // Initialize with default config and override with initialConfig
    const config = { ...DEFAULT_CONFIG, ...initialConfig };
    
    // Load from localStorage if persistConfig is true
    if (persistConfig) {
      try {
        const storedConfig = localStorage.getItem('fabric-canvas-config');
        if (storedConfig) {
          return { ...config, ...JSON.parse(storedConfig) };
        }
      } catch (e) {
        console.error('Could not load canvas config from localStorage', e);
      }
    }
    
    return config;
  });
  
  // Update config with persistence
  const updateConfig = useCallback((updates: Partial<WireframeCanvasConfig>) => {
    setCanvasConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      if (persistConfig) {
        try {
          localStorage.setItem('fabric-canvas-config', JSON.stringify(newConfig));
        } catch (e) {
          console.error('Could not save canvas config to localStorage', e);
        }
      }
      
      return newConfig;
    });
  }, [persistConfig]);
  
  // Initialize canvas
  const initializeCanvas = useCallback((canvasElement?: HTMLCanvasElement) => {
    const canvas = new fabric.Canvas(canvasElement || canvasRef.current, {
      width: canvasConfig.width,
      height: canvasConfig.height,
      backgroundColor: canvasConfig.backgroundColor
    });
    
    setFabricCanvas(canvas);
    
    // Set up event listeners
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    
    canvas.on('mouse:down', () => {
      if (canvas.isDrawingMode) {
        setIsDrawing(true);
      }
    });
    
    canvas.on('mouse:up', () => {
      if (isDrawing) {
        setIsDrawing(false);
      }
    });
    
    return canvas;
  }, [canvasConfig.width, canvasConfig.height, canvasConfig.backgroundColor, isDrawing]);
  
  // Dispose canvas on unmount
  useEffect(() => {
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, [fabricCanvas]);
  
  // Get canvas actions
  const canvasActions = useCanvasActions(fabricCanvas, updateConfig, canvasConfig);
  
  // Get grid actions
  const gridActions = useGridActions(updateConfig, canvasConfig);
  
  return {
    canvasRef,
    fabricCanvas,
    canvasConfig,
    selectedObject,
    isDrawing,
    updateConfig,
    initializeCanvas,
    setSelectedObject,
    setIsDrawing,
    ...canvasActions,
    ...gridActions
  };
}
