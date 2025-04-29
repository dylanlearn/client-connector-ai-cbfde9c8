import { fabric } from 'fabric';
import { PerformanceTracker } from '@/utils/performance-debugger';

export interface LayerCache {
  id: string;
  lastUpdated: number;
  imageData: string | null;
  dirty: boolean;
}

export interface RenderingMetrics {
  frameRate: number;
  renderTime: number;
  objectCount: number;
  pixelsProcessed?: number;
  memoryUsage?: number;
}

export interface CanvasOptimizationOptions {
  enableLayerCaching?: boolean;
  enableIncrementalRendering?: boolean;
  enableHardwareAcceleration?: boolean;
  throttleRendering?: boolean;
  throttleDelay?: number;
  offscreenProcessing?: boolean;
  autoOptimize?: boolean;
  targetFrameRate?: number;
  lowPowerMode?: boolean;
  devicePixelRatio?: number;
}

class CanvasOptimizationService {
  private static instance: CanvasOptimizationService;
  private layerCaches: Map<string, LayerCache> = new Map();
  private incrementalRenderQueue: Set<string> = new Set();
  private lastRenderTimes: number[] = [];
  private renderingMetrics: RenderingMetrics = {
    frameRate: 60,
    renderTime: 0,
    objectCount: 0
  };
  private options: CanvasOptimizationOptions = {
    enableLayerCaching: true,
    enableIncrementalRendering: true,
    enableHardwareAcceleration: true,
    throttleRendering: false,
    throttleDelay: 16, // ~60fps
    offscreenProcessing: true,
    autoOptimize: true,
    targetFrameRate: 60,
    lowPowerMode: false,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  };
  private animationFrameId: number | null = null;
  private throttleTimeout: NodeJS.Timeout | null = null;
  private offscreenCanvases: Map<string, OffscreenCanvas | HTMLCanvasElement> = new Map();
  private renderCallbacks: Map<string, () => void> = new Map();

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): CanvasOptimizationService {
    if (!CanvasOptimizationService.instance) {
      CanvasOptimizationService.instance = new CanvasOptimizationService();
    }
    return CanvasOptimizationService.instance;
  }

  // Configure the optimization service
  configure(options: CanvasOptimizationOptions): void {
    this.options = { ...this.options, ...options };

    // Apply hardware acceleration settings
    if (this.options.enableHardwareAcceleration) {
      this.enableHardwareAcceleration();
    }
  }

  // Initialize optimization for a specific canvas
  initializeCanvas(canvas: fabric.Canvas, canvasId: string): void {
    if (!canvas) return;

    const endMeasure = PerformanceTracker.start(`initializeCanvas-${canvasId}`);

    // Set up layer caching
    if (this.options.enableLayerCaching) {
      this.setupLayerCaching(canvas, canvasId);
    }

    // Set up incremental rendering
    if (this.options.enableIncrementalRendering) {
      this.setupIncrementalRendering(canvas, canvasId);
    }

    // Set up offscreen processing
    if (this.options.offscreenProcessing) {
      this.setupOffscreenProcessing(canvas, canvasId);
    }

    // Auto optimize if enabled
    if (this.options.autoOptimize) {
      this.autoOptimizeCanvas(canvas, canvasId);
    }

    endMeasure();
  }

  // Enable hardware acceleration for canvas rendering
  private enableHardwareAcceleration(): void {
    if (typeof document === 'undefined') return;

    // Apply hardware acceleration CSS to canvas elements
    const style = document.createElement('style');
    style.innerHTML = `
      canvas.fabric-canvas {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        will-change: transform, opacity;
      }
    `;
    document.head.appendChild(style);
  }

  // Set up layer caching for a canvas
  private setupLayerCaching(canvas: fabric.Canvas, canvasId: string): void {
    if (!canvas) return;

    // Initialize cache for this canvas
    this.layerCaches.set(canvasId, {
      id: canvasId,
      lastUpdated: Date.now(),
      imageData: null,
      dirty: true
    });

    // Override render methods to enable caching
    const originalRenderAll = canvas.renderAll.bind(canvas);
    
    canvas.renderAll = () => {
      const cache = this.layerCaches.get(canvasId);
      
      if (cache && !cache.dirty && cache.imageData) {
        // Use cached render if not dirty
        this.applyCache(canvas, cache.imageData);
        return;
      }
      
      // Otherwise perform normal render
      const startTime = performance.now();
      originalRenderAll();
      const endTime = performance.now();
      
      // Update metrics
      this.updateRenderingMetrics(canvas, endTime - startTime);
      
      // Update cache
      if (cache) {
        cache.imageData = canvas.toDataURL();
        cache.lastUpdated = Date.now();
        cache.dirty = false;
        this.layerCaches.set(canvasId, cache);
      }
    };

    // Mark cache as dirty when canvas changes
    const markDirty = () => {
      const cache = this.layerCaches.get(canvasId);
      if (cache) {
        cache.dirty = true;
        this.layerCaches.set(canvasId, cache);
      }
    };

    canvas.on('object:added', markDirty);
    canvas.on('object:removed', markDirty);
    canvas.on('object:modified', markDirty);
    canvas.on('object:rotated', markDirty);
    canvas.on('object:scaled', markDirty);
    canvas.on('object:moved', markDirty);
    canvas.on('background-color:changed', markDirty);
  }

  // Apply cached image data to canvas
  private applyCache(canvas: fabric.Canvas, imageData: string): void {
    if (!canvas || !imageData) return;
    
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext();
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = imageData;
  }

  // Set up incremental rendering for a canvas
  private setupIncrementalRendering(canvas: fabric.Canvas, canvasId: string): void {
    if (!canvas) return;
    
    // Keep track of objects that need re-rendering
    const needsRender = new Set<fabric.Object>();
    
    // Store original render method for objects
    const originalRender = fabric.Object.prototype.render;
    
    // Override object render to support incremental rendering
    fabric.Object.prototype.render = function(ctx) {
      const result = originalRender.call(this, ctx);
      if (needsRender.has(this)) {
        needsRender.delete(this);
      }
      return result;
    };
    
    // Mark objects for incremental rendering
    const markForIncremental = (obj: fabric.Object) => {
      needsRender.add(obj);
      this.incrementalRenderQueue.add(canvasId);
      this.scheduleIncrementalRender(canvas);
    };
    
    canvas.on('object:modified', (e) => {
      if (e.target) markForIncremental(e.target);
    });
    
    canvas.on('object:moving', (e) => {
      if (e.target) markForIncremental(e.target);
    });
    
    canvas.on('object:scaling', (e) => {
      if (e.target) markForIncremental(e.target);
    });
    
    canvas.on('object:rotating', (e) => {
      if (e.target) markForIncremental(e.target);
    });
  }

  // Schedule an incremental render
  private scheduleIncrementalRender(canvas: fabric.Canvas): void {
    if (!canvas) return;
    
    if (this.throttleTimeout) {
      clearTimeout(this.throttleTimeout);
    }
    
    if (this.options.throttleRendering) {
      this.throttleTimeout = setTimeout(() => {
        this.performIncrementalRender(canvas);
      }, this.options.throttleDelay);
    } else {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      this.animationFrameId = requestAnimationFrame(() => {
        this.performIncrementalRender(canvas);
      });
    }
  }

  // Perform incremental rendering
  private performIncrementalRender(canvas: fabric.Canvas): void {
    if (!canvas) return;
    
    const startTime = performance.now();
    canvas.renderAll();
    const endTime = performance.now();
    
    this.updateRenderingMetrics(canvas, endTime - startTime);
  }

  // Set up offscreen processing
  private setupOffscreenProcessing(canvas: fabric.Canvas, canvasId: string): void {
    if (!canvas || !canvas.lowerCanvasEl) return;
    
    try {
      // Try to create an offscreen canvas
      let offscreenCanvas: OffscreenCanvas | HTMLCanvasElement;
      
      if (typeof OffscreenCanvas !== 'undefined') {
        offscreenCanvas = new OffscreenCanvas(
          canvas.lowerCanvasEl.width, 
          canvas.lowerCanvasEl.height
        );
      } else {
        // Fallback for browsers without OffscreenCanvas
        offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = canvas.lowerCanvasEl.width;
        offscreenCanvas.height = canvas.lowerCanvasEl.height;
      }
      
      this.offscreenCanvases.set(canvasId, offscreenCanvas);
      
    } catch (error) {
      console.error("Failed to set up offscreen processing:", error);
    }
  }

  // Auto-optimize canvas based on performance metrics
  private autoOptimizeCanvas(canvas: fabric.Canvas, canvasId: string): void {
    if (!canvas) return;
    
    // Create a monitoring interval
    const monitorInterval = setInterval(() => {
      const metrics = this.renderingMetrics;
      
      // If framerate drops below target, apply optimizations
      if (metrics.frameRate < (this.options.targetFrameRate || 60) * 0.8) {
        // Enable low power mode if needed
        if (metrics.frameRate < (this.options.targetFrameRate || 60) * 0.5) {
          this.options.lowPowerMode = true;
          
          // Apply more aggressive optimizations
          this.options.throttleRendering = true;
          this.options.throttleDelay = 32; // ~30fps
        }
        
        // Apply object-level optimizations
        this.optimizeCanvasObjects(canvas);
      }
      
    }, 5000); // Check every 5 seconds
    
    // Store cleanup function for later
    this.renderCallbacks.set(canvasId, () => {
      clearInterval(monitorInterval);
    });
  }

  // Optimize individual objects in the canvas
  private optimizeCanvasObjects(canvas: fabric.Canvas): void {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const viewportBounds = {
      left: -canvas.viewportTransform![4] / canvas.getZoom(),
      top: -canvas.viewportTransform![5] / canvas.getZoom(),
      right: (-canvas.viewportTransform![4] + canvas.width!) / canvas.getZoom(),
      bottom: (-canvas.viewportTransform![5] + canvas.height!) / canvas.getZoom()
    };
    
    objects.forEach(obj => {
      if (!obj) return;
      
      // Skip small objects
      const isTiny = obj.width! < 10 || obj.height! < 10;
      
      // Check if object is in viewport
      const isVisible = 
        obj.left! + obj.width! * obj.scaleX! >= viewportBounds.left &&
        obj.top! + obj.height! * obj.scaleY! >= viewportBounds.top &&
        obj.left! <= viewportBounds.right &&
        obj.top! <= viewportBounds.bottom;
      
      // Optimize object caching based on visibility and size
      obj.objectCaching = isVisible && !isTiny;
      
      // Use simpler shadow if in low power mode
      if (this.options.lowPowerMode && obj.shadow) {
        obj.shadow.blur = Math.min(obj.shadow.blur, 5);
      }
      
      // Disable rendering for off-screen objects in low power mode
      if (this.options.lowPowerMode && !isVisible) {
        obj.visible = false;
      } else if (obj.visible === false && isVisible) {
        obj.visible = true;
      }
    });
    
    canvas.renderAll();
  }

  // Update rendering metrics
  private updateRenderingMetrics(canvas: fabric.Canvas, renderTime: number): void {
    if (!canvas) return;
    
    // Update render time tracking
    this.lastRenderTimes.push(renderTime);
    if (this.lastRenderTimes.length > 60) {
      this.lastRenderTimes.shift();
    }
    
    // Calculate average render time
    const avgRenderTime = this.lastRenderTimes.reduce((sum, time) => sum + time, 0) / 
                          this.lastRenderTimes.length;
    
    // Calculate frame rate
    const frameRate = avgRenderTime > 0 ? 1000 / avgRenderTime : 60;
    
    this.renderingMetrics = {
      frameRate: Math.min(frameRate, 60), // Cap at 60fps
      renderTime: avgRenderTime,
      objectCount: canvas.getObjects().length,
      // Try to estimate memory usage if available in browser
      memoryUsage: (performance as any).memory?.usedJSHeapSize ? 
        (performance as any).memory.usedJSHeapSize / (1024 * 1024) : 
        undefined
    };
  }
  
  // Get current rendering metrics
  getRenderingMetrics(): RenderingMetrics {
    return { ...this.renderingMetrics };
  }
  
  // Clean up resources for a canvas
  cleanupCanvas(canvasId: string): void {
    // Clean up layer cache
    this.layerCaches.delete(canvasId);
    
    // Remove from incremental render queue
    this.incrementalRenderQueue.delete(canvasId);
    
    // Clean up offscreen canvas
    this.offscreenCanvases.delete(canvasId);
    
    // Clear render callbacks
    const cleanup = this.renderCallbacks.get(canvasId);
    if (cleanup) {
      cleanup();
      this.renderCallbacks.delete(canvasId);
    }
  }
}

export const canvasOptimizationService = CanvasOptimizationService.getInstance();
export default canvasOptimizationService;
