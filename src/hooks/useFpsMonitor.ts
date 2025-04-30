
import { useState, useEffect, useRef } from 'react';
import { PerformanceMonitoringService } from '@/services/PerformanceMonitoringService';

interface FpsMonitorOptions {
  wireframeId?: string;
  reportInterval?: number; // milliseconds
  enabled?: boolean;
}

export function useFpsMonitor({
  wireframeId,
  reportInterval = 5000,
  enabled = true
}: FpsMonitorOptions = {}) {
  const [fps, setFps] = useState<number | null>(null);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Function to calculate FPS
    const calculateFps = (now: number) => {
      const elapsed = now - lastTimeRef.current;
      
      // Update FPS every second
      if (elapsed >= 1000) {
        const currentFps = frameCountRef.current / (elapsed / 1000);
        setFps(Math.round(currentFps));
        
        frameCountRef.current = 0;
        lastTimeRef.current = now;
        
        return currentFps;
      }
      
      return null;
    };
    
    // Animation frame loop
    const tick = (now: number) => {
      frameCountRef.current++;
      calculateFps(now);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    
    animFrameRef.current = requestAnimationFrame(tick);
    
    // Set up interval to report FPS to monitoring service
    let reportTimer: ReturnType<typeof setInterval> | null = null;
    
    if (wireframeId) {
      reportTimer = setInterval(() => {
        if (fps !== null) {
          PerformanceMonitoringService.recordFPS(wireframeId, fps);
        }
      }, reportInterval);
    }
    
    // Cleanup
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (reportTimer !== null) {
        clearInterval(reportTimer);
      }
    };
  }, [enabled, wireframeId, reportInterval, fps]);
  
  return fps;
}
