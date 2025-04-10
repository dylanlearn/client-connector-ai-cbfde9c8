
import { useState, useRef, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { useToast } from '@/hooks/use-toast';
import useCanvasHistory from '@/hooks/wireframe/use-canvas-history';
import { createCanvasGrid } from '@/components/wireframe/utils/grid-utils';

export interface UseEnhancedCanvasEngineOptions {
  containerId?: string;
  canvasId?: string;
  width?: number;
  height?: number;
  initialConfig?: Partial<WireframeCanvasConfig>;
}

export function useEnhancedCanvasEngine(options: UseEnhancedCanvasEngineOptions = {}) {
  const {
    containerId = 'canvas-container',
    canvasId = 'fabric-canvas',
    width = 1200,
    height = 800,
    initialConfig = {}
  } = options;
  
  // State
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  
  // Configuration with default values and gridColor included
  const [config, setConfig] = useState<WireframeCanvasConfig>({
    width,
    height,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
    gridType: 'lines',
    snapTolerance: 5,
    backgroundColor: '#ffffff',
    showSmartGuides: true,
    showRulers: true,
    rulerSize: 20,
    rulerColor: '#888888',
    rulerMarkings: true,
    gridColor: '#e0e0e0',
    historyEnabled: true,
    maxHistorySteps: 50,
    ...initialConfig
  });
  
  // Initialize canvas history
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    saveHistoryState 
  } = useCanvasHistory({
    canvas,
    maxHistorySteps: config.maxHistorySteps || 50,
    saveInitialState: true
  });
  
  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return null;
    
    // Create canvas instance
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: config.width,
      height: config.height,
      backgroundColor: config.backgroundColor,
      selection: true
    });
    
    setCanvas(fabricCanvas);
    setIsInitialized(true);
    
    // Event listeners
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    
    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    
    // Add grid if enabled
    if (config.showGrid) {
      const gridLines = createCanvasGrid(fabricCanvas, config.gridSize, config.gridType, config.gridColor);
      gridLines.forEach(line => fabricCanvas.add(line));
    }
    
    // Save initial state for history
    if (config.historyEnabled) {
      saveHistoryState('Initial canvas state');
    }
    
    return fabricCanvas;
  }, [config.width, config.height, config.backgroundColor, config.showGrid, config.gridSize, config.gridType, config.gridColor, config.historyEnabled, saveHistoryState]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvas]);
  
  // Update config
  const updateConfig = useCallback((updates: Partial<WireframeCanvasConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);
  
  return {
    canvas,
    canvasRef,
    containerRef,
    config,
    setConfig,
    updateConfig,
    isInitialized,
    initializeCanvas,
    selectedObject,
    setSelectedObject,
    undo,
    redo,
    canUndo,
    canRedo,
    saveHistoryState
  };
}

export default useEnhancedCanvasEngine;
