
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
    const { error } = await (supabase
      .from('api_usage_metrics' as any)
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
      })) as any;
      
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
