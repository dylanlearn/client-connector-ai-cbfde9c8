
import { fabric } from 'fabric';

export interface RenderingMetrics {
  frameRate: number;
  renderTime: number;
  objectCount: number;
}

export interface CanvasOptimizationOptions {
  enableLayerCaching?: boolean;
  enableIncrementalRendering?: boolean;
  enableHardwareAcceleration?: boolean;
  autoOptimize?: boolean;
  objectThreshold?: number;
  optimizationInterval?: number;
}

type CanvasRegistry = Record<string, {
  canvas: fabric.Canvas;
  options: CanvasOptimizationOptions;
  metrics: RenderingMetrics;
  lastRenderTime: number;
  frameCount: number;
  lastFrameTimestamp: number;
}>;

class CanvasOptimizationService {
  private options: CanvasOptimizationOptions = {
    enableLayerCaching: true,
    enableIncrementalRendering: true,
    enableHardwareAcceleration: true,
    autoOptimize: true,
    objectThreshold: 100,
    optimizationInterval: 500
  };
  
  private canvasRegistry: CanvasRegistry = {};
  private animationFrameRequestId: number | null = null;
  
  // Configure global optimization options
  public configure(options: CanvasOptimizationOptions): void {
    this.options = { ...this.options, ...options };
    
    // Apply to any existing registered canvases
    Object.values(this.canvasRegistry).forEach(entry => {
      entry.options = { ...entry.options, ...options };
    });
  }
  
  // Initialize a canvas with optimizations
  public initializeCanvas(canvas: fabric.Canvas, id: string): void {
    // Register the canvas
    this.canvasRegistry[id] = {
      canvas,
      options: { ...this.options },
      metrics: {
        frameRate: 60,
        renderTime: 0,
        objectCount: canvas.getObjects().length
      },
      lastRenderTime: 0,
      frameCount: 0,
      lastFrameTimestamp: performance.now()
    };
    
    // Apply hardware acceleration if enabled
    if (this.options.enableHardwareAcceleration) {
      this.applyHardwareAcceleration(canvas);
    }
    
    // Apply layer caching if enabled
    if (this.options.enableLayerCaching) {
      this.applyLayerCaching(canvas);
    }
    
    // Start performance monitoring
    this.startMonitoring();
  }
  
  // Apply hardware acceleration
  private applyHardwareAcceleration(canvas: fabric.Canvas): void {
    // Access the canvas element
    const canvasEl = canvas.lowerCanvasEl;
    if (canvasEl) {
      // Force GPU acceleration
      canvasEl.style.transform = 'translateZ(0)';
      canvasEl.style.backfaceVisibility = 'hidden';
      
      // Optional: use webkitBackingStorePixelRatio for retina displays
      const ctx = canvasEl.getContext('2d');
      if (ctx) {
        // Force subpixel rendering
        ctx.imageSmoothingEnabled = true;
        // For Safari
        (ctx as any).webkitImageSmoothingEnabled = true;
      }
    }
  }
  
  // Apply layer caching
  private applyLayerCaching(canvas: fabric.Canvas): void {
    // Configure caching properties for all objects
    canvas.getObjects().forEach(obj => {
      if (this.shouldCacheObject(obj)) {
        // Disable automatic cache invalidation
        obj.objectCaching = true;
        obj.statefullCache = false;
        obj.noScaleCache = false;
        
        // Force regeneration of cache
        obj.dirty = true;
      }
    });
    
    // Override the object addition to apply caching to new objects
    const originalAdd = canvas.add.bind(canvas);
    canvas.add = function(...objects: fabric.Object[]) {
      objects.forEach(obj => {
        if (this.shouldCacheObject(obj)) {
          obj.objectCaching = true;
        }
      });
      return originalAdd(...objects);
    }.bind(canvas);
  }
  
  // Determine if an object should be cached
  private shouldCacheObject(obj: fabric.Object): boolean {
    // Only cache objects that are expensive to render
    const isComplex = obj instanceof fabric.Group || 
                      obj instanceof fabric.Path || 
                      obj instanceof fabric.Text;
    
    return isComplex || 
           (obj.width && obj.width > 100) || 
           (obj.height && obj.height > 100);
  }
  
