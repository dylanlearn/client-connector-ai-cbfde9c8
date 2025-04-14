
import { supabase } from '@/integrations/supabase/client';

/**
 * Record API usage metrics
 */
export async function recordApiUsage(
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number,
  userId?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('api_usage_metrics')
      .insert({
        endpoint,
        method,
        status_code: statusCode,
        response_time: responseTime,
        user_id: userId,
        timestamp: new Date().toISOString(),
        client_info: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
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
}

/**
 * Record a client error
 */
export async function recordClientError(
  errorMessage: string,
  errorStack?: string,
  componentName?: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('client_errors')
      .insert({
        error_message: errorMessage,
        component_name: componentName,
        error_stack: errorStack,
        browser_info: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        user_id: userId,
        timestamp: new Date().toISOString(),
        metadata
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
}

/**
 * Get API usage statistics for a time period
 */
export async function getApiUsageStats(
  period: 'day' | 'week' | 'month'
): Promise<any> {
  try {
    // Calculate start date based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'day':
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
    }
    
    const { data, error } = await supabase
      .from('api_usage_metrics')
      .select('*')
      .gte('timestamp', startDate.toISOString());
      
    if (error) {
      console.error('Error fetching API usage stats:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getApiUsageStats:', error);
    return null;
  }
}
