
/**
 * Enterprise-grade utility functions for implementing retry logic across the application
 */

/**
 * Interface for retry options
 */
export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryableErrors?: (string | RegExp)[];
  onRetry?: (attempt: number, error: Error, delay: number) => void;
}

/**
 * Default retry options
 */
const defaultRetryOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
  retryableErrors: [/.*/], // By default, retry all errors
  onRetry: () => {}
};

/**
 * Executes a function with retry logic
 * @param fn The function to execute and potentially retry
 * @param options Retry configuration options
 * @returns The result of the function
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const opts = { ...defaultRetryOptions, ...options };
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      
      // If we've reached max retries, or the error is not retryable, throw it
      const isRetryable = opts.retryableErrors.some(pattern => 
        pattern instanceof RegExp
          ? pattern.test(error.message || '')
          : error.message?.includes(pattern)
      );

      if (attempt >= opts.maxRetries || !isRetryable) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffFactor, attempt - 1),
        opts.maxDelay
      );
      
      // Execute onRetry callback
      opts.onRetry(attempt, error, delay);
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Creates an abort controller that will automatically abort after a specified timeout
 * @param timeoutMs Timeout in milliseconds
 * @param onAbort Optional callback function to execute when aborted
 * @returns Object with the controller and cleanup function
 */
export function createAbortController(
  timeoutMs: number,
  onAbort?: () => void
): { controller: AbortController; clear: () => void } {
  const controller = new AbortController();
  
  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`Operation timed out after ${timeoutMs}ms`));
    onAbort?.();
  }, timeoutMs);
  
  const clear = () => clearTimeout(timeoutId);
  
  return { controller, clear };
}

/**
 * Creates a function that can be used with Promise.race to timeout a promise
 * @param ms Timeout in milliseconds
 * @param errorMessage Optional custom error message
 * @returns A promise that rejects after the specified timeout
 */
export function createTimeout(ms: number, errorMessage?: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage || `Operation timed out after ${ms}ms`));
    }, ms);
  });
}
