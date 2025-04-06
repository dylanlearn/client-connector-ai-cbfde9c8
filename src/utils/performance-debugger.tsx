
import { useEffect } from 'react';

/**
 * A utility component that logs component mount and unmount events for debugging 
 * performance issues. Only outputs logs in development mode.
 * 
 * @param componentName The name of the component to log mount/unmount events for
 */
export function useComponentLifecycleLogger(componentName: string): void {
  useEffect(() => {
    const startTime = performance.now();
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c[Mount] ${componentName}`, 'color: green; font-weight: bold');
    }
    
    return () => {
      if (process.env.NODE_ENV === 'development') {
        const duration = performance.now() - startTime;
        console.log(
          `%c[Unmount] ${componentName} after ${duration.toFixed(2)}ms`, 
          'color: orange; font-weight: bold'
        );
      }
    };
  }, [componentName]);
}

/**
 * Measure the execution time of a function and log it to the console.
 * Only outputs logs in development mode.
 * 
 * @param fn The function to measure
 * @param name The name to use in the log output
 * @returns The result of the function
 */
export function measurePerformance<T>(fn: () => T, name: string): T {
  if (process.env.NODE_ENV !== 'development') {
    return fn();
  }
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`%c[Performance] ${name}: ${(end - start).toFixed(2)}ms`, 'color: blue; font-weight: bold');
  
  return result;
}

/**
 * A utility that allows measuring performance of asynchronous operations.
 * Only outputs logs in development mode.
 */
export const PerformanceTracker = {
  /**
   * Start tracking a new operation
   * @param name The name of the operation to track
   * @returns A function to call when the operation completes
   */
  start(name: string): () => void {
    if (process.env.NODE_ENV !== 'development') {
      return () => {};
    }
    
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      console.log(`%c[Performance] ${name}: ${duration.toFixed(2)}ms`, 'color: blue; font-weight: bold');
    };
  },
  
  /**
   * Wrap an async function to track its performance
   * @param fn The function to track
   * @param name The name of the operation
   * @returns A wrapped function that behaves the same but logs performance
   */
  async track<T>(fn: () => Promise<T>, name: string): Promise<T> {
    if (process.env.NODE_ENV !== 'development') {
      return fn();
    }
    
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      console.log(`%c[Performance] ${name}: ${(end - start).toFixed(2)}ms`, 'color: blue; font-weight: bold');
      return result;
    } catch (error) {
      const end = performance.now();
      console.log(
        `%c[Performance Error] ${name}: ${(end - start).toFixed(2)}ms`, 
        'color: red; font-weight: bold'
      );
      throw error;
    }
  }
};

export default { useComponentLifecycleLogger, measurePerformance, PerformanceTracker };
