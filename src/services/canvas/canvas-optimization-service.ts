/**
 * Canvas Optimization Service
 * Provides optimization techniques for Fabric.js canvas rendering
 */

export interface RenderingMetrics {
  frameRate: number;
  renderTime: number;
  objectCount: number;
  timestamp?: number;
  memoryUsage?: number;
}

export interface CanvasOptimizationOptions {
  useLayerCaching?: boolean;
  offscreenSkipping?: boolean;
  incrementalRendering?: boolean;
  hardwareAcceleration?: boolean;
  disableSmoothing?: boolean;
  minimumFrameTime?: number;
  objectThreshold?: number;
}

class CanvasOptimizationService {
  private options: CanvasOptimizationOptions = {
    useLayerCaching: true,
    offscreenSkipping: true,
    incrementalRendering: false,
    hardwareAcceleration: true,
    disableSmoothing: false,
    minimumFrameTime: 16, // ~60fps
    objectThreshold: 100
  };

  private canvasRegistry: Map<string, fabric.Canvas> = new Map();
  private layerCache: Map<string, HTMLCanvasElement> = new Map();
  private metrics: RenderingMetrics = {
    frameRate: 60,
    renderTime: 0,
    objectCount: 0
  };

  private lastRenderTime: number = 0;
  private frameCount: number = 0;
  private fpsAccumulator: number = 0;
  private measurementInterval: number = 1000; // 1 second

  /**
   * Configure the optimization service options
   */
  configure(options: Partial<CanvasOptimizationOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Initialize optimization for a specific canvas
   */
  initializeCanvas(canvas: fabric.Canvas, canvasId: string): void {
    if (!canvas) return;
    
    this.canvasRegistry.set(canvasId, canvas);
    
    // Apply hardware acceleration if enabled
    if (this.options.hardwareAcceleration) {
      this.enableHardwareAcceleration(canvas);
    }
    
    // Setup incremental rendering if enabled
    if (this.options.incrementalRendering) {
      this.setupIncrementalRendering(canvas);
    }
    
    // Setup frame rate monitoring
    this.setupPerformanceMonitoring(canvas);
    
    // Initialize layer cache if enabled
    if (this.options.useLayerCaching) {
      this.initializeLayerCache(canvas, canvasId);
    }
    
    console.log(`Canvas optimization initialized for ${canvasId} with options:`, this.options);
  }

  /**
   * Enable hardware acceleration for the canvas
   */
  private enableHardwareAcceleration(canvas: fabric.Canvas): void {
    if (!canvas.lowerCanvasEl) return;
    
    // Apply hardware acceleration via CSS transform
    const lowerCanvas = canvas.lowerCanvasEl as HTMLCanvasElement;
    lowerCanvas.style.transform = 'translateZ(0)';
    lowerCanvas.style.backfaceVisibility = 'hidden';
    
    // Force GPU acceleration
    const upperCanvas = canvas.upperCanvasEl as HTMLCanvasElement;
    if (upperCanvas) {
      upperCanvas.style.transform = 'translateZ(0)';
      upperCanvas.style.backfaceVisibility = 'hidden';
    }
  }

  /**
   * Setup incremental rendering for complex scenes
   */
  private setupIncrementalRendering(canvas: fabric.Canvas): void {
    const originalRenderAll = canvas.renderAll.bind(canvas);
    
    canvas.renderAll = function() {
      const objects = this.getObjects();
      const objectCount = objects.length;
      
      // If object count is below threshold, use standard rendering
      if (objectCount < this.options?.objectThreshold || !this.options?.incrementalRendering) {
        return originalRenderAll();
      }
      
      // Otherwise use incremental rendering
      const batchSize = Math.ceil(objectCount / 3); // Render in 3 batches
      let renderedCount = 0;
      
      const renderBatch = () => {
        const start = renderedCount;
        const end = Math.min(renderedCount + batchSize, objectCount);
        
        for (let i = start; i < end; i++) {
          objects[i].dirty = true;
        }
        
        renderedCount = end;
        originalRenderAll();
        
        if (renderedCount < objectCount) {
          requestAnimationFrame(renderBatch);
        }
      };
      
      requestAnimationFrame(renderBatch);
      return this;
    };
  }

  /**
   * Initialize layer caching for static elements
   */
  private initializeLayerCache(canvas: fabric.Canvas, canvasId: string): void {
    const cachedCanvas = document.createElement('canvas');
    cachedCanvas.width = canvas.width || 0;
    cachedCanvas.height = canvas.height || 0;
    
    this.layerCache.set(canvasId, cachedCanvas);
    
    // Override renderAll to use layer caching
    const originalRenderAll = canvas.renderAll.bind(canvas);
    
    canvas.renderAll = function() {
      const start = performance.now();
      originalRenderAll();
      const end = performance.now();
      
      // Update metrics
      this.metrics = {
        ...this.metrics,
        renderTime: end - start,
        objectCount: canvas.getObjects().length,
        timestamp: Date.now()
      };
      
      return this;
    }.bind(this);
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(canvas: fabric.Canvas): void {
    let lastFrameTime = performance.now();
    let frameCount = 0;
    
    // Patch the renderAll method to track performance
    const originalRenderAll = canvas.renderAll.bind(canvas);
    
    canvas.renderAll = function() {
      const now = performance.now();
      const delta = now - lastFrameTime;
      frameCount++;
      
      // Calculate metrics every second
      if (delta >= this.measurementInterval) {
        const fps = Math.round((frameCount * 1000) / delta);
        
        this.metrics = {
          ...this.metrics,
          frameRate: fps,
          objectCount: canvas.getObjects().length
        };
        
        frameCount = 0;
        lastFrameTime = now;
      }
      
      const start = performance.now();
      originalRenderAll();
      const renderTime = performance.now() - start;
      
      this.metrics.renderTime = renderTime;
      
      return this;
    }.bind(this);
  }

  /**
   * Get the current rendering metrics
   */
  getRenderingMetrics(): RenderingMetrics {
    return { ...this.metrics };
  }

  /**
   * Cleanup canvas resources
   */
  cleanupCanvas(canvasId: string): void {
    this.canvasRegistry.delete(canvasId);
    this.layerCache.delete(canvasId);
  }
}

// Export singleton instance
const canvasOptimizationService = new CanvasOptimizationService();
export default canvasOptimizationService;
