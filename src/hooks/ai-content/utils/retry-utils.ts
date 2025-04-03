
/**
 * Utility functions for handling retries and timeouts in API calls
 */

/**
 * Calculates backoff delay for retries using exponential backoff strategy
 * @param retryCount Current retry attempt number
 * @param baseDelay Base delay in milliseconds
 * @param maxDelay Maximum delay in milliseconds
 * @returns Delay in milliseconds to wait before next retry
 */
export function calculateBackoffDelay(
  retryCount: number, 
  baseDelay = 1000, 
  maxDelay = 5000
): number {
  return Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
}

/**
 * Creates an AbortController that will automatically abort after the specified timeout
 * @param timeoutMs Timeout in milliseconds
 * @param onTimeout Optional callback to execute when timeout occurs
 * @returns Object containing the AbortController and a function to clear the timeout
 */
export function createTimeoutController(
  timeoutMs: number,
  onTimeout?: () => void
): { controller: AbortController; clearTimeoutFn: () => void } {
  const controller = new AbortController();
  
  const timeoutId = setTimeout(() => {
    controller.abort();
    onTimeout?.();
  }, timeoutMs);
  
  const clearTimeoutFn = () => {
    clearTimeout(timeoutId);
  };
  
  return { controller, clearTimeoutFn };
}