  // Start performance monitoring
  private startMonitoring(): void {
    if (this.animationFrameRequestId === null) {
      const monitorFrameRate = () => {
        const timestamp = performance.now();
        
        Object.entries(this.canvasRegistry).forEach(([id, entry]) => {
          // Update frame count and timestamp
          entry.frameCount++;
          
          // Calculate FPS every second
          if (timestamp - entry.lastFrameTimestamp >= 1000) {
            const fps = entry.frameCount * 1000 / (timestamp - entry.lastFrameTimestamp);
            entry.metrics.frameRate = fps;
            entry.frameCount = 0;
            entry.lastFrameTimestamp = timestamp;
            entry.metrics.objectCount = entry.canvas.getObjects().length;
            
            // Auto-optimize if needed
            if (entry.options.autoOptimize && 
                entry.metrics.frameRate < 30 && 
                entry.metrics.objectCount > (entry.options.objectThreshold || 100)) {
              this.optimizeCanvas(id);
            }
          }
        });
        
        this.animationFrameRequestId = requestAnimationFrame(monitorFrameRate);
      };
      
      this.animationFrameRequestId = requestAnimationFrame(monitorFrameRate);
    }
  }
  
  // Stop performance monitoring
  private stopMonitoring(): void {
    if (this.animationFrameRequestId !== null) {
      cancelAnimationFrame(this.animationFrameRequestId);
      this.animationFrameRequestId = null;
    }
  }
  
  // Optimize a specific canvas
  public optimizeCanvas(id: string): void {
    const entry = this.canvasRegistry[id];
    if (!entry) return;
    
    const { canvas, options } = entry;
    const objects = canvas.getObjects();
    
    // Implement canvas-specific optimizations based on options
    if (options.enableLayerCaching) {
      objects.forEach(obj => {
        if (this.shouldCacheObject(obj)) {
          obj.objectCaching = true;
        }
      });
    }
    
    if (options.enableIncrementalRendering && objects.length > (options.objectThreshold || 100)) {
      // Implement incremental rendering strategies
      // For example, only render objects in the viewport
      this.applyIncrementalRendering(canvas);
    }
  }
  
  // Apply incremental rendering
  private applyIncrementalRendering(canvas: fabric.Canvas): void {
    // Example implementation - could be more sophisticated
    // This is a simplified approach that skips rendering off-screen objects
    
    // Get viewport bounds
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    const vpWidth = canvas.width || 0;
    const vpHeight = canvas.height || 0;
    
    // Adjust object.visible based on whether they're in the viewport
    canvas.getObjects().forEach(obj => {
      if (!obj.aCoords) return;
      
      // Convert object coords to viewport
      const objLeft = obj.aCoords.tl.x * vpt[0] + vpt[4];
      const objTop = obj.aCoords.tl.y * vpt[3] + vpt[5];
      const objRight = obj.aCoords.br.x * vpt[0] + vpt[4];
      const objBottom = obj.aCoords.br.y * vpt[3] + vpt[5];
      
      // Check if object is in viewport
      const inViewport = !(
        objRight < 0 ||
        objLeft > vpWidth ||
        objBottom < 0 ||
        objTop > vpHeight
      );
      
      // Skip rendering for objects outside viewport
      // Don't change visibility, just skip rendering calculations
      if (!inViewport && obj.visible) {
        obj.visible = false;
        obj.__inViewport = false; // Custom property to track actual visibility
      } else if (inViewport && obj.__inViewport === false) {
        obj.visible = true;
        obj.__inViewport = undefined;
      }
    });
  }
  
  // Get current rendering metrics
  public getRenderingMetrics(): RenderingMetrics {
    // Aggregate metrics from all canvases
    const canvases = Object.values(this.canvasRegistry);
    if (canvases.length === 0) {
      return {
        frameRate: 60,
        renderTime: 0,
        objectCount: 0
      };
    }
    
    // Calculate average metrics across all canvases
    return {
      frameRate: canvases.reduce((sum, entry) => sum + entry.metrics.frameRate, 0) / canvases.length,
      renderTime: canvases.reduce((sum, entry) => sum + entry.metrics.renderTime, 0) / canvases.length,
      objectCount: canvases.reduce((sum, entry) => sum + entry.metrics.objectCount, 0)
    };
  }
  
  // Clean up when a canvas is removed
  public cleanupCanvas(id: string): void {
    delete this.canvasRegistry[id];
    
    if (Object.keys(this.canvasRegistry).length === 0) {
      this.stopMonitoring();
    }
  }
}

// Create singleton instance
const canvasOptimizationService = new CanvasOptimizationService();

export default canvasOptimizationService;
