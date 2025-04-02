
/**
 * Advanced monitoring utilities for enterprise-level application performance monitoring
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type MonitoringEventType = 'request' | 'response' | 'error' | 'performance' | 'user-action' | 'system';
export type SystemStatus = 'normal' | 'warning' | 'critical';

/**
 * Structured logging object for consistent monitoring data
 */
export interface MonitoringEvent {
  timestamp: string;
  level: LogLevel;
  type: MonitoringEventType;
  message: string;
  data?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  route?: string;
  duration?: number;
}

/**
 * System monitoring record for database persistence
 */
export interface SystemMonitoringRecord {
  event_type: string;
  component: string;
  status: SystemStatus;
  value?: number;
  threshold?: number;
  message?: string;
  metadata?: Record<string, any>;
}

/**
 * Creates a structured log event
 */
export const createMonitoringEvent = (
  level: LogLevel,
  type: MonitoringEventType,
  message: string,
  data?: Record<string, any>,
  userId?: string
): MonitoringEvent => {
  const sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('analytics_session_id') : undefined;
  
  return {
    timestamp: new Date().toISOString(),
    level,
    type,
    message,
    data,
    userId,
    sessionId,
    route: typeof window !== 'undefined' ? window.location.pathname : undefined
  };
};

/**
 * In-memory event buffer with configurable size
 */
const eventBuffer: MonitoringEvent[] = [];
const MAX_BUFFER_SIZE = 100;

/**
 * Records a monitoring event in memory and optionally to the database
 */
