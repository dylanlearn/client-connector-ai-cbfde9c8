
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define types for tables not included in the generated types
export type SystemStatus = "normal" | "warning" | "critical";

interface SystemMonitoringRecord {
  component: string;
  status: SystemStatus;
  value?: number;
  threshold?: number;
  message?: string;
  metadata?: Record<string, any>;
  event_type?: string;
  created_at?: string;
  id?: string;
}

interface MonitoringConfiguration {
  component: string;
  warning_threshold: number;
  critical_threshold: number;
  check_interval: number;
  enabled: boolean;
  notification_enabled: boolean;
}

interface RateLimitCounter {
  id: string;
  key: string;
  endpoint: string;
  tokens: number;
  last_refill: string;
  user_id?: string;
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

interface ApiUsageMetric {
  id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  request_timestamp: string;
  user_id?: string;
  ip_address?: string;
  error_message?: string;
  request_payload?: any;
}

/**
 * Record a system status event in the database
 */
export const recordSystemStatus = async (
  component: string,
  status: SystemStatus,
  value?: number,
  threshold?: number,
  message?: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  try {
    // Prepare the record
    const record: SystemMonitoringRecord = {
      component,
      status,
      value,
      threshold,
      message,
      metadata,
      event_type: 'status_update',
    };
    
    // Insert into the database using type assertion
    const { error } = await (supabase
      .from('system_monitoring' as any)
      .insert(record as any));
      
    if (error) {
      console.error('Error recording system status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in recordSystemStatus:', error);
    return false;
  }
};

/**
 * Get configuration for a monitoring component
 */
export const getMonitoringConfiguration = async (component: string): Promise<MonitoringConfiguration | null> => {
  try {
    const { data, error } = await (supabase
      .from('monitoring_configuration' as any)
      .select('*')
      .eq('component', component)
      .maybeSingle()) as any;
      
    if (error) {
      console.error('Error fetching monitoring configuration:', error);
      return null;
    }
    
    return data as MonitoringConfiguration;
  } catch (error) {
    console.error('Error in getMonitoringConfiguration:', error);
    return null;
  }
};

/**
 * Check API rate limits
 */
export const checkRateLimits = async (
  endpoint: string,
  key: string,
  limit: number = 10
): Promise<boolean> => {
  try {
    // First, get the current rate limit counter
    const { data, error } = await (supabase
      .from('rate_limit_counters' as any)
      .select('*')
      .eq('endpoint', endpoint)
      .eq('key', key)
      .maybeSingle()) as any;
      
    if (error) {
      console.error('Error checking rate limits:', error);
      return false;
    }
    
    const counter = data as RateLimitCounter | null;
    
    if (!counter) {
      // No counter exists, create a new one
      await createRateLimitCounter(endpoint, key, limit);
      return true;
    }
    
    // Check if tokens are available
    if (counter.tokens > 0) {
      // Use a token and update the counter
      await decrementRateLimitCounter(counter.id);
      return true;
    }
    
    // Check if refill time has passed
    const lastRefill = new Date(counter.last_refill);
    const now = new Date();
    const hoursSinceRefill = (now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceRefill >= 1) {
      // Refill tokens and update counter
      await refillRateLimitCounter(counter.id, limit);
      return true;
    }
    
    // Rate limit exceeded
    return false;
  } catch (error) {
    console.error('Error in checkRateLimits:', error);
    return false;
  }
};

/**
 * Create a new rate limit counter
 */
const createRateLimitCounter = async (
  endpoint: string,
  key: string,
  tokens: number
): Promise<boolean> => {
  try {
    const { error } = await (supabase
      .from('rate_limit_counters' as any)
      .insert({
        endpoint,
        key,
        tokens: tokens - 1, // Use one token immediately
        last_refill: new Date().toISOString()
      })) as any;
      
    if (error) {
      console.error('Error creating rate limit counter:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createRateLimitCounter:', error);
    return false;
  }
};

/**
 * Decrement the tokens in a rate limit counter
 */
const decrementRateLimitCounter = async (id: string): Promise<boolean> => {
  try {
    const { error } = await (supabase
      .from('rate_limit_counters' as any)
      .update({ tokens: supabase.rpc('decrement', { x: 1 }) })
      .eq('id', id)) as any;
      
    if (error) {
      console.error('Error updating rate limit counter:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in decrementRateLimitCounter:', error);
    return false;
  }
};

/**
 * Refill the tokens in a rate limit counter
 */
const refillRateLimitCounter = async (id: string, tokens: number): Promise<boolean> => {
  try {
    const { error } = await (supabase
      .from('rate_limit_counters' as any)
      .update({
        tokens: tokens - 1, // Use one token immediately
        last_refill: new Date().toISOString()
      })
      .eq('id', id)) as any;
      
    if (error) {
      console.error('Error refilling rate limit counter:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in refillRateLimitCounter:', error);
    return false;
  }
};

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
