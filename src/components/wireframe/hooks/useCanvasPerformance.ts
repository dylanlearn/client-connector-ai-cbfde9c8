
import { useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { CanvasRenderStats, CanvasPerformanceOptions } from '../types/canvas-types';

/**
 * Hook for monitoring and optimizing canvas performance
 */
export function useCanvasPerformance(
  canvas: fabric.Canvas | null,
  options: CanvasPerformanceOptions = {}
) {
  const [renderStats, setRenderStats] = useState<CanvasRenderStats>({
    renderTime: 0,
    objectCount: 0,
    lastRenderTimestamp: 0,
    frameRate: 0
  });
  
  const [isOptimizationEnabled, setIsOptimizationEnabled] = useState(true);
  
  // Monitor render performance
  useEffect(() => {
    if (!canvas) return;
    
    let lastRenderTime = performance.now();
    let frameCount = 0;
    let frameTimes: number[] = [];
    const maxFrameHistory = 60; // Track last 60 frames for averages
    
    const measureRenderPerformance = () => {
      const now = performance.now();
      const renderTime = now - lastRenderTime;
      lastRenderTime = now;
      
      frameCount++;
      frameTimes.push(renderTime);
      if (frameTimes.length > maxFrameHistory) {
        frameTimes.shift();
      }
      
      // Calculate average frame rate
      const avgRenderTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
      const frameRate = Math.round(1000 / avgRenderTime);
      
      setRenderStats({
        renderTime: Math.round(renderTime),
        objectCount: canvas.getObjects().length,
        lastRenderTimestamp: now,
        frameRate: frameRate,
        // Chrome-only API, try to use if available
        memoryUsage: window.performance && 
                   (performance as any).memory ? 
                   Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024)) : 
                   undefined
      });
    };
    
    // Modify the _renderAll method to measure performance
    const originalRenderAll = canvas._renderAll.bind(canvas);
    
    canvas._renderAll = function(isClipPathMode?: boolean) {
      const result = originalRenderAll(isClipPathMode);
      measureRenderPerformance();
      return result;
    };
    
    return () => {
      // Restore original method
      canvas._renderAll = originalRenderAll;
    };
  }, [canvas]);
  
  // Apply performance optimizations
  const optimizeCanvas = useCallback(() => {
    if (!canvas || !isOptimizationEnabled) return;
    
    const objects = canvas.getObjects();
    const viewportBounds = {
      left: -canvas.viewportTransform![4] / canvas.getZoom(),
      top: -canvas.viewportTransform![5] / canvas.getZoom(),
      right: (-canvas.viewportTransform![4] + canvas.width!) / canvas.getZoom(),
      bottom: (-canvas.viewportTransform![5] + canvas.height!) / canvas.getZoom()
    };
    
    // Optimize object caching based on visibility
    objects.forEach(obj => {
      if (!obj) return;
      
      // Skip small objects
      const isTiny = obj.width! < 10 || obj.height! < 10;
      
      // Calculate if object is in viewport
      const isVisible = options.skipOffscreen !== false && (
        obj.left! + obj.width! * obj.scaleX! >= viewportBounds.left &&
        obj.top! + obj.height! * obj.scaleY! >= viewportBounds.top &&
        obj.left! <= viewportBounds.right &&
        obj.top! <= viewportBounds.bottom
      );
      
      // Optimize caching based on visibility and size
      if (options.objectCaching !== false) {
        obj.objectCaching = isVisible && !isTiny;
      }
      
      // Disable rendering for off-screen objects if configured
      if (options.skipOffscreen && !isVisible) {
        obj.visible = false;
      } else if (obj.visible === false && isVisible) {
        obj.visible = true;
      }
    });
    
    canvas.renderAll();
  }, [canvas, isOptimizationEnabled, options]);
  
  // Enable/disable optimizations
  const toggleOptimizations = useCallback((enabled: boolean) => {
    setIsOptimizationEnabled(enabled);
  }, []);
  
  // Apply optimizations when canvas or options change
  useEffect(() => {
    if (!canvas) return;
    
    const handleZoomOrPan = () => {
      optimizeCanvas();
    };
    
    canvas.on('mouse:wheel', handleZoomOrPan);
    canvas.on('mouse:down', handleZoomOrPan);
    canvas.on('mouse:up', handleZoomOrPan);
    
    return () => {
      canvas.off('mouse:wheel', handleZoomOrPan);
      canvas.off('mouse:down', handleZoomOrPan);
      canvas.off('mouse:up', handleZoomOrPan);
    };
  }, [canvas, optimizeCanvas]);
  
  return {
    renderStats,
    optimizeCanvas,
    toggleOptimizations,
    isOptimizationEnabled
  };
}
