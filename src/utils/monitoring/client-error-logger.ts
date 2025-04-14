
import { supabase } from '@/integrations/supabase/client';

interface ErrorLogData {
  error_message: string;
  component_name?: string;
  error_stack?: string;
  browser_info?: string;
  url?: string;
  user_id?: string;
  session_id?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

/**
 * Utility for logging client-side errors to the database
 */
export class ClientErrorLogger {
  private static initialized: boolean = false;
  private static errorQueue: ErrorLogData[] = [];
  private static flushInterval: number | null = null;
  
  /**
   * Initialize the error logger
   */
  static initialize(): void {
    if (this.initialized) return;
    
    console.info("ClientErrorLogger initialized");
    
    // Setup error event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleWindowError);
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
      
      // Set up interval to flush errors
      this.flushInterval = window.setInterval(this.flushErrorQueue, 30000);
    }
    
    this.initialized = true;
  }
  
  /**
   * Clean up event listeners
   */
  static cleanup(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('error', this.handleWindowError);
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
      
      if (this.flushInterval !== null) {
        window.clearInterval(this.flushInterval);
        this.flushInterval = null;
      }
    }
    
    this.initialized = false;
    console.info("ClientErrorLogger cleanup complete");
  }
  
  /**
   * Log an error
   */
  static logError(
    error: Error | string,
    componentName?: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    try {
      const errorMessage = error instanceof Error ? error.message : error;
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      this.logErrorToQueue(
        errorMessage,
        errorStack,
        componentName,
        userId,
        metadata
      );
    } catch (err) {
      console.error('Error in ClientErrorLogger.logError:', err);
    }
  }
  
  /**
   * Handle window error events
   */
  private static handleWindowError = (event: ErrorEvent): void => {
    if (!event.error) return;
    
    this.logErrorToQueue(
      event.error.message || 'Unknown Error',
      event.error.stack,
      'Window',
      undefined,
      { type: 'window', filename: event.filename, lineno: event.lineno, colno: event.colno }
    );
  }
  
  /**
   * Handle unhandled promise rejections
   */
  private static handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const error = event.reason;
    
    this.logErrorToQueue(
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : undefined,
      'Promise',
      undefined,
      { type: 'unhandledRejection' }
    );
  }
  
  /**
   * Log an error to the database
   */
  private static logErrorToQueue(
    errorMessage: string,
    errorStack?: string,
    componentName?: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    try {
      const errorData: ErrorLogData = {
        error_message: errorMessage,
        component_name: componentName,
        error_stack: errorStack,
        browser_info: this.getBrowserInfo(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        user_id: userId,
        session_id: this.getSessionId(),
        timestamp: new Date().toISOString(),
        metadata
      };
      
      // Add to queue for batch processing
      this.errorQueue.push(errorData);
      
      // If queue is getting large, flush immediately
      if (this.errorQueue.length >= 10) {
        this.flushErrorQueue();
      }
    } catch (err) {
      console.error('Error in ClientErrorLogger.logErrorToQueue:', err);
    }
  }
  
  /**
   * Flush the error queue to the database
   */
  private static flushErrorQueue = async (): Promise<void> => {
    if (this.errorQueue.length === 0) return;
    
    const errors = [...this.errorQueue];
    this.errorQueue = [];
    
    try {
      // Insert errors in batches
      const { error } = await supabase
        .from('client_errors')
        .insert(errors);
        
      if (error) {
        console.error('Error logging client errors to database:', error);
        
        // Re-queue errors on failure
        this.errorQueue = [...errors, ...this.errorQueue];
      }
    } catch (err) {
      console.error('Error in ClientErrorLogger.flushErrorQueue:', err);
      
      // Re-queue errors on failure
      this.errorQueue = [...errors, ...this.errorQueue];
    }
  }
  
  /**
   * Get browser information
   */
  private static getBrowserInfo(): string {
    if (typeof window === 'undefined') return 'Server';
    
    const { userAgent } = window.navigator;
    return userAgent;
  }
  
  /**
   * Get or create a session ID
   */
  private static getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('error_session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('error_session_id', sessionId);
    }
    
    return sessionId;
  }
}

// Helper function to simplify logging errors
export function logError(
  error: Error | string,
  componentName?: string,
  userId?: string, 
  metadata?: Record<string, any>
): void {
  ClientErrorLogger.logError(error, componentName, userId, metadata);
}
