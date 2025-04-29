
import { useRef, useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import memoryManagementService, { 
  MemoryStats, 
  MemoryManagementOptions,
  ObjectPoolConfig 
} from '@/services/canvas/memory-management-service';
import { v4 as uuidv4 } from 'uuid';

export interface UseMemoryManagedCanvasOptions {
  id?: string;
  memoryOptions?: MemoryManagementOptions;
}

export function useMemoryManagedCanvas({
  id,
  memoryOptions
}: UseMemoryManagedCanvasOptions = {}) {
  const canvasId = useRef<string>(id || `canvas-${uuidv4()}`);
  const [memoryStats, setMemoryStats] = useState<MemoryStats>({
    objectCount: 0,
    estimatedMemoryUsage: 0,
    inactivePoolSize: 0,
    activePoolSize: 0,
    gcRuns: 0,
    timestamp: Date.now()
  });
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize memory management
  useEffect(() => {
    if (memoryOptions) {
      memoryManagementService.configure(memoryOptions);
    }
    
    const statsInterval = setInterval(() => {
      setMemoryStats(memoryManagementService.getMemoryStats());
    }, 1000);
    
    setIsInitialized(true);
    
    return () => {
      clearInterval(statsInterval);
      memoryManagementService.cleanupCanvas(canvasId.current);
    };
  }, [memoryOptions]);

  // Initialize an object pool
  const initializeObjectPool = useCallback((config: ObjectPoolConfig) => {
    memoryManagementService.initializeObjectPool(canvasId.current, config);
  }, []);

  // Acquire an object from a pool
  const acquireObject = useCallback((objectType: string) => {
    return memoryManagementService.acquireObject(canvasId.current, objectType);
  }, []);

  // Release an object back to its pool
  const releaseObject = useCallback((obj: fabric.Object, objectType: string) => {
    memoryManagementService.releaseObject(canvasId.current, obj, objectType);
  }, []);

  // Register an existing object for memory management
  const registerObject = useCallback((obj: fabric.Object) => {
    memoryManagementService.registerObject(canvasId.current, obj);
  }, []);

  // Unregister an object from memory management
  const unregisterObject = useCallback((obj: fabric.Object) => {
    memoryManagementService.unregisterObject(canvasId.current, obj);
  }, []);

  // Mark an object as accessed
  const markObjectAccessed = useCallback((obj: fabric.Object) => {
    memoryManagementService.markObjectAccessed(obj);
  }, []);

  // Force garbage collection
  const forceGarbageCollection = useCallback(() => {
    memoryManagementService.forceGarbageCollection();
  }, []);

  return {
    canvasId: canvasId.current,
    memoryStats,
    isInitialized,
    initializeObjectPool,
    acquireObject,
    releaseObject,
    registerObject,
    unregisterObject,
    markObjectAccessed,
    forceGarbageCollection
  };
}

export default useMemoryManagedCanvas;
