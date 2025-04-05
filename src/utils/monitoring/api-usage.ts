
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Record a client error to the database for monitoring
 */
export const recordClientError = async (
  message: string,
  stack?: string | null,
  component?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('client_errors')
      .insert({
        message,
        stack,
        component,
        browser_info: navigator.userAgent,
        url: window.location.href
      });
      
    if (error) {
      console.error('Error recording client error:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in recordClientError:', err);
    return false;
  }
};

/**
 * Record API usage to the monitoring system
 */
export const recordApiUsage = async (
  endpoint: string,
  responseTime: number,
  status: number,
  userId?: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('api_usage')
      .insert({
        endpoint,
        response_time_ms: responseTime,
        status_code: status,
        user_id: userId,
        metadata
      });
      
    if (error) {
      console.error('Error recording API usage:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in recordApiUsage:', err);
    return false;
  }
};

