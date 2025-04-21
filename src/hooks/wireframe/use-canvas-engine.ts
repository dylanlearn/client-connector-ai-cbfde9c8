
import { useRef, useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { createCanvasGrid } from '@/utils/monitoring/grid-utils';

export interface UseCanvasEngineOptions {
  containerId?: string;
  canvasId?: string;
  width?: number;
  height?: number;
}

export function useCanvasEngine(options: UseCanvasEngineOptions = {}) {
  const {
    containerId = 'canvas-container',
    canvasId = 'fabric-canvas',
    width = 1200,
    height = 800
  } = options;
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
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
    gridColor: '#e0e0e0'
  });
  
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvasElement = canvasRef.current;
    
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      width: config.width,
      height: config.height,
      backgroundColor: config.backgroundColor,
      selection: true
    });
    
    setCanvas(fabricCanvas);
    setIsInitialized(true);
    
    if (config.showGrid) {
      // Fix: Use the correct arguments for createCanvasGrid
      const gridResult = createCanvasGrid(fabricCanvas, config.gridSize, config.gridType);
      gridResult.gridLines.forEach(line => fabricCanvas.add(line));
    }
    
    return fabricCanvas;
  }, [config.width, config.height, config.backgroundColor, config.showGrid, config.gridSize, config.gridType]);
  
  useEffect(() => {
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvas]);
  
  return {
    canvas,
    canvasRef,
    containerRef,
    config,
    setConfig,
    isInitialized,
    initializeCanvas
  };
}

export default useCanvasEngine;
