import { toast } from 'sonner';
import { recordClientError } from './api-usage';

interface ErrorQueueItem {
  message: string;
  stack?: string | null;
  componentName: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

/**
 * Client Error Logger
 * 
 * A utility class for logging and batching client errors
 */
export class ClientErrorLogger {
  private static errorQueue: ErrorQueueItem[] = [];
  private static isProcessing: boolean = false;
  private static flushInterval: number | null = null;
  private static batchSize: number = 5;
  private static flushTimeoutMs: number = 30000; // 30 seconds
  
  /**
   * Initialize the error logger
   */
  public static initialize(): void {
    // Set up regular flushing of errors
    this.flushInterval = window.setInterval(() => {
      if (this.errorQueue.length > 0) {
        this.flushErrors();
      }
    }, this.flushTimeoutMs);
    
    // Ensure errors are flushed before page unload
    window.addEventListener('beforeunload', () => {
      if (this.errorQueue.length > 0) {
        this.flushErrors();
      }
    });
    
    console.log('ClientErrorLogger initialized');
  }
  
  /**
   * Clean up resources
   */
  public static cleanup(): void {
    if (this.flushInterval !== null) {
      window.clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }
  
  /**
   * Log an error
   * 
   * @param error Error object or message
   * @param componentName Component where the error occurred
   * @param userId Optional user ID
   * @param metadata Optional metadata
   */
  public static logError(
    error: Error | string, 
    componentName: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    const isErrorObject = error instanceof Error;
    
    const errorItem: ErrorQueueItem = {
      message: isErrorObject ? error.message : String(error),
      stack: isErrorObject ? error.stack || null : null,
      componentName,
      userId,
      metadata,
      timestamp: new Date().toISOString()
    };
    
    // Log to console
    console.error(`[${componentName}] ${errorItem.message}`, errorItem.stack || '');
    
    // Add to queue
    this.errorQueue.push(errorItem);
    
    // Flush immediately if we've reached the batch size
    if (this.errorQueue.length >= this.batchSize) {
      this.flushErrors();
    }
  }
  
  /**
   * Log an authentication error
   * 
   * @param message Error message
   * @param userId User ID
   * @param context Additional context
   */
  public static logAuthError(
    message: string,
    userId: string,
    context: Record<string, any>
  ): void {
    this.logError(message, 'AuthenticationSystem', userId, {
      errorType: 'auth',
      context
    });
  }
  
  /**
   * Flush errors to the backend
   */
  private static async flushErrors(): Promise<void> {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      const errors = [...this.errorQueue];
      this.errorQueue = [];
      
      // Process each error individually
      for (const error of errors) {
        await recordClientError(
          error.message,
          error.stack,
          error.componentName,
          error.userId,
          error.metadata
        );
      }
    } catch (error) {
      console.error('Error flushing client errors:', error);
      
      // Re-add the errors to the queue
      // this.errorQueue = [...this.errorQueue, ...errors];
      
      // To avoid potential circular references if the above line causes errors,
      // we'll keep this commented but available for reference
    } finally {
      this.isProcessing = false;
    }
  }
}

/**
 * Log a client error and optionally show a toast
 * 
 * @param error Error object or message
 * @param componentName Component name
 * @param userId Optional user ID
 * @param showToast Whether to show a toast
 * @param metadata Optional metadata
 */
export function logClientError(
  error: Error | string,
  componentName: string,
  userId?: string,
  showToast: boolean = true,
  metadata?: Record<string, any>
): void {
  ClientErrorLogger.logError(error, componentName, userId, metadata);
  
  if (showToast) {
    toast.error("An error occurred", {
      description: "Our team has been notified",
      duration: 5000,
    });
  }
}
