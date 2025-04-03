
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Record API usage metrics for monitoring purposes
 */
export const recordApiUsage = async (
  endpoint: string,
  method: string,
  statusCode: number,
  responseTimeMs: number,
  userId?: string,
  errorMessage?: string,
  requestPayload?: any
): Promise<void> => {
  try {
    await supabase.from('api_usage_metrics').insert({
      endpoint,
      method,
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      user_id: userId,
      error_message: errorMessage,
      request_payload: requestPayload ? JSON.stringify(requestPayload) : null
    });
  } catch (error) {
    console.error('Failed to record API usage:', error);
  }
};

/**
 * Record client errors for debugging and monitoring
 */
export const recordClientError = async (
  errorMessage: string,
  errorStack?: string,
  componentName?: string
): Promise<string | null> => {
  try {
    // Get current user information
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get browser and URL information
    const browserInfo = navigator.userAgent;
    const url = window.location.href;
    
    // First try to use the database function
    try {
      const { data, error } = await supabase.rpc(
        'record_client_error',
        {
          p_error_message: errorMessage,
          p_error_stack: errorStack || null,
          p_component_name: componentName || null,
          p_user_id: user?.id || null,
          p_browser_info: browserInfo,
          p_url: url
        }
      );
      
      if (error) throw error;
      return data;
    } catch (rpcError) {
      console.warn('RPC error, falling back to direct insert:', rpcError);
      
      // Fallback to direct table insert if RPC fails
      const { data, error } = await supabase
        .from('client_errors')
        .insert({
          error_message: errorMessage,
          error_stack: errorStack,
          component_name: componentName,
          user_id: user?.id,
          browser_info: browserInfo,
          url: url
        })
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    }
  } catch (error) {
    console.error('Failed to record client error:', error);
    return null;
  }
};
