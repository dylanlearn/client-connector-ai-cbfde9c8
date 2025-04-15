
import { useCallback } from 'react';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';

interface ErrorHandlerOptions {
  componentName?: string;
  showToast?: boolean;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { componentName = 'UnknownComponent', showToast = true } = options;

  const handleError = useCallback((error: unknown, context?: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Log error to console with component context
    console.error(`[${componentName}] ${context || 'Error'}:`, error);
    
    // Record error for monitoring
    recordClientError(
      errorMessage,
      error instanceof Error ? error.stack : undefined,
      componentName
    ).catch(console.error);
    
    // Show toast notification if enabled
    if (showToast) {
      toast.error('An error occurred', {
        description: errorMessage
      });
    }

    return error instanceof Error ? error : new Error(errorMessage);
  }, [componentName, showToast]);

  return handleError;
}
