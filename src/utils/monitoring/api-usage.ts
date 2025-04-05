
import { supabase } from "@/integrations/supabase/client";
import { ClientError } from "./types";

/**
 * Record API usage metrics
 */
export const recordApiUsage = async (
  endpoint: string,
  method: string,
  statusCode: number,
  responseTimeMs: number,
  errorMessage?: string,
  requestPayload?: any
): Promise<void> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Record the API usage
    await supabase
      .from('api_usage_metrics')
      .insert({
        endpoint,
        method,
        status_code: statusCode,
        response_time_ms: responseTimeMs,
        user_id: user?.id,
        error_message: errorMessage,
        request_payload: requestPayload ? JSON.parse(JSON.stringify(requestPayload)) : null
      });
  } catch (error) {
    console.error('Error recording API usage metrics:', error);
  }
};

/**
 * Record client-side errors
 */
export const recordClientError = async (
  errorMessage: string,
  errorStack?: string,
  componentName?: string
): Promise<void> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Gather browser info
    const browserInfo = navigator.userAgent;
    const url = window.location.href;
    
    // Use the database function to record the error
    await supabase.rpc(
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
  } catch (error) {
    console.error('Error recording client error:', error);
  }
};

/**
 * Get recent client errors
 */
export const getRecentClientErrors = async (limit: number = 50): Promise<ClientError[]> => {
  try {
    const { data, error } = await supabase
      .from('client_errors')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (error) {
      throw error;
    }
    
    return data as ClientError[];
  } catch (error) {
    console.error('Error getting recent client errors:', error);
    return [];
  }
};

/**
 * Get API usage statistics
 */
export const getApiUsageStatistics = async (
  timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'
): Promise<any> => {
  try {
    // Calculate the start date based on timeframe
    const now = new Date();
    let startDate: Date;
    
    switch (timeframe) {
      case 'hour':
        startDate = new Date(now.setHours(now.getHours() - 1));
        break;
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
    }
    
    // Query the database for usage statistics
    const { data, error } = await supabase
      .from('api_usage_metrics')
      .select(`
        endpoint,
        method,
        status_code,
        response_time_ms
      `)
      .gte('request_timestamp', startDate.toISOString());
      
    if (error) {
      throw error;
    }
    
    // Process the data to extract useful statistics
    const statistics = {
      totalRequests: data.length,
      averageResponseTime: data.reduce((sum, item) => sum + item.response_time_ms, 0) / data.length,
      successRate: data.filter(item => item.status_code >= 200 && item.status_code < 300).length / data.length * 100,
      errorRate: data.filter(item => item.status_code >= 400).length / data.length * 100,
      endpointCounts: {} as Record<string, number>,
      methodCounts: {} as Record<string, number>
    };
    
    // Count requests by endpoint and method
    data.forEach(item => {
      // Count by endpoint
      if (!statistics.endpointCounts[item.endpoint]) {
        statistics.endpointCounts[item.endpoint] = 0;
      }
      statistics.endpointCounts[item.endpoint]++;
      
      // Count by method
      if (!statistics.methodCounts[item.method]) {
        statistics.methodCounts[item.method] = 0;
      }
      statistics.methodCounts[item.method]++;
    });
    
    return statistics;
  } catch (error) {
    console.error('Error getting API usage statistics:', error);
    return null;
  }
};
