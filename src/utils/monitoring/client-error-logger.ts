
import { supabase } from "@/integrations/supabase/client";
import { ClientError } from "./types";
import { toast } from "sonner";

/**
 * Utility for logging client-side errors
 */
export const ClientErrorLogger = {
  /**
   * Log an error to the server and optionally display a toast
   */
  logError: async (
    error: Error | string,
    componentName?: string,
    showToast: boolean = false,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    const errorMessage = error instanceof Error ? error.message : error;
    const stackTrace = error instanceof Error ? error.stack : undefined;
    
    try {
      // Get browser information
      const browser = navigator.userAgent;
      
      // Create error object
      const clientError: Omit<ClientError, 'id'> = {
        message: errorMessage,
        stackTrace,
        componentName,
        browser,
        timestamp: new Date().toISOString(),
        resolved: false,
        metadata
      };
      
      // Try to get user ID if logged in
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          clientError.userId = data.user.id;
        }
      } catch (authError) {
        console.error('Error getting user:', authError);
      }
      
      // Log to console
      console.error('Client error:', {
        message: errorMessage,
        component: componentName,
        stack: stackTrace
      });
      
      // Send error to server
      const { error: supabaseError } = await supabase
        .from('client_errors')
        .insert(clientError);
      
      if (supabaseError) {
        console.error('Error logging client error to server:', supabaseError);
        return false;
      }
      
      if (showToast) {
        toast.error('An error occurred', {
          description: errorMessage.substring(0, 100) + (errorMessage.length > 100 ? '...' : '')
        });
      }
      
      return true;
    } catch (loggingError) {
      console.error('Error in logError:', loggingError);
      return false;
    }
  },
  
  /**
   * Clear stored errors (primarily for testing)
   */
  cleanup: async (): Promise<void> => {
    try {
      // In a real system, you'd want to limit this to test environments
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
        await supabase.from('client_errors').delete().neq('id', '0');
      }
    } catch (error) {
      console.error('Error cleaning up error logs:', error);
    }
  }
};

/**
 * Utility function for recording client errors from API/components
 */
export async function recordClientError(
  message: string,
  stackTrace?: string,
  componentName?: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    const clientError: Omit<ClientError, 'id'> = {
      message,
      stackTrace,
      componentName,
      userId,
      timestamp: new Date().toISOString(),
      browser: navigator.userAgent,
      resolved: false,
      metadata
    };
    
    const { error } = await supabase.from('client_errors').insert(clientError);
    
    if (error) {
      console.error('Error recording client error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in recordClientError:', error);
    return false;
  }
}