export const recordMonitoringEvent = async (event: MonitoringEvent, persistToDb = false): Promise<void> => {
  // Add to buffer
  eventBuffer.push(event);
  
  // Keep buffer size limited
  if (eventBuffer.length > MAX_BUFFER_SIZE) {
    eventBuffer.shift();
  }
  
  // In development, also log to console for visibility
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${event.level.toUpperCase()}] ${event.message}`, event);
  }
  
  // Persist to database if requested and we have a user ID
  if (persistToDb && event.userId && event.type === 'system') {
    try {
      const { data, error } = await supabase.from('system_monitoring').insert({
        event_type: event.type,
        component: event.data?.component || 'unknown',
        status: event.data?.status || 'normal',
        value: event.data?.value,
        threshold: event.data?.threshold,
        message: event.message,
        metadata: event.data || {}
      });

      if (error) {
        console.error('Error persisting monitoring event:', error);
      }
    } catch (error) {
      console.error('Failed to persist monitoring event:', error);
    }
  }
};

/**
 * Get recent monitoring events from memory
 */
export const getRecentEvents = (count: number = 10, level?: LogLevel): MonitoringEvent[] => {
  if (level) {
    return [...eventBuffer].filter(e => e.level === level).slice(-count);
  }
  return [...eventBuffer].slice(-count);
};

/**
 * Record system monitoring data to the database
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
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create a monitoring event
    const event = createMonitoringEvent(
      status === 'critical' ? 'error' : status === 'warning' ? 'warn' : 'info',
      'system',
      message || `System component ${component} is ${status}`,
      { component, status, value, threshold, ...metadata },
      user?.id
    );
    
    // Record the event with persistence
    await recordMonitoringEvent(event, true);
    
    // Show toast for warning and critical events
    if (status !== 'normal') {
      toast[status === 'critical' ? 'error' : 'warning'](
        status === 'critical' ? 'System Alert' : 'System Warning',
        { description: message || `System component ${component} is ${status}` }
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error recording system status:', error);
    return false;
  }
};

/**
 * Get system monitoring configuration from the database
 */
export const getMonitoringConfiguration = async (component: string): Promise<{
  warning_threshold: number;
  critical_threshold: number;
  enabled: boolean;
} | null> => {
  try {
    const { data, error } = await supabase
      .from('monitoring_configuration')
      .select('warning_threshold, critical_threshold, enabled')
      .eq('component', component)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching monitoring configuration:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get monitoring configuration:', error);
    return null;
  }
};

/**
 * Helper functions for common monitoring scenarios
 */
export const monitor = {
  debug: (message: string, data?: Record<string, any>, userId?: string) => 
    recordMonitoringEvent(createMonitoringEvent('debug', 'user-action', message, data, userId)),
    
  info: (message: string, data?: Record<string, any>, userId?: string) => 
    recordMonitoringEvent(createMonitoringEvent('info', 'user-action', message, data, userId)),
    
  warn: (message: string, data?: Record<string, any>, userId?: string) => 
    recordMonitoringEvent(createMonitoringEvent('warn', 'user-action', message, data, userId)),
    
  error: (message: string, data?: Record<string, any>, userId?: string) => 
    recordMonitoringEvent(createMonitoringEvent('error', 'error', message, data, userId)),
    
  performance: (operation: string, durationMs: number, data?: Record<string, any>, userId?: string) => 
    recordMonitoringEvent(createMonitoringEvent('info', 'performance', `Performance: ${operation}`, {
      ...data,
      durationMs
    }, userId)),
    
  request: (endpoint: string, method: string, data?: Record<string, any>, userId?: string) => 
    recordMonitoringEvent(createMonitoringEvent('info', 'request', `Request: ${method} ${endpoint}`, data, userId)),
    
  response: (endpoint: string, status: number, data?: Record<string, any>, userId?: string) => 
    recordMonitoringEvent(createMonitoringEvent('info', 'response', `Response: ${status} from ${endpoint}`, data, userId)),
    
  system: async (component: string, status: SystemStatus, value: number, threshold: number, message?: string, metadata?: Record<string, any>) => {
    return recordSystemStatus(component, status, value, threshold, message, metadata);
  }
};

/**
 * Enhanced rate limiter with database backing
 */
export class RateLimiter {
  private buckets: Map<string, { tokens: number; lastRefill: number }> = new Map();
  
  constructor(
    private readonly maxTokens: number = 10,
    private readonly refillRate: number = 1, // tokens per second
    private readonly refillInterval: number = 1000, // ms
    private readonly persistToDb: boolean = false
  ) {}
  
  /**
   * Check if a request should be allowed based on the rate limit
   */
  public async checkLimit(key: string, endpoint: string = 'default', userId?: string): Promise<boolean> {
    const now = Date.now();
    let bucket = this.buckets.get(key);
    
    // If persisting to DB and we have a userId, try to get from DB first
    if (this.persistToDb && userId) {
      try {
        const { data, error } = await supabase
          .from('rate_limit_counters')
          .select('tokens, last_refill')
          .eq('key', key)
          .eq('endpoint', endpoint)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (!error && data) {
          bucket = { 
            tokens: data.tokens, 
            lastRefill: new Date(data.last_refill).getTime()
          };
          this.buckets.set(key, bucket);
        }
      } catch (error) {
        console.error('Error fetching rate limit data:', error);
      }
    }
    
    if (!bucket) {
      // First request for this key, initialize bucket
      bucket = { tokens: this.maxTokens - 1, lastRefill: now };
      this.buckets.set(key, bucket);
      
      // Persist to DB if needed
      if (this.persistToDb && userId) {
        this.persistBucket(key, bucket, endpoint, userId);
      }
      
      return true;
    }
    
    // Calculate tokens to add based on time since last refill
    const elapsedTime = now - bucket.lastRefill;
    const tokensToAdd = Math.floor((elapsedTime / this.refillInterval) * this.refillRate);
    
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
    
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      
      // Persist to DB if needed
      if (this.persistToDb && userId) {
        this.persistBucket(key, bucket, endpoint, userId);
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Reset the bucket for a key
   */
  public async reset(key: string, endpoint: string = 'default', userId?: string): Promise<void> {
    this.buckets.delete(key);
    
    // Remove from DB if persisting
    if (this.persistToDb && userId) {
      try {
        await supabase
          .from('rate_limit_counters')
          .delete()
          .eq('key', key)
          .eq('endpoint', endpoint)
          .eq('user_id', userId);
      } catch (error) {
        console.error('Error resetting rate limit data:', error);
      }
    }
  }
  
  /**
   * Persist bucket to database
   */
  private async persistBucket(
    key: string, 
    bucket: { tokens: number; lastRefill: number }, 
    endpoint: string,
    userId: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('rate_limit_counters')
        .upsert({
          key,
          tokens: bucket.tokens,
          last_refill: new Date(bucket.lastRefill).toISOString(),
          endpoint,
          user_id: userId,
          ip_address: null // We could get this from the request in a real implementation
        });
        
      if (error) {
        console.error('Error persisting rate limit data:', error);
      }
    } catch (error) {
      console.error('Failed to persist rate limit data:', error);
    }
  }
}

// Export a default rate limiter instance for API requests
export const apiRateLimiter = new RateLimiter(100, 10, 1000);

// Export a database-backed rate limiter for authenticated API requests
export const dbBackedRateLimiter = new RateLimiter(100, 10, 1000, true);

/**
 * Record API usage metrics to the database
 */
export const recordApiUsage = async (
  endpoint: string,
  method: string,
  statusCode: number,
  responseTimeMs: number,
  userId?: string,
  payload?: any,
  errorMessage?: string
): Promise<void> => {
  try {
    // Only persist if we have a userId
    if (!userId) return;
    
    await supabase.from('api_usage_metrics').insert({
      endpoint,
      method,
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      user_id: userId,
      request_payload: payload,
      error_message: errorMessage
    });
  } catch (error) {
    console.error('Error recording API usage:', error);
  }
};

/**
 * Create a monitoring interceptor for API requests
 */
export const createApiMonitoringInterceptor = (userId?: string) => {
  const startTime = Date.now();
  
  return {
    onSuccess: (endpoint: string, method: string, response: any) => {
      const responseTime = Date.now() - startTime;
      recordApiUsage(
        endpoint,
        method,
        response.status || 200,
        responseTime,
        userId,
        undefined
      );
      monitor.response(endpoint, response.status || 200, { responseTime }, userId);
    },
    onError: (endpoint: string, method: string, error: any) => {
      const responseTime = Date.now() - startTime;
      recordApiUsage(
        endpoint,
        method,
        error.status || 500,
        responseTime,
        userId,
        undefined,
        error.message
      );
      monitor.error(`Error in ${method} ${endpoint}`, { error: error.message }, userId);
    }
  };
};
