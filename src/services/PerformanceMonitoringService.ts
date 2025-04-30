
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface PerformanceMetric {
  metric_type: 'render' | 'memory' | 'interaction' | 'network';
  metric_name: string;
  value: number;
  unit: string;
  wireframe_id?: string;
  page_url?: string;
  context?: Record<string, any>;
}

interface DeviceInfo {
  userAgent: string;
  deviceType: string;
  browserName: string;
  screenSize: { width: number; height: number };
  deviceMemory?: number;
  cpuCores?: number;
  connection?: { type?: string; downlink?: number; rtt?: number; effectiveType?: string };
}

export class PerformanceMonitoringService {
  private static clientId = uuidv4();
  private static sessionId = uuidv4();
  private static isMonitoring = false;
  private static metrics: PerformanceMetric[] = [];
  private static flushInterval: ReturnType<typeof setInterval> | null = null;
  private static deviceInfo: DeviceInfo;

  static initialize() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.setupDeviceInfo();
    this.monitorPageLoadMetrics();
    this.monitorResourceLoading();
    this.monitorUserInteractions();
    
    // Set up periodic flushing of metrics
    this.flushInterval = setInterval(() => {
      this.flushMetrics();
    }, 30000); // Flush every 30 seconds
    
    // Ensure metrics are flushed on page unload
    window.addEventListener('beforeunload', () => {
      this.flushMetrics();
    });
  }
  
  static stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    this.flushMetrics();
  }
  
  private static setupDeviceInfo() {
    const connection = navigator.connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    this.deviceInfo = {
      userAgent: navigator.userAgent,
      deviceType: this.getDeviceType(),
      browserName: this.getBrowserName(),
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      },
      deviceMemory: (navigator as any).deviceMemory,
      cpuCores: navigator.hardwareConcurrency,
      connection: connection ? {
        type: connection.type,
        downlink: connection.downlink,
        rtt: connection.rtt,
        effectiveType: connection.effectiveType
      } : undefined
    };
  }
  
  private static getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }
  
  private static getBrowserName(): string {
    const ua = navigator.userAgent;
    
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) return 'IE';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    
    return 'Unknown';
  }
  
  private static monitorPageLoadMetrics() {
    // Use Performance API to get navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const performance = window.performance;
        if (performance && performance.timing) {
          const timing = performance.timing;
          
          const navStart = timing.navigationStart;
          const domLoaded = timing.domContentLoadedEventEnd - navStart;
          const fullyLoaded = timing.loadEventEnd - navStart;
          
          this.recordMetric({
            metric_type: 'render',
            metric_name: 'dom_content_loaded',
            value: domLoaded,
            unit: 'ms',
            page_url: window.location.href
          });
          
          this.recordMetric({
            metric_type: 'render',
            metric_name: 'page_load',
            value: fullyLoaded,
            unit: 'ms',
            page_url: window.location.href
          });
          
          // First paint - if available
          const paintMetrics = performance.getEntriesByType('paint');
          const firstPaint = paintMetrics.find(({ name }) => name === 'first-paint');
          const firstContentfulPaint = paintMetrics.find(({ name }) => name === 'first-contentful-paint');
          
          if (firstPaint) {
            this.recordMetric({
              metric_type: 'render',
              metric_name: 'first_paint',
              value: firstPaint.startTime,
              unit: 'ms',
              page_url: window.location.href
            });
          }
          
          if (firstContentfulPaint) {
            this.recordMetric({
              metric_type: 'render',
              metric_name: 'first_contentful_paint',
              value: firstContentfulPaint.startTime,
              unit: 'ms',
              page_url: window.location.href
            });
          }
        }
        
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.recordMetric({
            metric_type: 'render',
            metric_name: 'largest_contentful_paint',
            value: lastEntry.startTime,
            unit: 'ms',
            page_url: window.location.href
          });
          
          lcpObserver.disconnect();
        });
        
        try {
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          console.log('LCP not supported');
        }
        
        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          
          for (const entry of entryList.getEntries()) {
            // @ts-ignore - layout shift entry value property
            if (!entry.hadRecentInput) {
              // @ts-ignore - layout shift entry value property
              clsValue += entry.value;
            }
          }
          
          this.recordMetric({
            metric_type: 'render',
            metric_name: 'cumulative_layout_shift',
            value: clsValue,
            unit: '',
            page_url: window.location.href
          });
        });
        
        try {
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          console.log('CLS not supported');
        }
      }, 0);
    });
    
    // Monitor memory usage periodically
    if ((performance as any).memory) {
      setInterval(() => {
        const memoryInfo = (performance as any).memory;
        
        this.recordMetric({
          metric_type: 'memory',
          metric_name: 'js_heap_size',
          value: memoryInfo.usedJSHeapSize / (1024 * 1024),
          unit: 'MB',
          page_url: window.location.href
        });
      }, 10000);
    }
  }
  
  private static monitorResourceLoading() {
    const resourceObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Filter out same-origin resources
        if (entry.name.startsWith(window.location.origin)) {
          this.recordMetric({
            metric_type: 'network',
            metric_name: 'resource_load_time',
            value: entry.duration,
            unit: 'ms',
            page_url: window.location.href,
            context: {
              resource_url: entry.name,
              resource_type: entry.initiatorType
            }
          });
        }
      }
    });
    
    try {
      resourceObserver.observe({ type: 'resource', buffered: true });
    } catch (e) {
      console.log('Resource timing not supported');
    }
  }
  
  private static monitorUserInteractions() {
    let lastInteractionTime = performance.now();
    
    const recordInteraction = (eventType: string) => {
      const now = performance.now();
      const timeSinceLastInteraction = now - lastInteractionTime;
      
      this.recordMetric({
        metric_type: 'interaction',
        metric_name: 'interaction_delay',
        value: timeSinceLastInteraction,
        unit: 'ms',
        page_url: window.location.href,
        context: { event_type: eventType }
      });
      
      lastInteractionTime = now;
    };
    
    // Monitor click response time
    document.addEventListener('click', () => recordInteraction('click'), true);
    
    // Monitor scroll response time
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        recordInteraction('scroll');
      }, 100);
    }, true);
    
    // Monitor keypress response time
    document.addEventListener('keydown', () => recordInteraction('keydown'), true);
  }

  static recordMetric(metric: PerformanceMetric) {
    if (!this.isMonitoring) return;
    
    this.metrics.push(metric);
    
    // Flush if we have too many metrics
    if (this.metrics.length >= 50) {
      this.flushMetrics();
    }
  }
  
  static recordRenderTime(wireframeId: string, renderTimeMs: number) {
    this.recordMetric({
      metric_type: 'render',
      metric_name: 'wireframe_render_time',
      value: renderTimeMs,
      unit: 'ms',
      wireframe_id: wireframeId,
      page_url: window.location.href
    });
  }
  
  static recordFPS(wireframeId: string, fps: number) {
    this.recordMetric({
      metric_type: 'render',
      metric_name: 'fps',
      value: fps,
      unit: 'fps',
      wireframe_id: wireframeId,
      page_url: window.location.href
    });
  }
  
  static recordInteractionDelay(wireframeId: string, delayMs: number, interactionType: string) {
    this.recordMetric({
      metric_type: 'interaction',
      metric_name: 'interaction_delay',
      value: delayMs,
      unit: 'ms',
      wireframe_id: wireframeId,
      page_url: window.location.href,
      context: { interaction_type: interactionType }
    });
  }

  private static async flushMetrics() {
    if (this.metrics.length === 0) return;
    
    const metrics = [...this.metrics];
    this.metrics = [];
    
    try {
      const metricsToSend = metrics.map(metric => ({
        client_id: this.clientId,
        session_id: this.sessionId,
        wireframe_id: metric.wireframe_id,
        page_url: metric.page_url || window.location.href,
        metric_type: metric.metric_type,
        metric_name: metric.metric_name,
        value: metric.value,
        unit: metric.unit,
        context: metric.context || {},
        device_info: this.deviceInfo
      }));
      
      const { error } = await supabase.from('performance_metrics').insert(metricsToSend);
      
      if (error) {
        console.error('Failed to store performance metrics:', error);
      }
    } catch (err) {
      console.error('Error flushing metrics:', err);
    }
  }
}
