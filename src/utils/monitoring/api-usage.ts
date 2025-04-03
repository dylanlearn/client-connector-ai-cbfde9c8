
import { supabase } from "@/integrations/supabase/client";

/**
 * Record API usage metrics
 */
export const recordApiUsage = async (
  endpoint: string,
  method: string,
  statusCode: number,
  responseTimeMs: number,
  userId?: string,
  ipAddress?: string,
  errorMessage?: string,
  requestPayload?: any
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('api_usage_metrics')
      .insert({
        endpoint,
        method,
        status_code: statusCode,
        response_time_ms: responseTimeMs,
        user_id: userId,
        ip_address: ipAddress,
        error_message: errorMessage,
        request_payload: requestPayload,
        request_timestamp: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error recording API usage:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in recordApiUsage:', error);
    return false;
  }
};

/**
 * Record client-side errors for monitoring
 */
export const recordClientError = async (
  errorMessage: string,
  errorStack?: string,
  componentName?: string,
  userId?: string
): Promise<boolean> => {
  try {
    // Use type assertion to tell TypeScript that this table exists
    // This is necessary because the client_errors table is created dynamically by the edge function
    const { error } = await supabase
      .from('client_errors' as any)
      .insert({
        error_message: errorMessage,
        error_stack: errorStack,
        component_name: componentName,
        user_id: userId,
        browser_info: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error recording client error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in recordClientError:', error);
    return false;
  }
};
