
import { fabric } from 'fabric';

export interface MemoryStats {
  objectCount: number;
  estimatedMemoryUsage: number;
  inactivePoolSize: number;
  activePoolSize: number;
  gcRuns: number;
  timestamp: number;
}

export interface ObjectPoolConfig {
  type: string;
  initialSize: number;
  maxSize: number;
  factoryFn: () => fabric.Object;
}

export interface MemoryManagementOptions {
  poolingEnabled?: boolean;
  gcIntervalMs?: number;
  inactivityThresholdMs?: number;
  maxPoolSize?: number;
  retentionPolicy?: 'lru' | 'fifo';
}

// Types for internal tracking
interface TrackedObject {
  object: fabric.Object;
  lastAccessed: number;
  memoryEstimate: number;
}

interface ObjectPool {
  type: string;
  objects: fabric.Object[];
  factoryFn: () => fabric.Object;
  maxSize: number;
}

// Object tracking by canvas
type CanvasMemoryRegistry = Record<string, {
  trackedObjects: Map<string, TrackedObject>;
  pools: Map<string, ObjectPool>;
  stats: MemoryStats;
  gcIntervalId: number | null;
}>;

class MemoryManagementService {
  private options: MemoryManagementOptions = {
    poolingEnabled: true,
    gcIntervalMs: 30000,
    inactivityThresholdMs: 60000,
    maxPoolSize: 100,
    retentionPolicy: 'lru'
  };
  
  private canvasRegistry: CanvasMemoryRegistry = {};
  private totalGcRuns = 0;
  
  // Configure options
  public configure(options: MemoryManagementOptions): void {
    this.options = { ...this.options, ...options };
    
    // Update GC intervals for existing canvases
    Object.entries(this.canvasRegistry).forEach(([canvasId, registry]) => {
      if (registry.gcIntervalId) {
        clearInterval(registry.gcIntervalId);
      }
      
      if (this.options.gcIntervalMs) {
        registry.gcIntervalId = window.setInterval(
          () => this.runGarbageCollection(canvasId),
          this.options.gcIntervalMs
        );
      }
    });
  }
  
  // Initialize for a new canvas
  public initializeCanvas(canvasId: string): void {
    this.canvasRegistry[canvasId] = {
      trackedObjects: new Map<string, TrackedObject>(),
      pools: new Map<string, ObjectPool>(),
      stats: {
        objectCount: 0,
        estimatedMemoryUsage: 0,
        inactivePoolSize: 0,
        activePoolSize: 0,
        gcRuns: 0,
        timestamp: Date.now()
      },
      gcIntervalId: null
    };
    
    // Set up garbage collection interval
    if (this.options.gcIntervalMs) {
      this.canvasRegistry[canvasId].gcIntervalId = window.setInterval(
        () => this.runGarbageCollection(canvasId),
        this.options.gcIntervalMs
      );
    }
  }
  
  // Initialize an object pool
  public initializeObjectPool(canvasId: string, config: ObjectPoolConfig): void {
    if (!this.canvasRegistry[canvasId]) {
      this.initializeCanvas(canvasId);
    }
    
    const registry = this.canvasRegistry[canvasId];
    
    // Create the pool
    const pool: ObjectPool = {
      type: config.type,
      objects: [],
      factoryFn: config.factoryFn,
      maxSize: config.maxSize
    };
    
    // Pre-create objects if initial size is specified
    for (let i = 0; i < config.initialSize; i++) {
      const obj = config.factoryFn();
      pool.objects.push(obj);
      this.estimateObjectMemory(obj);
    }
    
    // Update stats
    registry.stats.inactivePoolSize += pool.objects.length;
    
    // Store the pool
    registry.pools.set(config.type, pool);
  }
  
  // Acquire an object from a pool
  public acquireObject(canvasId: string, objectType: string): fabric.Object {
    if (!this.canvasRegistry[canvasId]) {
      this.initializeCanvas(canvasId);
    }
    
    const registry = this.canvasRegistry[canvasId];
    const pool = registry.pools.get(objectType);
    
    if (!pool || pool.objects.length === 0) {
      // No pool or empty pool, create a new object
      const obj = pool ? pool.factoryFn() : this.createDefaultObject();
      this.registerObject(canvasId, obj);
      return obj;
    }
    
    // Get object from pool
    const obj = pool.objects.pop()!;
    registry.stats.inactivePoolSize--;
    registry.stats.activePoolSize++;
    
    // Track the object
    const objId = this.getObjectId(obj);
    registry.trackedObjects.set(objId, {
      object: obj,
      lastAccessed: Date.now(),
      memoryEstimate: this.estimateObjectMemory(obj)
    });
    
    return obj;
  }
  
  // Release an object back to its pool
  public releaseObject(canvasId: string, obj: fabric.Object, objectType: string): void {
    if (!this.canvasRegistry[canvasId]) return;
    
    const registry = this.canvasRegistry[canvasId];
    const pool = registry.pools.get(objectType);
    
    if (!pool) return;
    
    // Remove from tracked objects
    const objId = this.getObjectId(obj);
    registry.trackedObjects.delete(objId);
    
    // Clean up object state
    obj.set({
      left: 0,
      top: 0,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false
    });
    
    // Only add to pool if not at max capacity
    if (pool.objects.length < pool.maxSize) {
      pool.objects.push(obj);
      registry.stats.inactivePoolSize++;
    }
    
    registry.stats.activePoolSize--;
  }
  
