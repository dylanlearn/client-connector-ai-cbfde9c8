/**
 * Service for monitoring application performance metrics
 */
export class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private isMonitoring: boolean = false;
  private metrics: Record<string, any>[] = [];
  private lastFPSTime: number = 0;
  private frameCount: number = 0;
  private performanceObserver: PerformanceObserver | null = null;
  private networkObserver: PerformanceObserver | null = null;
  
  /**
   * Initialize the performance monitoring service
   */
  public static initialize() {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    
    PerformanceMonitoringService.instance.startMonitoring();
    return PerformanceMonitoringService.instance;
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      return PerformanceMonitoringService.initialize();
    }
    return PerformanceMonitoringService.instance;
  }
  
  /**
   * Start monitoring performance metrics
   */
  public startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.setupPerformanceObservers();
    this.monitorNetworkInformation();
    this.monitorMemoryUsage();
    this.startFPSMonitoring();
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((entries) => {
          entries.getEntries().forEach((entry) => {
            this.recordMetric('longTask', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task monitoring not supported', e);
      }
    }
    
    console.log('Performance monitoring started');
  }
  
  /**
   * Monitor network information if available
   */
  private monitorNetworkInformation(): void {
    // Check for Network Information API
    const nav = navigator as any;
    if (nav.connection) {
      const recordNetworkInfo = () => {
        this.recordMetric('network', {
          effectiveType: nav.connection.effectiveType,
          downlink: nav.connection.downlink,
          rtt: nav.connection.rtt,
          saveData: nav.connection.saveData
        });
      };
      
      // Record initial state
      recordNetworkInfo();
      
      // Listen for changes
      if (nav.connection.addEventListener) {
        nav.connection.addEventListener('change', recordNetworkInfo);
      }
    }
  }
  
  /**
   * Monitor memory usage if available
   */
  private monitorMemoryUsage(): void {
    if (performance && (performance as any).memory) {
      const recordMemoryUsage = () => {
        const memory = (performance as any).memory;
        this.recordMetric('memory', {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      };
      
      // Record initial state
      recordMemoryUsage();
      
      // Set up interval to record memory usage
      setInterval(recordMemoryUsage, 10000); // every 10 seconds
    }
  }
  
  /**
   * Set up performance observers for various metrics
   */
  private setupPerformanceObservers(): void {
    if (!window.PerformanceObserver) {
      console.warn('PerformanceObserver API not available');
      return;
    }
    
    try {
      // Observe paint metrics (FP, FCP)
      this.performanceObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          const metric = {
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration
          };
          this.recordMetric('paint', metric);
        });
      });
      this.performanceObserver.observe({ entryTypes: ['paint'] });
      
      // Observe resource timing
      this.networkObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          const entryAny = entry as any;
          // Filter out some noisy resources
          if (entry.name.includes('hot-update') || entry.name.includes('sockjs-node')) {
            return;
          }
          
          const metric = {
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
            initiatorType: entryAny.initiatorType || 'unknown',
            transferSize: entryAny.transferSize,
            decodedBodySize: entryAny.decodedBodySize,
            encodedBodySize: entryAny.encodedBodySize
          };
          this.recordMetric('resource', metric);
        });
      });
      this.networkObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Error setting up performance observers', e);
    }
  }
  
  /**
   * Start monitoring FPS
   */
  private startFPSMonitoring(): void {
    this.lastFPSTime = performance.now();
    this.frameCount = 0;
    
    const checkFPS = () => {
      const now = performance.now();
      const elapsed = now - this.lastFPSTime;
      
      this.frameCount++;
      
      // Update FPS every second
      if (elapsed >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / elapsed);
        this.recordMetric('fps', { value: fps });
        
        this.frameCount = 0;
        this.lastFPSTime = now;
      }
      
      if (this.isMonitoring) {
        requestAnimationFrame(checkFPS);
      }
    };
    
    requestAnimationFrame(checkFPS);
  }
  
  /**
   * Record a performance metric
   */
  private recordMetric(type: string, data: any): void {
    const metric = {
      type,
      timestamp: performance.now(),
      data
    };
    
    this.metrics.push(metric);
    
    // Keep metrics array from growing too large
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
    
    // Debug metric in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Perf Metric] ${type}:`, data);
    }
  }
  
  /**
   * Get all recorded metrics
   */
  public getMetrics(): Record<string, any>[] {
    return [...this.metrics];
  }
  
  /**
   * Record render time for a specific wireframe
   */
  public static recordRenderTime(wireframeId: string, renderTimeMs: number): void {
    const instance = PerformanceMonitoringService.getInstance();
    instance.recordMetric('wireframeRender', {
      wireframeId,
      renderTimeMs
    });
    
    // Log to the server for analysis if render time is high
    if (renderTimeMs > 100) {
      console.warn(`Slow render detected for wireframe ${wireframeId}: ${renderTimeMs}ms`);
    }
  }
  
  /**
   * Record interaction delay for a specific wireframe
   */
  public static recordInteractionDelay(
    wireframeId: string, 
    delayMs: number,
    interactionType: string
  ): void {
    const instance = PerformanceMonitoringService.getInstance();
    instance.recordMetric('interaction', {
      wireframeId,
      delayMs,
      interactionType
    });
    
    // Log to the server for analysis if delay is high
    if (delayMs > 50) {
      console.warn(`Slow interaction detected for wireframe ${wireframeId}: ${delayMs}ms`);
    }
  }
  
  /**
   * Record FPS for a specific wireframe
   */
  public static recordFPS(wireframeId: string, fps: number): void {
    const instance = PerformanceMonitoringService.getInstance();
    instance.recordMetric('wireframeFPS', {
      wireframeId,
      fps
    });
  }
  
  /**
   * Stop monitoring
   */
  public static stopMonitoring(): void {
    const instance = PerformanceMonitoringService.getInstance();
    
    if (instance.performanceObserver) {
      instance.performanceObserver.disconnect();
    }
    
    if (instance.networkObserver) {
      instance.networkObserver.disconnect();
    }
    
    instance.isMonitoring = false;
  }
}
