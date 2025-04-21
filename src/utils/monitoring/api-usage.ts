
import { supabase } from '@/integrations/supabase/client';
import { SystemMonitoringRecord } from './types';

/**
 * Fetch API usage metrics for a specified time period
 */
export async function getApiUsageMetrics(
  period: 'hour' | 'day' | 'week' | 'month'
): Promise<SystemMonitoringRecord[]> {
  try {
    // Determine time range based on period
    const now = new Date();
    let startTime: Date;
    
    switch (period) {
      case 'hour':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'week':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'day':
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    const { data, error } = await supabase
      .from('api_usage_metrics')
      .select('*')
      .gte('request_timestamp', startTime.toISOString())
      .order('request_timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching API usage metrics:', error);
      return [];
    }

    // Transform data into SystemMonitoringRecord format
    return data.map(record => ({
      timestamp: record.request_timestamp,
      component: record.endpoint.split('/').pop() || 'api',
      metric: 'responseTime',
      value: record.response_time_ms,
      status: getStatusFromResponseTime(record.response_time_ms)
    }));
  } catch (error) {
    console.error('Error in getApiUsageMetrics:', error);
    return [];
  }
}

/**
 * Record an API call to the metrics table
 */
export async function recordApiCall(
  endpoint: string, 
  method: string,
  statusCode: number, 
  responseTimeMs: number,
  payload?: any
): Promise<void> {
  try {
    await supabase.from('api_usage_metrics').insert({
      endpoint,
      method,
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      request_payload: payload ? JSON.stringify(payload) : null
    });
  } catch (error) {
    console.error('Error recording API call:', error);
  }
}

/**
 * Determine status based on response time
 */
function getStatusFromResponseTime(responseTimeMs: number): 'healthy' | 'warning' | 'critical' | 'unknown' {
  if (responseTimeMs < 300) return 'healthy';
  if (responseTimeMs < 1000) return 'warning';
  return 'critical';
}
