
/**
 * Simple performance monitoring utilities
 */

import { Severity, ServiceName, UnifiedObservability } from './unified-observability';

// Simple performance tracker for measuring function execution times
export function trackPerformance(functionName: string, fn: Function, ...args: any[]): Promise<any> {
  const startTime = performance.now();
  
  try {
    const result = fn(...args);
    
    if (result instanceof Promise) {
      return result.then(value => {
        const duration = performance.now() - startTime;
        console.log(`Performance [${functionName}]: ${duration.toFixed(2)}ms`);
        return value;
      }).catch(error => {
        const duration = performance.now() - startTime;
        console.error(`Performance error [${functionName}]: ${duration.toFixed(2)}ms`, error);
        throw error;
      });
    } else {
      const duration = performance.now() - startTime;
      console.log(`Performance [${functionName}]: ${duration.toFixed(2)}ms`);
      return Promise.resolve(result);
    }
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`Performance error [${functionName}]: ${duration.toFixed(2)}ms`, error);
    return Promise.reject(error);
  }
}
