
/**
 * Utility for logging and tracking client errors
 */
export class ClientErrorLogger {
  private static isInitialized = false;
  private static errors: Array<{
    message: string;
    componentName: string;
    timestamp: Date;
    userId?: string;
    stack?: string;
    metadata?: Record<string, any>;
  }> = [];
  
  /**
   * Initialize error logging
   */
  static initialize(): void {
    if (this.isInitialized) return;
    
    // Set up global error handlers
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    console.log('Client error logger initialized');
    this.isInitialized = true;
  }
  
  /**
   * Clean up event listeners
   */
  static cleanup(): void {
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    this.isInitialized = false;
  }
  
  /**
   * Handle global error events
   */
  private static handleGlobalError = (event: ErrorEvent): void => {
    this.logError(
      event.error || new Error(event.message),
      'GlobalErrorHandler',
      undefined,
      { 
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    );
  };
  
  /**
   * Handle unhandled promise rejections
   */
  private static handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
      
    this.logError(
      error,
      'UnhandledPromiseRejection'
    );
  };
  
  /**
   * Log an error with additional context
   */
  static logError(
    error: Error | string,
    componentName: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;
    
    // Add to local collection
    this.errors.push({
      message: errorMessage,
      componentName,
      timestamp: new Date(),
      userId,
      stack: errorStack,
      metadata
    });
    
    // Log to console
    console.error(`[${componentName}] ${errorMessage}`);
    if (errorStack) {
      console.error(errorStack);
    }
    
    // In a real implementation, this would send to an API endpoint
  }

  /**
   * Log authentication errors specifically
   */
  static logAuthError(
    message: string,
    userId?: string,
    context?: Record<string, any>
  ): void {
    this.logError(
      message,
      'AuthenticationSystem',
      userId,
      { errorType: 'auth', context }
    );
  }
  
  /**
   * Get all logged errors
   */
  static getErrors(): Array<{
    message: string;
    componentName: string;
    timestamp: Date;
    userId?: string;
  }> {
    return this.errors.map(({ message, componentName, timestamp, userId }) => ({
      message,
      componentName,
      timestamp,
      userId
    }));
  }
  
  /**
   * Clear all logged errors
   */
  static clearErrors(): void {
    this.errors = [];
  }
}

/**
 * Helper function to log client errors with optional toast notification
 */
export function logClientError(
  error: Error | string,
  componentName: string,
  userId?: string,
  showToast: boolean = false,
  metadata?: Record<string, any>
): void {
  // Log the error using the ClientErrorLogger
  ClientErrorLogger.logError(error, componentName, userId, metadata);
  
  // Show a toast notification if requested
  if (showToast) {
    try {
      const toast = require('sonner').toast;
      toast.error("An error occurred", {
        description: "Our team has been notified"
      });
    } catch (e) {
      console.error("Failed to show toast notification:", e);
    }
  }
}
