
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
    
    // Direct insert to the client_errors table
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
      
    if (error) {
      console.error('Error inserting client error:', error);
      return null;
    }
    
    return data?.id as string;
  } catch (error) {
    console.error('Failed to record client error:', error);
    return null;
  }
};
