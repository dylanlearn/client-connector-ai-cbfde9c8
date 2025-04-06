
import { supabase } from "@/integrations/supabase/client";
import type { ClientError, ApiUsageRecord } from "./types";

/**
 * Record client-side errors to the database
 */
export async function recordClientError(
  errorMessage: string,
  errorStack?: string | null,
  componentName?: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const clientError: ClientError = {
      error_message: errorMessage,
      error_stack: errorStack || undefined,
      component_name: componentName,
      user_id: userId,
      url: window.location.href,
      browser_info: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    if (metadata) {
      clientError.metadata = metadata;
    }

    const { error } = await supabase
      .from('client_errors')
      .insert(clientError);

    if (error) {
      console.error('Error recording client error:', error);
    }
  } catch (err) {
    console.error('Failed to record client error:', err);
  }
}

/**
 * Record API usage metrics
 */
export async function recordApiUsage(record: Omit<ApiUsageRecord, 'id' | 'request_timestamp'>): Promise<void> {
  try {
    const apiRecord: Omit<ApiUsageRecord, 'id'> = {
      ...record,
      request_timestamp: new Date().toISOString()
    };

    const { error } = await supabase
      .from('api_usage')
      .insert(apiRecord);

    if (error) {
      console.error('Error recording API usage:', error);
    }
  } catch (err) {
    console.error('Failed to record API usage:', err);
  }
}

/**
 * Fetch API usage metrics for a specified time period
 */
export async function getApiUsageMetrics(days: number = 7): Promise<ApiUsageRecord[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('api_usage')
      .select('*')
      .gte('request_timestamp', startDate.toISOString())
      .order('request_timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching API usage metrics:', error);
      return [];
    }

    return data as ApiUsageRecord[];
  } catch (err) {
    console.error('Failed to get API usage metrics:', err);
    return [];
  }
}

/**
 * Calculate aggregate API metrics for dashboards
 */
export async function calculateApiMetrics(days: number = 7): Promise<{
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  requestsByEndpoint: Record<string, number>;
}> {
  try {
    const apiData = await getApiUsageMetrics(days);
    
    if (!apiData.length) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0,
        requestsByEndpoint: {}
      };
    }

    const totalRequests = apiData.length;
    const totalResponseTime = apiData.reduce((sum, record) => sum + record.response_time_ms, 0);
    const averageResponseTime = totalResponseTime / totalRequests;
    const errorRequests = apiData.filter(record => record.status_code >= 400).length;
    const errorRate = (errorRequests / totalRequests) * 100;

    const requestsByEndpoint: Record<string, number> = {};
    apiData.forEach(record => {
      const endpoint = record.endpoint;
      requestsByEndpoint[endpoint] = (requestsByEndpoint[endpoint] || 0) + 1;
    });

    return {
      totalRequests,
      averageResponseTime,
      errorRate,
      requestsByEndpoint
    };
  } catch (err) {
    console.error('Error calculating API metrics:', err);
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
      requestsByEndpoint: {}
    };
  }
}
