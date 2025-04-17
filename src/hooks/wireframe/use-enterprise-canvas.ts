
import { useState, useRef, useCallback } from 'react';
import { fabric } from 'fabric';

interface UseEnterpriseCanvasOptions {
  width?: number;
  height?: number;
  enableMemoryTracking?: boolean;
}

interface CanvasPerformanceMetrics {
  fps: number;
  objectCount: number;
  renderTime: number;
  memoryUsage?: number;
}

export function useEnterpriseCanvas({
  width = 1200,
  height = 800,
  enableMemoryTracking = false
}: UseEnterpriseCanvasOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [metrics, setMetrics] = useState<CanvasPerformanceMetrics>({
    fps: 0,
    objectCount: 0,
    renderTime: 0
  });

  const frameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);
  
  // Initialize canvas
  const initializeCanvas = useCallback((
    canvasElement: HTMLCanvasElement, 
    options?: fabric.ICanvasOptions
  ) => {
    if (!canvasElement) return null;
    
    // Clean up existing canvas
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }
    
    canvasRef.current = canvasElement;
    
    // Create canvas with options
    fabricCanvasRef.current = new fabric.Canvas(canvasElement, {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
      renderOnAddRemove: true,
      ...options
    });
    
    // Setup performance tracking
    setupPerformanceTracking();
    
    return fabricCanvasRef.current;
  }, [width, height]);
  
  // Setup performance tracking
  const setupPerformanceTracking = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Override render method to track performance
    const originalRender = canvas.renderAll.bind(canvas);
    
    canvas.renderAll = function() {
      const startTime = performance.now();
      
      // Call the original render method
      const result = originalRender();
      
      // Calculate render time
      const renderTime = performance.now() - startTime;
      frameTimeRef.current += renderTime;
      frameCountRef.current++;
      
      // Update FPS count every second
      const now = performance.now();
      if (now - lastFpsUpdateRef.current > 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastFpsUpdateRef.current));
        const avgRenderTime = frameTimeRef.current / frameCountRef.current;
        
        // Get memory usage if available
        let memoryUsage: number | undefined = undefined;
        
        // Only attempt to access performance.memory if it's supported
        if (enableMemoryTracking && 
            typeof performance !== 'undefined' && 
            'memory' in performance && 
            performance.memory) {
          // TypeScript doesn't know about memory, so we use any
          const perfAny = performance as any;
          memoryUsage = perfAny.memory?.usedJSHeapSize / 1048576; // Convert to MB
        }
        
        setMetrics({
          fps,
          objectCount: canvas.getObjects().length,
          renderTime: avgRenderTime,
          memoryUsage
        });
        
        // Reset counters
        frameTimeRef.current = 0;
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = now;
      }
      
      return result;
    };
    
  }, []);
  
  // Get current canvas
  const getCanvas = useCallback(() => {
    return fabricCanvasRef.current;
  }, []);
  
  // Cleanup canvas
  const cleanup = useCallback(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }
  }, []);
  
  return {
    canvasRef,
    fabricCanvas: fabricCanvasRef.current,
    initializeCanvas,
    getCanvas,
    metrics,
    cleanup
  };
}
