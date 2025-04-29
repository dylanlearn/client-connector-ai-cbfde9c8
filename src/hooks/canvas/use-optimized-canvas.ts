
import { useRef, useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import canvasOptimizationService, { 
  CanvasOptimizationOptions, 
  RenderingMetrics 
} from '@/services/canvas/canvas-optimization-service';
import { v4 as uuidv4 } from 'uuid';

export interface UseOptimizedCanvasOptions {
  width?: number;
  height?: number;
  optimizationOptions?: CanvasOptimizationOptions;
  id?: string;
}

export function useOptimizedCanvas({
  width = 1200,
  height = 800,
  optimizationOptions,
  id
}: UseOptimizedCanvasOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [metrics, setMetrics] = useState<RenderingMetrics>({
    frameRate: 60,
    renderTime: 0,
    objectCount: 0
  });
  const canvasId = useRef<string>(id || `canvas-${uuidv4()}`);
  const isInitialized = useRef<boolean>(false);

  // Initialize the fabric canvas with optimizations
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || isInitialized.current) return null;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      renderOnAddRemove: false, // Prevent automatic rendering for optimized control
    });

    // Apply optimizations
    canvasOptimizationService.configure(optimizationOptions || {});
    canvasOptimizationService.initializeCanvas(fabricCanvas, canvasId.current);
    
    setCanvas(fabricCanvas);
    isInitialized.current = true;

    // Set up regular metrics updates
    const metricsInterval = setInterval(() => {
      setMetrics(canvasOptimizationService.getRenderingMetrics());
    }, 1000);

    return () => {
      clearInterval(metricsInterval);
      canvasOptimizationService.cleanupCanvas(canvasId.current);
      fabricCanvas.dispose();
      isInitialized.current = false;
    };
  }, [width, height, optimizationOptions]);

  // Initialize canvas when ref is available
  useEffect(() => {
    const cleanup = initializeCanvas();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeCanvas]);

  // Expose an optimized render method
  const renderCanvas = useCallback(() => {
    if (canvas) {
      canvas.renderAll();
    }
  }, [canvas]);

  // Update canvas dimensions with optimization considerations
  const updateDimensions = useCallback((newWidth: number, newHeight: number) => {
    if (!canvas) return;
    
    canvas.setDimensions({ width: newWidth, height: newHeight });
    
    // Force a re-initialization of optimizations if needed
    if (canvas.lowerCanvasEl) {
      canvasOptimizationService.cleanupCanvas(canvasId.current);
      canvasOptimizationService.initializeCanvas(canvas, canvasId.current);
    }
    
    canvas.renderAll();
  }, [canvas]);

  return {
    canvasRef,
    canvas,
    metrics,
    renderCanvas,
    updateDimensions
  };
}

export default useOptimizedCanvas;
