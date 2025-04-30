
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Extend Navigator interface to include deviceMemory
declare global {
  interface Navigator {
    deviceMemory?: number;
  }
}

interface PerformanceMetrics {
  fps: number;
  memory: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  } | null;
  deviceMemory: number | null;
  cpuCores: number;
  renderTime: number;
  loadTime: number;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

const initialMetrics: PerformanceMetrics = {
  fps: 0,
  memory: null,
  deviceMemory: null,
  cpuCores: 0,
  renderTime: 0,
  loadTime: 0,
};

const PerformanceContext = createContext<PerformanceContextType>({
  metrics: initialMetrics,
  isMonitoring: false,
  startMonitoring: () => {},
  stopMonitoring: () => {},
});

export const usePerformanceMonitoring = () => useContext(PerformanceContext);

interface PerformanceMonitoringProviderProps {
  children: ReactNode;
  enabled?: boolean;
  sampleRate?: number;
}

export const PerformanceMonitoringProvider: React.FC<PerformanceMonitoringProviderProps> = ({
  children,
  enabled = false,
  sampleRate = 1000,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(initialMetrics);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(enabled);
  const [monitoringInterval, setMonitoringInterval] = useState<number | null>(null);

  const startMonitoring = () => {
    if (!isMonitoring) {
      setIsMonitoring(true);
    }
  };

  const stopMonitoring = () => {
    if (isMonitoring) {
      setIsMonitoring(false);
      if (monitoringInterval !== null) {
        window.clearInterval(monitoringInterval);
        setMonitoringInterval(null);
      }
    }
  };

  useEffect(() => {
    if (isMonitoring) {
      // Get initial device info
      // Use optional chaining to safely access deviceMemory
      const deviceMemory = navigator.deviceMemory ?? null;
      const cpuCores = navigator.hardwareConcurrency || 0;

      setMetrics((prev) => ({
        ...prev,
        deviceMemory,
        cpuCores,
        loadTime: performance.now(),
      }));

      // Set up monitoring interval
      const intervalId = window.setInterval(() => {
        const memory = (performance as any).memory
          ? {
              jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
              totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
              usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            }
          : null;

        setMetrics((prev) => ({
          ...prev,
          memory,
          renderTime: performance.now(),
        }));
      }, sampleRate);

      setMonitoringInterval(intervalId);

      return () => {
        window.clearInterval(intervalId);
      };
    }
  }, [isMonitoring, sampleRate]);

  return (
    <PerformanceContext.Provider
      value={{
        metrics,
        isMonitoring,
        startMonitoring,
        stopMonitoring,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};
