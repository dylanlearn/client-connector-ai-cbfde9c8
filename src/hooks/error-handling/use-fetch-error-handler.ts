
import { useState } from 'react';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';

export type ErrorSeverity = 'warning' | 'error' | 'critical';

export interface FetchErrorOptions {
  toastOnError?: boolean;
  recordToDatabase?: boolean;
  defaultErrorMessage?: string;
  component?: string;
  retryCount?: number;
}

const defaultOptions: FetchErrorOptions = {
  toastOnError: true,
  recordToDatabase: true,
  defaultErrorMessage: 'An error occurred while fetching data',
  retryCount: 0
};

/**
 * A custom hook for standardized fetch error handling across components
 */
export function useFetchErrorHandler(options: FetchErrorOptions = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  /**
   * Handle a fetch error with standardized reporting
   */
  const handleError = async (err: unknown, context?: string, severity: ErrorSeverity = 'error') => {
    // Normalize the error
    const normalizedError = err instanceof Error
      ? err
      : new Error(typeof err === 'string' ? err : mergedOptions.defaultErrorMessage || 'Unknown error');
    
    console.error(`Fetch error in ${mergedOptions.component || 'unknown component'}:`, normalizedError);
    
    // Set the error state
    setError(normalizedError);
    
    // Show toast notification if enabled
    if (mergedOptions.toastOnError) {
      toast.error(normalizedError.message, {
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
  };
  
  /**
   * Wraps a fetch promise with standardized loading, error handling and reporting
   */
  const wrapFetch = async <T>(
    fetchPromise: Promise<T>,
    context?: string,
    options?: { silent?: boolean }
  ): Promise<T> => {
    if (!options?.silent) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const result = await fetchPromise;
      return result;
    } catch (err) {
      await handleError(err, context);
      throw err;
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  };
  
  return {
    error,
    setError,
    isLoading,
    setIsLoading,
    handleError,
    wrapFetch
  };
}
