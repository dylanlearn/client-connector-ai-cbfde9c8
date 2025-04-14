
import { supabase } from '@/integrations/supabase/client';

/**
 * Client Error Logger class for tracking and reporting client-side errors
 */
export class ClientErrorLogger {
  private static isInitialized = false;
  
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
    
    this.isInitialized = true;
    console.log('ClientErrorLogger initialized');
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
}

export const logClientError = ClientErrorLogger.logClientError;
export const logAuthError = ClientErrorLogger.logAuthError;
