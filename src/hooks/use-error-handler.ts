
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';

export function useErrorHandler(options: { componentName?: string; showToast?: boolean } = {}) {
  const { componentName = 'UnknownComponent', showToast = true } = options;
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: unknown, context?: string) => {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorObj = err instanceof Error ? err : new Error(errorMessage);
    
    // Enhanced console logging for debugging
    console.group(`Error in ${componentName}`);
    console.error('Error details:', {
      message: errorMessage,
      stack: errorObj.stack,
      context,
      timestamp: new Date().toISOString()
    });
    console.groupEnd();
    
    // Set the error state
    setError(errorObj);
    
    // Record error for monitoring with enhanced metadata
    recordClientError(
      errorMessage,
      errorObj.stack,
      componentName,
      undefined,
      {
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        debug: true
      }
    ).catch(console.error);
    
    // Show toast notification if enabled
    if (showToast) {
      toast.error('An error occurred', {
        description: errorMessage,
        duration: 5000
      });
    }

    return errorObj;
  }, [componentName, showToast]);

  // Utility to wrap async functions with error handling and debugging
  const wrapAsync = useCallback(async <T>(
    fn: () => Promise<T>,
    rethrow: boolean = false,
    context?: string
  ): Promise<T | null> => {
    try {
      console.log(`[${componentName}] Starting async operation${context ? `: ${context}` : ''}`);
      const result = await fn();
      console.log(`[${componentName}] Operation completed successfully`);
      return result;
    } catch (error) {
      const handledError = handleError(error, context);
      if (rethrow) {
        throw handledError;
      }
      return null;
    }
  }, [handleError, componentName]);

  return {
    error,
    clearError,
    handleError,
    wrapAsync,
    setError
  };
}

