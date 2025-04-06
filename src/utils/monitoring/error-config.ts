
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Error handling actions
export type ErrorAction = 'log' | 'notify' | 'retry' | 'fallback';

// Error severity levels
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

// Error handling configuration interface
export interface ErrorHandlingConfig {
  id?: string;
  component: string;
  error_type: string;
  action: ErrorAction;
  max_retries?: number;
  retry_delay_ms?: number;
  notification_endpoint?: string;
  severity: ErrorSeverity;
}

/**
 * Get error handling configuration for a specific component and error type
 */
export async function getErrorHandlingConfig(
  component: string,
  errorType: string
): Promise<ErrorHandlingConfig | null> {
  try {
    const { data, error } = await supabase.rpc('get_error_handling_config', {
      p_component: component,
      p_error_type: errorType
    });
    
    if (error) {
      console.error('Error fetching error handling config:', error);
      return null;
    }
    
    if (data && data.length > 0) {
      return data[0] as ErrorHandlingConfig;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get error handling config:', error);
    return null;
  }
}

/**
 * Handle an error based on the configured handling strategy
 */
export async function handleErrorWithConfig(
  component: string,
  errorType: string,
  error: Error,
  operation: () => Promise<any>,
  context?: Record<string, any>
): Promise<any> {
  try {
    // Get error handling configuration
    const config = await getErrorHandlingConfig(component, errorType);
    
    if (!config) {
      // Default error handling if no configuration is found
      console.error(`Unconfigured error [${component}/${errorType}]:`, error);
      return null;
    }
    
    // Handle error based on the configured action
    switch (config.action) {
      case 'log':
        // Simply log the error
        console.error(`[${config.severity.toUpperCase()}] [${component}/${errorType}]:`, error, context || {});
        return null;
        
      case 'notify':
        // Log and show notification
        console.error(`[${config.severity.toUpperCase()}] [${component}/${errorType}]:`, error, context || {});
        
        if (config.severity === 'critical' || config.severity === 'error') {
          toast.error(`Error in ${component}`, {
            description: error.message,
            duration: 5000
          });
        } else {
          toast.warning(`Warning in ${component}`, {
            description: error.message,
            duration: 4000
          });
        }
        return null;
        
      case 'retry':
        // Retry the operation with exponential backoff
        if (!config.max_retries || !config.retry_delay_ms) {
          console.error('Invalid retry configuration');
          return null;
        }
        
        return retryOperation(operation, config.max_retries, config.retry_delay_ms);
        
      case 'fallback':
        // Log the error and return a fallback value if provided
        console.error(`[${config.severity.toUpperCase()}] [${component}/${errorType}] (Using fallback):`, error);
        return context?.fallbackValue || null;
        
      default:
        console.error(`Unsupported error action [${config.action}]`);
        return null;
    }
  } catch (handlingError) {
    // Error while handling error (meta-error)
    console.error('Error while handling error:', handlingError);
    console.error('Original error:', error);
    return null;
  }
}

/**
 * Retry an operation with exponential backoff
 */
async function retryOperation(
  operation: () => Promise<any>,
  maxRetries: number,
  initialDelay: number
): Promise<any> {
  let attempt = 0;
  let lastError: any;
  
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      attempt++;
      
      // Skip delay on the last attempt
      if (attempt < maxRetries) {
        // Calculate exponential backoff delay
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`Operation failed after ${maxRetries} retries:`, lastError);
  throw lastError;
}

/**
 * Update or create error handling configuration
 */
export async function upsertErrorHandlingConfig(config: ErrorHandlingConfig): Promise<boolean> {
  try {
    if (config.id) {
      // Update existing configuration
      const { error } = await supabase
        .from('error_handling_config')
        .update({
          component: config.component,
          error_type: config.error_type,
          action: config.action,
          max_retries: config.max_retries,
          retry_delay_ms: config.retry_delay_ms,
          notification_endpoint: config.notification_endpoint,
          severity: config.severity
        })
        .eq('id', config.id);
        
      if (error) throw error;
    } else {
      // Insert new configuration
      const { error } = await supabase
        .from('error_handling_config')
        .insert({
          component: config.component,
          error_type: config.error_type,
          action: config.action,
          max_retries: config.max_retries,
          retry_delay_ms: config.retry_delay_ms,
          notification_endpoint: config.notification_endpoint,
          severity: config.severity
        });
        
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to upsert error handling config:', error);
    return false;
  }
}
