import { AppError, ErrorType, WireframeError, WireframeErrorType, ErrorResponse } from '@/types/error-types';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';

/**
 * Centralized error handler for the application
 */
export class ErrorHandler {
  /**
   * Handles an error with consistent logging, reporting and UI notifications
   */
  static handleError(error: unknown, componentName: string, userId?: string): ErrorResponse {
    // Normalize the error to our standard format
    const normalizedError = this.normalizeError(error);
    
    // Log to console
    console.error(`[${componentName}] ${normalizedError.message}`, normalizedError);
    
    // Record the error for monitoring
    this.recordError(normalizedError, componentName, userId);
    
    // Show user notification if appropriate
    this.showErrorNotification(normalizedError);
    
    // Return normalized error response
    return normalizedError;
  }
  
  /**
   * Normalizes various error types to our standard format
   */
  static normalizeError(error: unknown): ErrorResponse {
    if (error instanceof AppError) {
      return error.toResponse();
    }
    
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'ERR_UNKNOWN',
        timestamp: new Date().toISOString(),
        context: { stack: error.stack },
      };
    }
    
    // Handle string errors
    if (typeof error === 'string') {
      return {
        message: error,
        code: 'ERR_UNKNOWN',
        timestamp: new Date().toISOString(),
      };
    }
    
    // Handle other types
    return {
      message: 'An unknown error occurred',
      code: 'ERR_UNKNOWN',
      timestamp: new Date().toISOString(),
      context: { originalError: error },
    };
  }
  
  /**
   * Records the error to our monitoring system
   */
  static recordError(error: ErrorResponse, componentName: string, userId?: string): void {
    recordClientError(
      error.message,
      error.context?.stack as string | undefined,
      componentName,
      userId,
      {
        code: error.code,
        timestamp: error.timestamp,
        ...error.context
      }
    ).catch(console.error);
  }
  
  /**
   * Shows appropriate notification to the user based on error type
   */
  static showErrorNotification(error: ErrorResponse): void {
    // Determine if this error should be shown to the user
    const shouldShowToUser = !error.context?.silent;
    
    if (shouldShowToUser) {
      toast.error("Error", {
        description: this.getUserFriendlyMessage(error),
        duration: 5000,
      });
    }
  }
  
  /**
   * Gets a user-friendly message based on the error
   */
  static getUserFriendlyMessage(error: ErrorResponse): string {
    // Messages can be customized based on error codes or types
    const defaultMessage = 'Something went wrong. Please try again later.';
    
    // If we have a specific user message, use it
    if (error.context?.userMessage) {
      return String(error.context.userMessage);
    }
    
    // Otherwise, use the error message if it's suitable for end users
    return error.message || defaultMessage;
  }
  
  /**
   * Creates a validation error for invalid input parameters
   */
  static validationError(message: string, fieldErrors?: Record<string, string>): AppError {
    return AppError.validation(message, 
      fieldErrors ? Object.entries(fieldErrors).map(([field, details]) => ({
        code: 'INVALID_VALUE',
        field,
        details
      })) : undefined
    );
  }
  
  /**
   * Validates if the required fields are present in an object
   * Throws a validation error if validation fails
   */
  static validateRequired<T extends object>(
    obj: T, 
    requiredFields: Array<keyof T>, 
    objName: string = 'Object'
  ): void {
    const missingFields: Array<keyof T> = [];
    
    for (const field of requiredFields) {
      if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      throw this.validationError(
        `${objName} is missing required fields: ${missingFields.join(', ')}`,
        Object.fromEntries(missingFields.map(field => 
          [field as string, `${field} is required`]
        ))
      );
    }
  }
  
  /**
   * Wraps an async function with standardized error handling
   */
  static async wrapAsync<T>(
    fn: () => Promise<T>, 
    componentName: string, 
    userId?: string
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      this.handleError(error, componentName, userId);
      throw error;
    }
  }
}
