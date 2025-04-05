
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientErrorData {
  message: string;
  stack?: string | null;
  componentName?: string;
  userId?: string;
  browserInfo?: string;
  url?: string;
  metadata?: Record<string, any>; // Added metadata field for additional context
}

/**
 * Enhanced client error logger with database persistence and advanced debugging
 */
export class ClientErrorLogger {
  private static errorQueue: ClientErrorData[] = [];
  private static isProcessing = false;
  private static batchSize = 5;
  private static flushIntervalMs = 30000; // 30 seconds
  private static flushInterval: number | null = null;
  
  /**
   * Initialize the error logger system
   */
  static initialize() {
    // Set up periodic flush
    if (!this.flushInterval) {
      this.flushInterval = window.setInterval(() => {
        this.flush();
      }, this.flushIntervalMs);
      
      console.log('Client error logging system initialized');
      
      // Set up window unload handler to flush remaining errors
      window.addEventListener('beforeunload', () => {
        if (this.errorQueue.length > 0) {
          this.flush(true);
        }
      });
    }
  }
  
  /**
   * Log a client error with enhanced metadata
   */
  static async logError(
    error: Error | string, 
    componentName?: string, 
    userId?: string,
    metadata?: Record<string, any>
  ) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? null : error.stack;
    
    // Add to queue with enhanced metadata
    this.errorQueue.push({
      message: errorMessage,
      stack: errorStack,
      componentName,
      userId,
      browserInfo: navigator.userAgent,
      url: window.location.href,
      metadata
    });
    
    // If queue gets too large, flush immediately
    if (this.errorQueue.length >= this.batchSize) {
      this.flush();
    }
    
    // Also log to console with enhanced details
    console.error(
      `[CLIENT ERROR] ${componentName || 'Unknown'}: ${errorMessage}`, 
      metadata ? { metadata } : ''
    );
  }
  
  /**
   * Log authentication or authorization-related errors specifically
   */
  static logAuthError(
    error: Error | string,
    userId?: string,
    context?: Record<string, any>
  ) {
    this.logError(
      error,
      'AuthenticationSystem',
      userId,
      {
        errorType: 'auth',
        context
      }
    );
  }
  
  /**
   * Flush errors to database
   */
  static async flush(sync = false) {
    if (this.isProcessing || this.errorQueue.length === 0) return;
    
    this.isProcessing = true;
    const errors = [...this.errorQueue];
    this.errorQueue = [];
    
    try {
      // Process in batch using RPC for efficiency
      const { error } = await supabase.rpc('batch_insert_client_errors', {
        p_errors: errors
      });
      
      if (error) {
        console.error('Error batch inserting client errors:', error);
        // Put back in queue if failed
        this.errorQueue = [...errors, ...this.errorQueue];
      }
    } catch (error) {
      console.error('Error flushing client errors:', error);
      // Put back in queue if failed
      this.errorQueue = [...errors, ...this.errorQueue];
    } finally {
      this.isProcessing = false;
    }
  }
  
  /**
   * Clean up resources
   */
  static cleanup() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // Flush any remaining errors
    if (this.errorQueue.length > 0) {
      this.flush(true);
    }
  }
}

// Initialize on import
ClientErrorLogger.initialize();

/**
 * Convenience function for logging errors
 */
export function logClientError(
  error: Error | string, 
  componentName?: string, 
  userId?: string,
  metadata?: Record<string, any>
) {
  ClientErrorLogger.logError(error, componentName, userId, metadata);
  
  // Show toast for critical errors to improve UX
  if (typeof error === 'object' && error.message.includes('critical')) {
    toast.error("An error occurred", {
      description: "Our team has been notified"
    });
  }
}

/**
 * Convenience function for logging auth errors
 */
export function logAuthError(
  error: Error | string,
  userId?: string,
  context?: Record<string, any>
) {
  ClientErrorLogger.logAuthError(error, userId, context);
  
  // Show toast for auth errors
  toast.error("Authentication error", {
    description: typeof error === 'string' ? error : error.message
  });
}
