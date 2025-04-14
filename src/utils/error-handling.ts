import { toast } from 'sonner';
import { logError } from './monitoring/client-error-logger';
import { recordClientError } from './monitoring/api-usage';

/**
 * Error handling utility functions
 */

/**
 * Creates an error handler function for a specific component
 * 
 * @param componentName Name of the component for error tracking
 * @param userId Optional user ID for error tracking
 * @returns Error handler function
 */
export function createErrorHandler(componentName: string, userId?: string) {
  return (error: unknown) => {
    const errorMessage = error instanceof Error ? error : String(error);
    
    // Log the error
    logError(errorMessage, componentName, userId);
    
    // Show toast notification
    toast.error("An error occurred", {
      description: "Our team has been notified",
      duration: 5000,
    });
    
    // Return the error for optional chaining
    return error instanceof Error ? error : new Error(String(error));
  };
}

/**
 * Safe function execution with error handling
 * 
 * @param fn Function to execute
 * @param errorHandler Error handler function
 * @param args Arguments to pass to the function
 * @returns Result of the function or undefined if an error occurred
 */
export function safeExecute<T, A extends any[]>(
  fn: (...args: A) => T,
  errorHandler: (error: unknown) => void,
  ...args: A
): T | undefined {
  try {
    return fn(...args);
  } catch (error) {
    errorHandler(error);
    return undefined;
  }
}

/**
 * Wraps a function with error handling
 * 
 * @param fn Function to wrap
 * @param componentName Component name for error reporting
 * @param userId Optional user ID
 * @returns Wrapped function
 */
export function withErrorHandling<T, A extends any[]>(
  fn: (...args: A) => T,
  componentName: string,
  userId?: string
): (...args: A) => T | undefined {
  const errorHandler = createErrorHandler(componentName, userId);
  
  return (...args: A) => {
    return safeExecute(fn, errorHandler, ...args);
  };
}

/**
 * Async version of safeExecute
 * 
 * @param fn Async function to execute
 * @param errorHandler Error handler function
 * @param args Arguments to pass to the function
 * @returns Promise resolving to the function result or undefined
 */
export async function safeExecuteAsync<T, A extends any[]>(
  fn: (...args: A) => Promise<T>,
  errorHandler: (error: unknown) => void,
  ...args: A
): Promise<T | undefined> {
  try {
    return await fn(...args);
  } catch (error) {
    errorHandler(error);
    return undefined;
  }
}

/**
 * Wraps an async function with error handling
 * 
 * @param fn Async function to wrap
 * @param componentName Component name for error reporting
 * @param userId Optional user ID
 * @returns Wrapped async function
 */
export function withAsyncErrorHandling<T, A extends any[]>(
  fn: (...args: A) => Promise<T>,
  componentName: string,
  userId?: string
): (...args: A) => Promise<T | undefined> {
  const errorHandler = createErrorHandler(componentName, userId);
  
  return async (...args: A) => {
    return await safeExecuteAsync(fn, errorHandler, ...args);
  };
}

/**
 * Parses an error into a standardized error object
 * 
 * @param error Any error object or value
 * @returns Standardized error object with message and optional additional details
 */
export function parseError(error: unknown): { 
  message: string; 
  details?: Record<string, any>;
  originalError?: unknown;
} {
  if (error instanceof Error) {
    return { 
      message: error.message,
      details: { 
        name: error.name,
        stack: error.stack
      },
      originalError: error
    };
  }
  
  if (typeof error === 'string') {
    return { message: error };
  }
  
  // Fallback
  return { message: `Unknown error: ${String(error)}`, originalError: error };
}