  // Register an object for memory tracking
  public registerObject(canvasId: string, obj: fabric.Object): void {
    if (!this.canvasRegistry[canvasId]) {
      this.initializeCanvas(canvasId);
    }
    
    const registry = this.canvasRegistry[canvasId];
    const objId = this.getObjectId(obj);
    
    // Track the object
    registry.trackedObjects.set(objId, {
      object: obj,
      lastAccessed: Date.now(),
      memoryEstimate: this.estimateObjectMemory(obj)
    });
    
    // Update stats
    registry.stats.objectCount = registry.trackedObjects.size;
    registry.stats.estimatedMemoryUsage += registry.trackedObjects.get(objId)!.memoryEstimate;
    registry.stats.activePoolSize++;
  }
  
  // Unregister an object from memory tracking
  public unregisterObject(canvasId: string, obj: fabric.Object): void {
    if (!this.canvasRegistry[canvasId]) return;
    
    const registry = this.canvasRegistry[canvasId];
    const objId = this.getObjectId(obj);
    
    if (registry.trackedObjects.has(objId)) {
      const trackedObj = registry.trackedObjects.get(objId)!;
      
      // Update stats
      registry.stats.estimatedMemoryUsage -= trackedObj.memoryEstimate;
      registry.stats.activePoolSize--;
      
      // Remove from tracking
      registry.trackedObjects.delete(objId);
      registry.stats.objectCount = registry.trackedObjects.size;
    }
  }
  
  // Mark an object as accessed
  public markObjectAccessed(obj: fabric.Object): void {
    // Find the canvas this object belongs to
    for (const [canvasId, registry] of Object.entries(this.canvasRegistry)) {
      const objId = this.getObjectId(obj);
      
      if (registry.trackedObjects.has(objId)) {
        const trackedObj = registry.trackedObjects.get(objId)!;
        trackedObj.lastAccessed = Date.now();
        break;
      }
    }
  }
  
  // Run garbage collection
  private runGarbageCollection(canvasId: string): void {
    const registry = this.canvasRegistry[canvasId];
    if (!registry) return;
    
    const now = Date.now();
    const inactiveThreshold = now - (this.options.inactivityThresholdMs || 60000);
    let removedCount = 0;
    
    // Find inactive objects
    registry.trackedObjects.forEach((trackedObj, objId) => {
      if (trackedObj.lastAccessed < inactiveThreshold) {
        // Object hasn't been accessed recently
        // In a real implementation, we might check if it's visible/on-screen
        // For now we'll just track stats
        removedCount++;
      }
    });
    
    // Update stats
    registry.stats.gcRuns++;
    this.totalGcRuns++;
    registry.stats.timestamp = now;
  }
  
  // Force garbage collection
  public forceGarbageCollection(): void {
    Object.keys(this.canvasRegistry).forEach(canvasId => {
      this.runGarbageCollection(canvasId);
    });
  }
  
  // Get memory statistics
  public getMemoryStats(): MemoryStats {
    let objectCount = 0;
    let estimatedMemoryUsage = 0;
    let inactivePoolSize = 0;
    let activePoolSize = 0;
    let gcRuns = 0;
    
    // Aggregate stats from all canvases
    Object.values(this.canvasRegistry).forEach(registry => {
      objectCount += registry.stats.objectCount;
      estimatedMemoryUsage += registry.stats.estimatedMemoryUsage;
      inactivePoolSize += registry.stats.inactivePoolSize;
      activePoolSize += registry.stats.activePoolSize;
      gcRuns += registry.stats.gcRuns;
    });
    
    return {
      objectCount,
      estimatedMemoryUsage,
      inactivePoolSize,
      activePoolSize,
      gcRuns,
      timestamp: Date.now()
    };
  }
  
  // Cleanup canvas resources
  public cleanupCanvas(canvasId: string): void {
    const registry = this.canvasRegistry[canvasId];
    if (!registry) return;
    
    // Clear GC interval
    if (registry.gcIntervalId) {
      clearInterval(registry.gcIntervalId);
    }
    
    // Remove from registry
    delete this.canvasRegistry[canvasId];
  }
  
  // Helper methods
  
  // Estimate memory usage of an object
  private estimateObjectMemory(obj: fabric.Object): number {
    let estimate = 1000; // Base size for any object
    
    // Size based on dimensions
    if (obj.width && obj.height) {
      estimate += obj.width * obj.height * 4; // RGBA pixels
    }
    
    // Add extra for complex objects
    if (obj instanceof fabric.Group) {
      estimate += 2000;
    } else if (obj instanceof fabric.Text) {
      estimate += obj.text?.length * 2 || 0;
    } else if (obj instanceof fabric.Path) {
      estimate += 3000;
    }
    
    return estimate;
  }
  
  // Get a unique ID for an object
  private getObjectId(obj: fabric.Object): string {
    // Use fabric's internal ID or generate one
    return obj.id?.toString() || Math.random().toString(36).substr(2, 9);
  }
  
  // Create a default object for when a pool doesn't exist
  private createDefaultObject(): fabric.Object {
    return new fabric.Rect({
      width: 50,
      height: 50,
      fill: '#ccc',
      left: 0,
      top: 0
    });
  }
}

// Create singleton instance
const memoryManagementService = new MemoryManagementService();
export default memoryManagementService;
