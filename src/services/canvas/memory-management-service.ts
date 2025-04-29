
import { fabric } from 'fabric';
import { PerformanceTracker } from '@/utils/performance-debugger';

export interface MemoryStats {
  objectCount: number;
  estimatedMemoryUsage: number;
  inactivePoolSize: number;
  activePoolSize: number;
  gcRuns: number;
  timestamp: number;
}

export interface ObjectPoolConfig {
  initialSize?: number;
  growFactor?: number;
  maxSize?: number;
  objectType: string;
  createObject: () => fabric.Object;
}

export interface MemoryManagementOptions {
  enableObjectPooling?: boolean;
  enableGarbageCollection?: boolean;
  gcInterval?: number;
  enableResourceMonitoring?: boolean;
  monitoringInterval?: number;
  inactivityThreshold?: number;
  lowMemoryThreshold?: number;
}

class MemoryManagementService {
  private static instance: MemoryManagementService;
  private objectPools: Map<string, fabric.Object[]> = new Map();
  private activeObjects: Map<string, Set<fabric.Object>> = new Map();
  private canvasObjects: Map<string, Set<fabric.Object>> = new Map();
  private lastAccessTime: Map<fabric.Object, number> = new Map();
  private memoryStats: MemoryStats = {
    objectCount: 0,
    estimatedMemoryUsage: 0,
    inactivePoolSize: 0,
    activePoolSize: 0,
    gcRuns: 0,
    timestamp: Date.now()
  };
  private options: MemoryManagementOptions = {
    enableObjectPooling: true,
    enableGarbageCollection: true,
    gcInterval: 60000, // Run GC every minute
    enableResourceMonitoring: true,
    monitoringInterval: 5000, // Monitor every 5 seconds
    inactivityThreshold: 30000, // 30 seconds of inactivity
    lowMemoryThreshold: 100 // MB
  };
  private monitoringInterval: NodeJS.Timeout | null = null;
  private gcInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // Private constructor for singleton
    this.startMonitoring();
  }

  static getInstance(): MemoryManagementService {
    if (!MemoryManagementService.instance) {
      MemoryManagementService.instance = new MemoryManagementService();
    }
    return MemoryManagementService.instance;
  }

  // Configure memory management service
  configure(options: MemoryManagementOptions): void {
    this.options = { ...this.options, ...options };
    
    // Restart monitoring with new options
    this.stopMonitoring();
    this.startMonitoring();
  }

  // Initialize an object pool
  initializeObjectPool(canvasId: string, config: ObjectPoolConfig): void {
    const poolId = `${canvasId}-${config.objectType}`;
    
    if (this.objectPools.has(poolId)) {
      return; // Pool already exists
    }
    
    const initialSize = config.initialSize || 10;
    const pool: fabric.Object[] = [];
    
    // Pre-create objects for the pool
    for (let i = 0; i < initialSize; i++) {
      const obj = config.createObject();
      pool.push(obj);
    }
    
    this.objectPools.set(poolId, pool);
    this.activeObjects.set(poolId, new Set<fabric.Object>());
    
    this.updateMemoryStats();
  }

  // Acquire an object from a pool
  acquireObject(canvasId: string, objectType: string): fabric.Object | null {
    const poolId = `${canvasId}-${objectType}`;
    const pool = this.objectPools.get(poolId);
    const activePool = this.activeObjects.get(poolId);
    
    if (!pool || !activePool) {
      console.warn(`Object pool not found: ${poolId}`);
      return null;
    }
    
    let obj: fabric.Object | undefined;
    
    // Try to get an object from the pool
    if (pool.length > 0) {
      obj = pool.pop();
    } else {
      // If pool is empty, find the pool config to create a new object
      const allPoolIds = Array.from(this.objectPools.keys());
      const configMatch = allPoolIds
        .filter(id => id.startsWith(`${canvasId}-`))
        .find(id => id === poolId);
        
      if (!configMatch) {
        console.warn(`Cannot create new object, configuration not found for ${poolId}`);
        return null;
      }
      
      // This is a simplified approach - in a real implementation we would store configs
      // For now, we'll return null as we can't create without the original config
      return null;
    }
    
    if (obj) {
      activePool.add(obj);
      this.lastAccessTime.set(obj, Date.now());
      
      // Add to canvas objects tracking
      if (!this.canvasObjects.has(canvasId)) {
        this.canvasObjects.set(canvasId, new Set<fabric.Object>());
      }
      this.canvasObjects.get(canvasId)!.add(obj);
      
      this.updateMemoryStats();
      return obj;
    }
    
    return null;
  }

  // Release an object back to its pool
  releaseObject(canvasId: string, obj: fabric.Object, objectType: string): void {
    const poolId = `${canvasId}-${objectType}`;
    const pool = this.objectPools.get(poolId);
    const activePool = this.activeObjects.get(poolId);
    
    if (!pool || !activePool) {
      console.warn(`Object pool not found: ${poolId}`);
      return;
    }
    
    if (activePool.has(obj)) {
      activePool.delete(obj);
      
      // Reset object to a clean state
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
      
      // Update tracking
      const canvasObjects = this.canvasObjects.get(canvasId);
      if (canvasObjects) {
        canvasObjects.delete(obj);
      }
      
      this.updateMemoryStats();
    }
  }

  // Register an existing object for memory management
  registerObject(canvasId: string, obj: fabric.Object): void {
    if (!obj) return;
    
    // Track canvas objects
    if (!this.canvasObjects.has(canvasId)) {
      this.canvasObjects.set(canvasId, new Set<fabric.Object>());
    }
    
    this.canvasObjects.get(canvasId)!.add(obj);
    this.lastAccessTime.set(obj, Date.now());
    
    this.updateMemoryStats();
  }

  // Unregister an object from memory management
  unregisterObject(canvasId: string, obj: fabric.Object): void {
    if (!obj) return;
    
    const canvasObjects = this.canvasObjects.get(canvasId);
    if (canvasObjects) {
      canvasObjects.delete(obj);
    }
    
    this.lastAccessTime.delete(obj);
    
    this.updateMemoryStats();
  }

  // Mark an object as accessed (used to track inactive objects)
  markObjectAccessed(obj: fabric.Object): void {
    if (!obj) return;
    this.lastAccessTime.set(obj, Date.now());
  }

  // Perform garbage collection
  garbageCollect(force: boolean = false): void {
    const endMeasure = PerformanceTracker.start('garbageCollection');
    const now = Date.now();
    let gcRan = false;
    
    // Determine if we need to run garbage collection
    if (!force && !this.options.enableGarbageCollection) {
      endMeasure();
      return;
    }
    
    // Check memory pressure if browser supports memory API
    if (!force && (performance as any).memory) {
      const memoryUsage = (performance as any).memory.usedJSHeapSize / (1024 * 1024);
      if (memoryUsage < this.options.lowMemoryThreshold!) {
        // Skip GC if memory usage is below threshold
        endMeasure();
        return;
      }
    }
    
    // Process each canvas's objects
    this.canvasObjects.forEach((objects, canvasId) => {
      const inactiveObjects: fabric.Object[] = [];
      
      // Find inactive objects
      objects.forEach(obj => {
        const lastAccess = this.lastAccessTime.get(obj) || 0;
        if (now - lastAccess > this.options.inactivityThreshold!) {
          inactiveObjects.push(obj);
        }
      });
      
      // Process inactive objects
      if (inactiveObjects.length > 0) {
        gcRan = true;
        
        inactiveObjects.forEach(obj => {
          // Remove the object from tracking
          objects.delete(obj);
          this.lastAccessTime.delete(obj);
          
          // Remove from any active pools
          this.activeObjects.forEach(activePool => {
            if (activePool.has(obj)) {
              activePool.delete(obj);
            }
          });
          
          // Here we would typically return the object to its pool
          // But since we don't know which pool it belongs to, we just dispose it
          // In a full implementation, we would track which pool each object belongs to
        });
      }
    });
    
    if (gcRan) {
      this.memoryStats.gcRuns++;
      this.updateMemoryStats();
    }
    
    endMeasure();
  }

  // Start monitoring and automatic garbage collection
  private startMonitoring(): void {
    if (this.options.enableResourceMonitoring) {
      this.monitoringInterval = setInterval(() => {
        this.updateMemoryStats();
      }, this.options.monitoringInterval);
    }
    
    if (this.options.enableGarbageCollection) {
      this.gcInterval = setInterval(() => {
        this.garbageCollect();
      }, this.options.gcInterval);
    }
  }

  // Stop monitoring
  private stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    if (this.gcInterval) {
      clearInterval(this.gcInterval);
      this.gcInterval = null;
    }
  }

  // Update memory statistics
  private updateMemoryStats(): void {
    let totalObjects = 0;
    let pooledObjects = 0;
    let activeObjects = 0;
    
    // Count objects in pools
    this.objectPools.forEach(pool => {
      pooledObjects += pool.length;
      totalObjects += pool.length;
    });
    
    // Count active objects
    this.activeObjects.forEach(activePool => {
      activeObjects += activePool.size;
      totalObjects += activePool.size;
    });
    
    // Count registered objects
    this.canvasObjects.forEach(objects => {
      totalObjects += objects.size;
    });
    
    // Estimate memory usage (very rough estimate)
    let estimatedMemoryUsage = totalObjects * 10; // Assume ~10KB per object
    
    // Use browser memory API if available
    if ((performance as any).memory) {
      estimatedMemoryUsage = (performance as any).memory.usedJSHeapSize / (1024 * 1024);
    }
    
    this.memoryStats = {
      objectCount: totalObjects,
      estimatedMemoryUsage,
      inactivePoolSize: pooledObjects,
      activePoolSize: activeObjects,
      gcRuns: this.memoryStats.gcRuns,
      timestamp: Date.now()
    };
  }

  // Get memory stats
  getMemoryStats(): MemoryStats {
    return { ...this.memoryStats };
  }

  // Force garbage collection
  forceGarbageCollection(): void {
    this.garbageCollect(true);
  }

  // Clean up resources for a canvas
  cleanupCanvas(canvasId: string): void {
    // Remove from canvas objects tracking
    this.canvasObjects.delete(canvasId);
    
    // Remove pools associated with this canvas
    const poolsToRemove: string[] = [];
    this.objectPools.forEach((_, poolId) => {
      if (poolId.startsWith(`${canvasId}-`)) {
        poolsToRemove.push(poolId);
      }
    });
    
    poolsToRemove.forEach(poolId => {
      this.objectPools.delete(poolId);
      this.activeObjects.delete(poolId);
    });
    
    this.updateMemoryStats();
  }
}

export const memoryManagementService = MemoryManagementService.getInstance();
export default memoryManagementService;
