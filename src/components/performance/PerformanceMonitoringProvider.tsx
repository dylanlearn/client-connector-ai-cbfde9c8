
import React, { useEffect, PropsWithChildren } from 'react';
import { PerformanceMonitoringService } from '@/services/PerformanceMonitoringService';

interface PerformanceMonitoringProviderProps {
  enabled?: boolean;
}

export const PerformanceMonitoringContext = React.createContext({
  recordRenderTime: (wireframeId: string, renderTimeMs: number) => {},
  recordInteractionDelay: (wireframeId: string, delayMs: number, interactionType: string) => {}
});

export const PerformanceMonitoringProvider: React.FC<PropsWithChildren<PerformanceMonitoringProviderProps>> = ({ 
  children,
  enabled = true
}) => {
  useEffect(() => {
    if (enabled) {
      PerformanceMonitoringService.initialize();
    }
    
    return () => {
      if (enabled) {
        PerformanceMonitoringService.stopMonitoring();
      }
    };
  }, [enabled]);
  
  const recordRenderTime = (wireframeId: string, renderTimeMs: number) => {
    if (enabled) {
      PerformanceMonitoringService.recordRenderTime(wireframeId, renderTimeMs);
    }
  };
  
  const recordInteractionDelay = (wireframeId: string, delayMs: number, interactionType: string) => {
    if (enabled) {
      PerformanceMonitoringService.recordInteractionDelay(wireframeId, delayMs, interactionType);
    }
  };
  
  return (
    <PerformanceMonitoringContext.Provider value={{ recordRenderTime, recordInteractionDelay }}>
      {children}
    </PerformanceMonitoringContext.Provider>
  );
};

export const usePerformanceMonitoring = () => React.useContext(PerformanceMonitoringContext);
