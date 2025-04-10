
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';

export type ErrorSeverity = 'warning' | 'error' | 'critical';

export interface ErrorHandlerOptions {
  toastOnError?: boolean;
  recordToDatabase?: boolean;
  defaultErrorMessage?: string;
  component?: string;
  retryCount?: number;
}

const defaultOptions: ErrorHandlerOptions = {
  toastOnError: true,
  recordToDatabase: true,
  defaultErrorMessage: 'An error occurred',
  retryCount: 0
};

/**
 * A hook that provides standardized error handling across the application
 */
export function useGlobalErrorHandler(options: ErrorHandlerOptions = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  /**
   * Handle an error with standardized reporting
   */
  const handleError = useCallback(async (
    err: unknown, 
    context?: string, 
    severity: ErrorSeverity = 'error'
  ) => {
    // Normalize the error
    const normalizedError = err instanceof Error
      ? err
      : new Error(typeof err === 'string' ? err : mergedOptions.defaultErrorMessage || 'Unknown error');
    
    console.error(`Error in ${mergedOptions.component || 'unknown component'}:`, normalizedError);
    
    // Set the error state
    setError(normalizedError);
    
    // Show toast notification if enabled
    if (mergedOptions.toastOnError) {
      const toastFn = severity === 'critical' ? toast.error : 
                     severity === 'warning' ? toast.warning : toast.error;
      
      toastFn(normalizedError.message, {
        description: context || 'Please try again or contact support',
      });
    }
    
    // Record to database if enabled
    if (mergedOptions.recordToDatabase) {
      try {
        await recordClientError(
          normalizedError.message,
          normalizedError.stack,
          `${mergedOptions.component}${context ? `: ${context}` : ''}`
        );
      } catch (recordError) {
        // Don't let errors in recording cause more problems
        console.error('Error recording client error:', recordError);
      }
    }
    
    return normalizedError;
  }, [mergedOptions]);
  
  /**
   * Wraps a promise with standardized loading, error handling and reporting
   */
  const wrapPromise = useCallback(async <T>(
    promise: Promise<T>,
    context?: string,
    options?: { silent?: boolean, retryCount?: number }
  ): Promise<T> => {
    if (!options?.silent) {
      setIsLoading(true);
    }
    setError(null);
    
    const retries = options?.retryCount ?? mergedOptions.retryCount ?? 0;
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await promise;
        if (!options?.silent) {
          setIsLoading(false);
        }
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        
        if (attempt < retries) {
          // Wait before retry using exponential backoff
          const delay = Math.pow(2, attempt) * 500;
          console.log(`Retry ${attempt + 1}/${retries} after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If we've exhausted all retries, handle the error
    if (!options?.silent) {
      setIsLoading(false);
    }
    
    if (lastError) {
      await handleError(lastError, context);
      throw lastError;
    }
    
    // This should never happen, but TypeScript requires it
    throw new Error('Unknown error occurred');
  }, [handleError, mergedOptions.retryCount]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    error,
    setError,
    clearError,
    isLoading,
    setIsLoading,
    handleError,
    wrapPromise
  };
}
