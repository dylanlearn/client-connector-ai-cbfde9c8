
/**
 * Track performance of a function execution
 * 
 * @param name The name of the function to track
 * @param fn The function to track
 * @param args Arguments to pass to the function
 * @returns The result of the function
 */
export function trackPerformance<T>(name: string, fn: (...args: any[]) => T, ...args: any[]): T {
  const startTime = performance.now();
  try {
    const result = fn(...args);
    const endTime = performance.now();
    console.log(`[Performance] ${name}: ${(endTime - startTime).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`[Performance Error] ${name}: ${(endTime - startTime).toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Track performance of an async function execution
 * 
 * @param name The name of the function to track
 * @param fn The async function to track
 * @param args Arguments to pass to the function
 * @returns A promise that resolves to the result of the function
 */
export async function trackAsyncPerformance<T>(name: string, fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await fn(...args);
    const endTime = performance.now();
    console.log(`[Performance] ${name}: ${(endTime - startTime).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`[Performance Error] ${name}: ${(endTime - startTime).toFixed(2)}ms`, error);
    throw error;
  }
}
