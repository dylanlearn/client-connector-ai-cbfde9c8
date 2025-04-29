
/**
 * Memory Management Service
 * Handles efficient memory usage for canvas objects
 */
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

export interface MemoryStats {
  objectCount: number;
  estimatedMemoryUsage: number;
  inactivePoolSize: number;
  activePoolSize: number;
  gcRuns: number;
  timestamp: number;
}

export interface MemoryManagementOptions {
  autoGarbageCollection?: boolean;
  gcInterval?: number;
  maxInactiveTime?: number;
  objectPooling?: boolean;
  maxPoolSize?: number;
  memoryLimit?: number;
}

export interface ObjectPoolConfig {
  objectType: string;
  factory: () => fabric.Object;
  initialSize?: number;
  maxSize?: number;
}

class MemoryManagementService {
  private options: MemoryManagementOptions = {
    autoGarbageCollection: true,
    gcInterval: 30000, // 30 seconds
    maxInactiveTime: 60000, // 60 seconds
    objectPooling: true,
    maxPoolSize: 50,
    memoryLimit: 100 * 1024 * 1024 // 100MB
  };

  // Store last accessed timestamps for objects
  private objectAccessTimes: Map<fabric.Object, number> = new Map();
  // Store managed objects by canvas ID
  private managedObjects: Map<string, Set<fabric.Object>> = new Map();
  // Object pools by canvas ID and object type
  private objectPools: Map<string, Map<string, fabric.Object[]>> = new Map();

  private gcRuns: number = 0;
  private gcTimer: ReturnType<typeof setInterval> | null = null;
  private memoryStats: MemoryStats = {
    objectCount: 0,
    estimatedMemoryUsage: 0,
    inactivePoolSize: 0,
    activePoolSize: 0,
    gcRuns: 0,
    timestamp: Date.now()
  };

  /**
   * Configure memory management options
   */
  configure(options: Partial<MemoryManagementOptions>): void {
    this.options = { ...this.options, ...options };
    
    // Setup or clear garbage collection timer
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
      this.gcTimer = null;
    }
    
    if (this.options.autoGarbageCollection) {
      this.gcTimer = setInterval(() => this.runGarbageCollection(), this.options.gcInterval);
    }
    
