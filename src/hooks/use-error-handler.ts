
import { useState, useCallback } from 'react';
import { ErrorHandler } from '@/utils/error-handler';
import { AppError, ErrorType, ErrorResponse } from '@/types/error-types';

interface ErrorHandlerOptions {
  componentName: string;
  userId?: string;
  showToast?: boolean;
  reportToMonitoring?: boolean;
}

/**
 * Hook for standardized error handling in components
 */
export function useErrorHandler(options: ErrorHandlerOptions) {
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const componentName = options.componentName || 'UnknownComponent';
  
  /**
   * Handle an error with the standardized error handling logic
   */
  const handleError = useCallback((err: unknown, context?: string) => {
    const errorWithContext = err instanceof AppError 
      ? { ...err, context: { ...err.context, additionalContext: context } }
      : err;
    
    const normalizedError = ErrorHandler.handleError(
      errorWithContext, 
      componentName, 
      options.userId
    );
    
    setError(normalizedError);
    return normalizedError;
  }, [componentName, options.userId]);
  
  /**
   * Clear any stored errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  /**
   * Wrap an async function with standardized error handling and loading state
   */
  const wrapAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>, 
    loadingState: boolean = true,
    context?: string
  ): Promise<T | null> => {
    if (loadingState) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      return await asyncFn();
    } catch (err) {
      handleError(err, context);
      return null;
    } finally {
      if (loadingState) {
        setIsLoading(false);
      }
    }
  }, [handleError]);
  
  /**
   * Create a validation error
   */
  const createValidationError = useCallback((
    message: string, 
    fieldErrors?: Record<string, string>
  ) => {
    return AppError.validation(message, 
      fieldErrors ? Object.entries(fieldErrors).map(([field, details]) => ({
        code: 'INVALID_VALUE',
        field,
        details
      })) : undefined
    );
  }, []);
  
  return {
    error,
    setError,
    clearError,
    isLoading,
    setIsLoading,
    handleError,
    wrapAsync,
    createValidationError
  };
}
