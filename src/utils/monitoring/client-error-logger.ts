
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Client Error Logger class for tracking and reporting client-side errors
 */
export class ClientErrorLogger {
  private static isInitialized = false;
  private static errorQueue: Array<{
    message: string;
    stack?: string;
    componentName?: string;
    userId?: string;
    metadata?: Record<string, any>;
    timestamp: string;
  }> = [];
  private static isProcessing = false;
  private static flushInterval: number | null = null;
  private static readonly batchSize = 10;
  private static readonly flushIntervalMs = 30000; // 30 seconds
  
  /**
   * Initialize the error logger with global handlers
   */
  public static initialize() {
    if (this.isInitialized) {
      return;
    }
    
    // Set up window error handler
    if (typeof window !== 'undefined') {
      window.onerror = (message, source, lineno, colno, error) => {
        this.logClientError({
          error_message: message as string,
          error_stack: error?.stack,
          url: source,
          browser_info: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
        
        // Don't prevent default handling
        return false;
      };
      
      // Set up unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        this.logClientError({
          error_message: `Unhandled Promise Rejection: ${event.reason}`,
          error_stack: event.reason?.stack,
          browser_info: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
      });
    }

    // Set up flush interval
    this.flushInterval = window.setInterval(() => {
      this.flushErrorQueue();
    }, this.flushIntervalMs);
    
    // Ensure errors are flushed before page unload
    window.addEventListener('beforeunload', () => {
      this.flushErrorQueue(true);
    });
    
    this.isInitialized = true;
    console.log('ClientErrorLogger initialized');
  }
  
  /**
   * Cleanup resources used by the error logger
   */
  public static cleanup() {
    if (this.flushInterval !== null) {
      window.clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // Flush any remaining errors
    this.flushErrorQueue(true);
    
    this.isInitialized = false;
  }
  
  /**
   * Log a client error to the backend
   */
  public static async logClientError(errorData: {
    error_message: string;
    component_name?: string;
    error_stack?: string;
    url?: string;
    user_id?: string;
    browser_info?: string;
    metadata?: Record<string, any>;
    timestamp?: string;
  }) {
    try {
      // Log to console first
      console.error('[Client Error]:', errorData.error_message, errorData);

      // Send to backend
      const { error } = await supabase
        .from('client_errors')
        .insert({
          ...errorData,
          timestamp: errorData.timestamp || new Date().toISOString()
        });
        
      if (error) {
        console.error('Failed to log client error to backend:', error);
      }
    } catch (err) {
      // Fallback logging
      console.error('Error in error logging:', err);
    }
  }
  
  /**
   * Log authentication-related errors
   */
  public static async logAuthError(errorData: {
    error_message: string;
    auth_action: string;
    error_code?: string;
    user_email?: string;
    metadata?: Record<string, any>;
  }) {
    return this.logClientError({
      error_message: `Auth error (${errorData.auth_action}): ${errorData.error_message}`,
      component_name: 'Authentication',
      metadata: {
        auth_action: errorData.auth_action,
        error_code: errorData.error_code,
        user_email: errorData.user_email,
        ...errorData.metadata
      }
    });
  }

  /**
   * Log errors with standardized formatting
   */
  public static logError(
    error: unknown, 
    componentName?: string,
    userId?: string,
    metadata?: Record<string, any>
  ) {
    // Normalize the error
    const errorObj = error instanceof Error 
      ? error 
      : new Error(typeof error === 'string' ? error : 'Unknown error');
    
    // Log to console
    console.error(`[${componentName || 'Unknown component'}]`, errorObj);

    // Add to queue for batch processing
    this.errorQueue.push({
      message: errorObj.message,
      stack: errorObj.stack,
      componentName,
      userId,
      metadata,
      timestamp: new Date().toISOString()
    });

    // If we've hit the batch size, flush the queue
    if (this.errorQueue.length >= this.batchSize) {
      this.flushErrorQueue();
    }

    // Show toast for critical errors
    if (metadata?.showToast) {
      toast.error("An error occurred", {
        description: "Our team has been notified",
        duration: 5000,
      });
    }

    return errorObj;
  }

  /**
   * Flush the error queue to the backend
   */
  private static async flushErrorQueue(immediate = false) {
    // Don't do anything if the queue is empty
    if (this.errorQueue.length === 0) {
      return;
    }

    // If already processing and not immediate, wait for next cycle
    if (this.isProcessing && !immediate) {
      return;
    }

    this.isProcessing = true;

    try {
      const errors = [...this.errorQueue];
      this.errorQueue = [];

      // Send batch to backend
      await supabase.rpc('batch_insert_client_errors', {
        errors: errors.map(err => ({
          error_message: err.message,
          component_name: err.componentName,
          error_stack: err.stack,
          user_id: err.userId,
          metadata: err.metadata,
          timestamp: err.timestamp
        }))
      });
    } catch (err) {
      console.error('Failed to flush error queue:', err);
      
      // If there was an error, put the errors back in the queue
      // but only if not flushing due to page unload
      if (!immediate) {
        // TODO: Better retry logic
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

// Export convenience functions
export const logClientError = ClientErrorLogger.logClientError.bind(ClientErrorLogger);
export const logAuthError = ClientErrorLogger.logAuthError.bind(ClientErrorLogger);
export const logError = ClientErrorLogger.logError.bind(ClientErrorLogger);
