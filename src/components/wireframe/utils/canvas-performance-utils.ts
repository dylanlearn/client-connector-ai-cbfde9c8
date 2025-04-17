
import { fabric } from 'fabric';

/**
 * Canvas object pool for recycling fabric.js objects
 */
export class CanvasObjectPool {
  private pools: Map<string, fabric.Object[]> = new Map();
  private maxPoolSize: number = 100;

  /**
   * Get an object from the pool or create a new one
   */
  public getObject<T extends fabric.Object>(
    type: string, 
    createFn: () => T, 
    initializeFn?: (obj: T) => void
  ): T {
    // Get pool for this type
    const pool = this.pools.get(type) || [];
    
    // Get an object from the pool or create a new one
    const object = pool.pop() as T || createFn();
    
    // Initialize the object if needed
    if (initializeFn && object) {
      initializeFn(object);
    }
    
    return object;
  }

  /**
   * Return an object to the pool
   */
  public releaseObject(type: string, object: fabric.Object): void {
    // Reset object properties
    object.set({
      left: 0,
      top: 0,
      width: 1,
      height: 1,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      opacity: 1,
      visible: true,
      hasControls: true,
      hasBorders: true,
      selectable: true,
      evented: true,
      stroke: undefined,
      strokeWidth: 1,
      fill: '#000000',
    });
    
    // Get or create pool for this type
    let pool = this.pools.get(type);
    if (!pool) {
      pool = [];
      this.pools.set(type, pool);
    }
    
    // Add to pool if not full
    if (pool.length < this.maxPoolSize) {
      pool.push(object);
    }
  }

  /**
   * Set maximum pool size
   */
  public setMaxPoolSize(size: number): void {
    this.maxPoolSize = size;
    
    // Trim pools if they exceed the new size
    this.pools.forEach((pool, type) => {
      if (pool.length > size) {
        this.pools.set(type, pool.slice(0, size));
      }
    });
  }

  /**
   * Clear all pools
   */
  public clear(): void {
    this.pools.clear();
  }
}

/**
 * Optimize a fabric canvas by reducing memory usage and improving rendering performance
 */
export function optimizeCanvas(canvas: fabric.Canvas): void {
  if (!canvas) return;
  
  // Get all objects
  const objects = canvas.getObjects();
  
  // Optimize each object
  objects.forEach(obj => {
    // Enable object caching for complex objects
    if (obj.type === 'path' || obj.type === 'group' || 
        (obj as any).complexity && (obj as any).complexity() > 10) {
      obj.objectCaching = true;
    } else {
      // For simple objects, caching might be unnecessary
      obj.objectCaching = false;
    }
    
    // Clear selections to allow GC to reclaim memory
    canvas.discardActiveObject();
  });
  
  // Force garbage collection in some browsers (not standardized)
  if (window.gc) {
    try {
      window.gc();
    } catch (e) {
      console.debug('Manual garbage collection failed');
    }
  }
  
  // Render all changes
  canvas.renderAll();
}

/**
 * Create a cloned lightweight version of the canvas for export/rendering
 * This helps avoid memory leaks when generating multiple views
 */
export function createLightweightCanvasClone(
  sourceCanvas: fabric.Canvas,
  includeObjects: boolean = true
): fabric.Canvas {
  // Create a new canvas element
  const canvasElement = document.createElement('canvas');
  canvasElement.width = sourceCanvas.getWidth() || 1;
  canvasElement.height = sourceCanvas.getHeight() || 1;
  
  // Create fabric canvas with minimal options
  const clonedCanvas = new fabric.Canvas(canvasElement, {
    renderOnAddRemove: false,
    selection: false,
    skipOffscreen: true
  });
  
  // Copy background color
  clonedCanvas.backgroundColor = sourceCanvas.backgroundColor;
  
  if (includeObjects) {
    // Clone only visible objects
    const visibleObjects = sourceCanvas.getObjects().filter(obj => obj.visible);
    
    // Clone each object
    visibleObjects.forEach(obj => {
      obj.clone((clonedObj: fabric.Object) => {
        clonedObj.set({
          left: obj.left,
          top: obj.top,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true
        });
        
        clonedCanvas.add(clonedObj);
      });
    });
  }
  
  // Render the clone
  clonedCanvas.renderAll();
  
  return clonedCanvas;
}

/**
 * Measure rendering performance of a canvas
 */
export function measureCanvasPerformance(canvas: fabric.Canvas): {
  objectCount: number;
  renderTime: number;
  memoryUsage?: number;
} {
  if (!canvas) {
    return { objectCount: 0, renderTime: 0 };
  }
  
  const objectCount = canvas.getObjects().length;
  const startTime = performance.now();
  
  // Force a render and measure time
  canvas.renderAll();
  const renderTime = performance.now() - startTime;
  
  // Try to get memory usage if available (Chrome only)
  const memoryUsage = window.performance && 
                     (performance as any).memory ? 
                     Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024)) : 
                     undefined;
  
  return {
    objectCount,
    renderTime,
    memoryUsage
  };
}
