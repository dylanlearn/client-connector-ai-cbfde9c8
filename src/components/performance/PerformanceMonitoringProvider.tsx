
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  fps: number;
  memoryUsage?: number;
  networkLatency?: number;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  isMonitoring: boolean;
}

const initialMetrics: PerformanceMetrics = {
  renderTime: 0,
  fps: 60,
  memoryUsage: undefined,
  networkLatency: undefined
};

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function usePerformanceMonitoring() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformanceMonitoring must be used within a PerformanceMonitoringProvider');
  }
  return context;
}

interface PerformanceMonitoringProviderProps {
  children: ReactNode;
  enabled?: boolean;
  interval?: number;
}

export const PerformanceMonitoringProvider: React.FC<PerformanceMonitoringProviderProps> = ({
  children,
  enabled = false,
  interval = 5000
}) => {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(enabled);
  const [metrics, setMetrics] = useState<PerformanceMetrics>(initialMetrics);

  const startMonitoring = () => {
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  // Simulate monitoring metrics
  useEffect(() => {
    let timerId: number | undefined;

    if (isMonitoring) {
      timerId = window.setInterval(() => {
        // Simulated metrics collection
        const now = performance.now();
        const lastRenderTime = Math.random() * 10 + 5; // Simulated render time between 5-15ms
        const currentFps = Math.floor(60 - Math.random() * 10); // Simulated FPS between 50-60

        setMetrics({
          renderTime: lastRenderTime,
          fps: currentFps,
          memoryUsage: navigator.deviceMemory ? navigator.deviceMemory * 1024 : undefined,
          networkLatency: Math.random() * 50 + 20 // Simulated network latency between 20-70ms
        });

        // Log metrics to console for debugging
        if (process.env.NODE_ENV === 'development') {
          console.debug('Performance metrics:', {
            renderTime: lastRenderTime,
            fps: currentFps,
            timestamp: new Date().toISOString()
          });
        }
      }, interval);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isMonitoring, interval]);

  return (
    <PerformanceContext.Provider value={{ metrics, startMonitoring, stopMonitoring, isMonitoring }}>
      {children}
    </PerformanceContext.Provider>
  );
};
