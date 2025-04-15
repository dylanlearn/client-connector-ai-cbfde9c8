
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';

interface ErrorHandlerOptions {
  componentName?: string;
  showToast?: boolean;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { componentName = 'UnknownComponent', showToast = true } = options;
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: unknown, context?: string) => {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorObj = err instanceof Error ? err : new Error(errorMessage);
    
    // Log error to console with component context
    console.error(`[${componentName}] ${context || 'Error'}:`, err);
    
    // Set the error state
    setError(errorObj);
    
    // Record error for monitoring
    recordClientError(
      errorMessage,
      err instanceof Error ? err.stack : undefined,
      componentName
    ).catch(console.error);
    
    // Show toast notification if enabled
    if (showToast) {
      toast.error('An error occurred', {
        description: errorMessage
      });
    }

    return errorObj;
  }, [componentName, showToast]);

  // Utility to wrap async functions with error handling
  const wrapAsync = useCallback(async <T>(
    fn: () => Promise<T>,
    rethrow: boolean = false,
    context?: string
  ): Promise<T | null> => {
    try {
      return await fn();
    } catch (error) {
      const handledError = handleError(error, context);
      if (rethrow) {
        throw handledError;
      }
      return null;
    }
  }, [handleError]);

  return {
    error,
    clearError,
    handleError,
    wrapAsync,
    setError
  };
}
