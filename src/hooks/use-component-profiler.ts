
import { useRef, useEffect, useState, useCallback } from 'react';
import { measurePerformance, PerformanceTracker } from '@/utils/performance-debugger';
import { trackPerformance } from '@/utils/monitoring/performance-monitoring';

export interface RenderMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  maxRenderTime: number;
  totalRenderTime: number;
  memoryUsage?: number;
  domNodes?: number;
  rerenderedWithoutPropChanges: number;
}

export interface ProfilerOptions {
  trackMemory?: boolean;
  trackDOMNodes?: boolean;
  logToConsole?: boolean;
  sampleInterval?: number;
  trackProps?: boolean;
}

/**
 * Custom hook to profile component rendering performance
 */
export function useComponentProfiler(
  componentName: string, 
  options: ProfilerOptions = {}
) {
  const {
    trackMemory = false,
    trackDOMNodes = false,
    logToConsole = false,
    sampleInterval = 0,
    trackProps = false,
  } = options;
  
  // Track render metrics
  const renderCountRef = useRef(0);
  const renderTimesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(performance.now());
  const previousPropsRef = useRef<any>(null);
  const unnecessaryRendersRef = useRef(0);
  
  const [metrics, setMetrics] = useState<RenderMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    maxRenderTime: 0,
    totalRenderTime: 0,
    rerenderedWithoutPropChanges: 0
  });

  // Capture render start time
  const captureRenderStart = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);
  
  // Capture render end and calculate metrics
  const captureRenderEnd = useCallback((props?: any) => {
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;
    
    // Track render times
    renderCountRef.current += 1;
    renderTimesRef.current.push(renderTime);
    
    // Check if props actually changed (for unnecessary render detection)
    if (trackProps && props && previousPropsRef.current) {
      let hasChanged = false;
      const prevProps = previousPropsRef.current;
      
      // Simple shallow compare
      for (const key in props) {
        if (props[key] !== prevProps[key]) {
          hasChanged = true;
          break;
        }
      }
      
      for (const key in prevProps) {
        if (!(key in props) || props[key] !== prevProps[key]) {
          hasChanged = true;
          break;
        }
      }
      
      if (!hasChanged) {
        unnecessaryRendersRef.current += 1;
      }
      
      previousPropsRef.current = { ...props };
    } else if (props) {
      previousPropsRef.current = { ...props };
    }
    
    // Calculate metrics
    const totalTime = renderTimesRef.current.reduce((sum, time) => sum + time, 0);
    const maxTime = Math.max(...renderTimesRef.current);
    const avgTime = totalTime / renderTimesRef.current.length;
    
    // Optional metrics
    let memoryUsage;
    let domNodes;
    
    if (trackMemory && (performance as any).memory) {
      memoryUsage = (performance as any).memory.usedJSHeapSize / (1024 * 1024); // MB
    }
    
    if (trackDOMNodes) {
      domNodes = document.querySelectorAll('*').length;
    }
    
    const updatedMetrics: RenderMetrics = {
      renderCount: renderCountRef.current,
      lastRenderTime: renderTime,
      averageRenderTime: avgTime,
      maxRenderTime: maxTime,
      totalRenderTime: totalTime,
      rerenderedWithoutPropChanges: unnecessaryRendersRef.current
    };
    
    if (memoryUsage !== undefined) {
      updatedMetrics.memoryUsage = memoryUsage;
    }
    
    if (domNodes !== undefined) {
      updatedMetrics.domNodes = domNodes;
    }
    
    setMetrics(updatedMetrics);
    
    // Log to console if enabled
    if (logToConsole) {
      console.log(`[Profiler] ${componentName} render #${renderCountRef.current}: ${renderTime.toFixed(2)}ms`);
      if (unnecessaryRendersRef.current > 0) {
        console.warn(`[Profiler] ${componentName} has rendered ${unnecessaryRendersRef.current} times without prop changes`);
      }
    }
    
    return updatedMetrics;
  }, [componentName, logToConsole, trackDOMNodes, trackMemory, trackProps]);
  
  // Reset metrics
  const resetMetrics = useCallback(() => {
    renderCountRef.current = 0;
    renderTimesRef.current = [];
    unnecessaryRendersRef.current = 0;
    setMetrics({
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      maxRenderTime: 0,
      totalRenderTime: 0,
      rerenderedWithoutPropChanges: 0
    });
  }, []);
  
  // Function to analyze performance and provide recommendations
  const analyzePerformance = useCallback(() => {
    const recommendations: string[] = [];
    
    if (metrics.averageRenderTime > 16) { // 60fps threshold
      recommendations.push('Consider optimizing render performance as it exceeds 16ms (60fps).');
    }
    
    if (metrics.rerenderedWithoutPropChanges > metrics.renderCount * 0.2) {
      recommendations.push('High rate of renders without prop changes. Consider using React.memo or shouldComponentUpdate.');
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > 100) {
      recommendations.push('High memory usage detected. Look for memory leaks or large data structures.');
    }
    
    if (metrics.renderCount > 20 && metrics.totalRenderTime / metrics.renderCount > 10) {
      recommendations.push('Component is rendering frequently and slowly. Consider code-splitting or optimizing.');
    }
    
    return recommendations;
  }, [metrics]);
  
  // Sample metrics at regular intervals if interval is provided
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (sampleInterval > 0) {
      intervalId = setInterval(() => {
        captureRenderEnd();
      }, sampleInterval);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [captureRenderEnd, sampleInterval]);
  
  // HOC to wrap component with performance tracking
  const withProfiler = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
    return (props: P) => {
      captureRenderStart();
      useEffect(() => {
        captureRenderEnd(props);
      });
      
      return <Component {...props} />;
    };
  };

  // Profile a function
  const profileFunction = <T extends (...args: any[]) => any>(fn: T, functionName?: string): T => {
    const profiled = (...args: Parameters<T>): ReturnType<T> => {
      const name = functionName || fn.name || 'anonymous';
      return trackPerformance(`${componentName}.${name}`, fn, ...args) as ReturnType<T>;
    };
    
    return profiled as T;
  };
  
  return {
    metrics,
    captureRenderStart,
    captureRenderEnd,
    resetMetrics,
    analyzePerformance,
    withProfiler,
    profileFunction
  };
}

export default useComponentProfiler;