    console.log('Memory management configured with options:', this.options);
  }

  /**
   * Initialize an object pool for a specific canvas
   */
  initializeObjectPool(canvasId: string, config: ObjectPoolConfig): void {
    const { objectType, factory, initialSize = 10, maxSize = this.options.maxPoolSize } = config;
    
    if (!this.objectPools.has(canvasId)) {
      this.objectPools.set(canvasId, new Map());
    }
    
    const canvasPools = this.objectPools.get(canvasId)!;
    const pool: fabric.Object[] = [];
    
    // Initialize pool with objects
    for (let i = 0; i < initialSize; i++) {
      const obj = factory();
      pool.push(obj);
    }
    
    canvasPools.set(objectType, pool);
    
    console.log(`Object pool initialized for ${objectType} with ${initialSize} objects`);
    this.updateMemoryStats();
  }

  /**
   * Acquire an object from a pool
   */
  acquireObject(canvasId: string, objectType: string): fabric.Object | null {
    const canvasPools = this.objectPools.get(canvasId);
    if (!canvasPools || !canvasPools.has(objectType)) {
      console.warn(`No object pool found for ${objectType} in canvas ${canvasId}`);
      return null;
    }
    
    const pool = canvasPools.get(objectType)!;
    let obj: fabric.Object | undefined = pool.pop();
    
    if (obj) {
      // Mark as accessed
      this.markObjectAccessed(obj);
      return obj;
    }
    
    console.warn(`Object pool for ${objectType} is empty`);
    return null;
  }

  /**
   * Release an object back to its pool
   */
  releaseObject(canvasId: string, obj: fabric.Object, objectType: string): void {
    const canvasPools = this.objectPools.get(canvasId);
    if (!canvasPools || !canvasPools.has(objectType)) {
      console.warn(`No object pool found for ${objectType} in canvas ${canvasId}`);
      return;
    }
    
    const pool = canvasPools.get(objectType)!;
    const maxSize = this.options.maxPoolSize || 50;
    
    // Only add to pool if not exceeding max size
    if (pool.length < maxSize) {
      // Reset object properties to a clean state
      if (obj.set) {
        obj.set({
          left: 0,
          top: 0,
          scaleX: 1,
          scaleY: 1,
          angle: 0,
          opacity: 1
        });
      }
      
      pool.push(obj);
    }
    
    this.updateMemoryStats();
  }

  /**
   * Register an object for memory management
   */
  registerObject(canvasId: string, obj: fabric.Object): void {
    if (!obj) return;
    
    if (!this.managedObjects.has(canvasId)) {
      this.managedObjects.set(canvasId, new Set());
    }
    
    const canvasObjects = this.managedObjects.get(canvasId)!;
    canvasObjects.add(obj);
    
    // Mark as recently accessed
    this.markObjectAccessed(obj);
    
    this.updateMemoryStats();
  }

  /**
   * Unregister an object from memory management
   */
  unregisterObject(canvasId: string, obj: fabric.Object): void {
    if (!obj) return;
    
    const canvasObjects = this.managedObjects.get(canvasId);
    if (!canvasObjects) return;
    
    canvasObjects.delete(obj);
    this.objectAccessTimes.delete(obj);
    
    this.updateMemoryStats();
  }

  /**
   * Mark an object as accessed (recently used)
   */
  markObjectAccessed(obj: fabric.Object): void {
    if (!obj) return;
    this.objectAccessTimes.set(obj, Date.now());
  }

  /**
   * Run garbage collection to free memory
   */
  runGarbageCollection(): void {
    const now = Date.now();
    let freedCount = 0;
    
    // Process each canvas's objects
    for (const [canvasId, objects] of this.managedObjects.entries()) {
      const toRemove: fabric.Object[] = [];
      
      for (const obj of objects) {
        const lastAccessed = this.objectAccessTimes.get(obj) || 0;
        
        // If object hasn't been accessed for maxInactiveTime, clean it up
        if (now - lastAccessed > (this.options.maxInactiveTime || 60000)) {
          toRemove.push(obj);
          freedCount++;
        }
      }
      
      // Remove identified objects
      for (const obj of toRemove) {
        objects.delete(obj);
        this.objectAccessTimes.delete(obj);
      }
    }
    
    this.gcRuns++;
    console.log(`Garbage collection run completed: ${freedCount} objects freed`);
    
    this.updateMemoryStats();
  }

  /**
   * Force garbage collection immediately
   */
  forceGarbageCollection(): void {
    this.runGarbageCollection();
  }

  /**
   * Clean up resources for a specific canvas
   */
  cleanupCanvas(canvasId: string): void {
    this.managedObjects.delete(canvasId);
    this.objectPools.delete(canvasId);
    this.updateMemoryStats();
  }

  /**
   * Update memory statistics
   */
  private updateMemoryStats(): void {
    let totalObjects = 0;
    let activeObjects = 0;
    let inactiveObjects = 0;
    
    // Count managed objects
    for (const objects of this.managedObjects.values()) {
      totalObjects += objects.size;
      activeObjects += objects.size;
    }
    
    // Count pool objects
    for (const canvasPools of this.objectPools.values()) {
      for (const pool of canvasPools.values()) {
        totalObjects += pool.length;
        inactiveObjects += pool.length;
      }
    }
    
    // Estimate memory usage (rough approximation)
    const avgObjectSize = 5000; // Assuming average of 5KB per object
    const estimatedMemory = totalObjects * avgObjectSize;
    
    this.memoryStats = {
      objectCount: totalObjects,
      estimatedMemoryUsage: estimatedMemory,
      activePoolSize: activeObjects,
      inactivePoolSize: inactiveObjects,
      gcRuns: this.gcRuns,
      timestamp: Date.now()
    };
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats(): MemoryStats {
    return { ...this.memoryStats };
  }
}

// Export singleton instance
const memoryManagementService = new MemoryManagementService();
export default memoryManagementService;
