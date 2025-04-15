
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';
import { DebugLogger } from '@/utils/monitoring/debug-logger';

export function useErrorHandler(options: { componentName?: string; showToast?: boolean } = {}) {
  const { componentName = 'UnknownComponent', showToast = true } = options;
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: unknown, context?: string) => {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorObj = err instanceof Error ? err : new Error(errorMessage);
    
    // Enhanced error logging with context
    DebugLogger.error(`Error in ${componentName}`, {
      context,
      metadata: {
        error: errorObj,
        timestamp: new Date().toISOString(),
        source: componentName,
        userAgent: navigator.userAgent,
        location: window.location.href
      }
    });
    
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
    ).catch(e => DebugLogger.error('Failed to record client error', { metadata: { error: e }}));
    
    // Show toast notification if enabled
    if (showToast) {
      toast.error('An error occurred', {
        description: errorMessage,
        duration: 5000
      });
    }

    return errorObj;
  }, [componentName, showToast]);

  // Optimized utility to wrap async functions with error handling and debugging
  const wrapAsync = useCallback(async <T>(
    fn: () => Promise<T>,
    rethrow: boolean = false,
    context?: string
  ): Promise<T | null> => {
    const operationId = `${componentName}-${Date.now()}`;
    DebugLogger.startTimer(operationId);
    DebugLogger.info(`Starting async operation${context ? `: ${context}` : ''}`, {
      context: componentName,
      metadata: { operationId }
    });
    
    try {
      const result = await fn();
      
      DebugLogger.info(`Operation completed successfully`, {
        context: componentName,
        metadata: { operationId }
      });
      DebugLogger.endTimer(operationId);
      
      return result;
    } catch (error) {
      DebugLogger.endTimer(operationId);
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
