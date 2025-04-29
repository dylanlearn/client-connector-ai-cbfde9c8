
import { useRef, useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { useOptimizedCanvas, UseOptimizedCanvasOptions } from './use-optimized-canvas';
import { useMemoryManagedCanvas, UseMemoryManagedCanvasOptions } from './use-memory-managed-canvas';
import { v4 as uuidv4 } from 'uuid';
import { RenderingMetrics } from '@/services/canvas/canvas-optimization-service';
import { MemoryStats } from '@/services/canvas/memory-management-service';

export interface HighPerformanceOptions extends UseOptimizedCanvasOptions {
  memoryOptions?: UseMemoryManagedCanvasOptions;
}

export interface PerformanceMetrics {
  rendering: RenderingMetrics;
  memory: MemoryStats;
}

export function useHighPerformanceCanvas(options: HighPerformanceOptions = {}) {
  const canvasId = useRef<string>(options.id || `canvas-${uuidv4()}`);
  
  // Use our optimization and memory management hooks
  const { 
    canvasRef, 
    canvas, 
    metrics: renderMetrics,
    renderCanvas, 
    updateDimensions 
  } = useOptimizedCanvas({
    ...options,
    id: canvasId.current
  });
  
  const {
    memoryStats,
    initializeObjectPool,
    acquireObject,
    releaseObject,
    registerObject,
    unregisterObject,
    markObjectAccessed,
    forceGarbageCollection
  } = useMemoryManagedCanvas({
    id: canvasId.current,
    ...options.memoryOptions
  });

  // Combined performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    rendering: renderMetrics,
    memory: memoryStats
  });

  // Update combined metrics
  useEffect(() => {
    setPerformanceMetrics({
      rendering: renderMetrics,
      memory: memoryStats
    });
  }, [renderMetrics, memoryStats]);

  // Register objects with memory management when added to canvas
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectAdded = (e: fabric.IEvent) => {
      if (e.target) {
        registerObject(e.target);
      }
    };
    
    const handleObjectRemoved = (e: fabric.IEvent) => {
      if (e.target) {
        unregisterObject(e.target);
      }
    };
    
    const handleObjectModified = (e: fabric.IEvent) => {
      if (e.target) {
        markObjectAccessed(e.target);
      }
    };
    
    // Register for canvas events
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:moving', handleObjectModified);
    canvas.on('object:scaling', handleObjectModified);
    canvas.on('object:rotating', handleObjectModified);
    canvas.on('mouse:down', (e) => {
      if (e.target) markObjectAccessed(e.target);
    });
    
    return () => {
      // Clean up event handlers
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:moving', handleObjectModified);
      canvas.off('object:scaling', handleObjectModified);
      canvas.off('object:rotating', handleObjectModified);
      canvas.off('mouse:down');
    };
  }, [canvas, registerObject, unregisterObject, markObjectAccessed]);

  // Add an object with memory management
  const addObject = useCallback((obj: fabric.Object, registerForMemory = true) => {
    if (!canvas) return;
    
    canvas.add(obj);
    
    if (registerForMemory) {
      registerObject(obj);
    }
    
    renderCanvas();
  }, [canvas, registerObject, renderCanvas]);

  // Remove an object with memory management
  const removeObject = useCallback((obj: fabric.Object, unregisterFromMemory = true) => {
    if (!canvas) return;
    
    canvas.remove(obj);
    
    if (unregisterFromMemory) {
      unregisterObject(obj);
    }
    
    renderCanvas();
  }, [canvas, unregisterObject, renderCanvas]);

  // Optimize the canvas performance
  const optimizeCanvas = useCallback(() => {
    // Already handled by the optimization service
    renderCanvas();
  }, [renderCanvas]);

  // Clean up memory resources
  const cleanupResources = useCallback(() => {
    forceGarbageCollection();
  }, [forceGarbageCollection]);

  return {
    canvasRef,
    canvas,
    canvasId: canvasId.current,
    performanceMetrics,
    renderCanvas,
    updateDimensions,
    addObject,
    removeObject,
    optimizeCanvas,
    cleanupResources,
    // Memory management
    initializeObjectPool,
    acquireObject,
    releaseObject,
    registerObject,
    unregisterObject
  };
}

export default useHighPerformanceCanvas;
