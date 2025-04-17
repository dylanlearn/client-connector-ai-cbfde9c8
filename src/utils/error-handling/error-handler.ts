
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';
import { DebugLogger } from '@/utils/monitoring/debug-logger';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';
export type ErrorContext = Record<string, any>;

/**
 * Standardized error handler for consistent error handling across the application
 */
export class ErrorHandler {
  static async handle(
    error: unknown, 
    context: string, 
    options: {
      severity?: ErrorSeverity;
      componentName?: string;
      userId?: string;
      showToast?: boolean;
      recordError?: boolean;
      additionalContext?: ErrorContext;
    } = {}
  ): Promise<Error> {
    const {
      severity = 'error',
      componentName = 'Unknown',
      userId,
      showToast = true,
      recordError = true,
      additionalContext = {}
    } = options;
    
    // Normalize error to Error type
    const normalizedError = error instanceof Error 
      ? error 
      : new Error(typeof error === 'string' ? error : 'Unknown error');
    
    // Add structured context for debugging
    const errorContext = {
      timestamp: new Date().toISOString(),
      component: componentName,
      context,
      severity,
      userId,
      ...additionalContext
    };
    
    // Log to console with structured format
    console.error(`[${severity.toUpperCase()}] ${componentName}: ${normalizedError.message}`, {
      error: normalizedError,
      context: errorContext
    });
    
    // Log to debug logger if available
    DebugLogger.error(`${componentName} error: ${normalizedError.message}`, {
      context: componentName,
      metadata: {
        ...errorContext,
        stack: normalizedError.stack
      }
    });
    
    // Show toast notification if enabled
    if (showToast) {
      const toastFunction = 
        severity === 'critical' ? toast.error :
        severity === 'error' ? toast.error :
        severity === 'warning' ? toast.warning :
        toast.info;
      
      toastFunction(normalizedError.message, {
        description: context,
        duration: severity === 'critical' ? 8000 : 5000
      });
    }
    
    // Record to monitoring system if enabled
    if (recordError) {
      try {
        await recordClientError(
          normalizedError.message,
          normalizedError.stack,
          `${componentName}: ${context}`,
          userId,
          errorContext
        );
      } catch (recordingError) {
        // Don't let errors in recording cause more problems
        console.error('Error recording client error:', recordingError);
      }
    }
    
    return normalizedError;
  }
  
  /**
   * Create a specialized error handler for a specific component
   */
  static createHandler(
    componentName: string,
    defaultOptions: Partial<{
      showToast: boolean;
      recordError: boolean;
      userId: string;
    }> = {}
  ) {
    return {
      handleError: async (
        error: unknown, 
        context: string, 
        options: Partial<{
          severity: ErrorSeverity;
          showToast: boolean;
          recordError: boolean;
          additionalContext: ErrorContext;
        }> = {}
      ): Promise<Error> => {
        return ErrorHandler.handle(error, context, {
          componentName,
          ...defaultOptions,
          ...options
        });
      },
      
      wrapAsync: async <T>(
        fn: () => Promise<T>,
        context: string,
        options: Partial<{
          severity: ErrorSeverity;
          showToast: boolean;
          recordError: boolean;
          additionalContext: ErrorContext;
          rethrow: boolean;
        }> = {}
      ): Promise<T | null> => {
        try {
          return await fn();
        } catch (error) {
          await ErrorHandler.handle(error, context, {
            componentName,
            ...defaultOptions,
            ...options
          });
          
          if (options.rethrow) {
            throw error;
          }
          
          return null;
        }
      }
    };
  }
}

// Helper function to wrap any async operation with error handling
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string,
  componentName: string,
  options: Partial<{
    severity: ErrorSeverity;
    showToast: boolean;
    recordError: boolean;
    additionalContext: ErrorContext;
    rethrow: boolean;
  }> = {}
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    await ErrorHandler.handle(error, context, {
      componentName,
      ...options
    });
    
    if (options.rethrow) {
      throw error;
    }
    
    return null;
  }
}
