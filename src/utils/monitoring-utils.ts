/**
 * Core monitoring utilities that provide the foundation for more advanced monitoring features
 * This is intentionally kept simple for now but can be expanded with more sophisticated functionality
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type MonitoringEventType = 'request' | 'response' | 'error' | 'performance' | 'user-action';

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
 * Creates a structured log event
 * This is a simple implementation that can be replaced with a more sophisticated system later
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
 * Simple in-memory event buffer
 * This would be replaced with a proper backend service in a production implementation
 */
const eventBuffer: MonitoringEvent[] = [];
const MAX_BUFFER_SIZE = 100;

/**
 * Records a monitoring event
 * In a full implementation, this would send data to a backend monitoring service
 */
export const recordMonitoringEvent = (event: MonitoringEvent): void => {
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
  
  // In a real implementation, this would batch and send events to a backend
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
    recordMonitoringEvent(createMonitoringEvent('info', 'response', `Response: ${status} from ${endpoint}`, data, userId))
};

/**
 * Simple implementation of rate limiting using a token bucket algorithm
 * This is meant to be a client-side implementation for demonstration
 * In a real implementation, this would be server-side
 */
export class RateLimiter {
  private buckets: Map<string, { tokens: number; lastRefill: number }> = new Map();
  
  constructor(
    private readonly maxTokens: number = 10,
    private readonly refillRate: number = 1, // tokens per second
    private readonly refillInterval: number = 1000 // ms
  ) {}
  
  /**
   * Check if a request should be allowed based on the rate limit
   * Returns true if allowed, false if rate limited
   */
  public checkLimit(key: string): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(key);
    
    if (!bucket) {
      // First request for this key, initialize bucket
      bucket = { tokens: this.maxTokens - 1, lastRefill: now };
      this.buckets.set(key, bucket);
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
      return true;
    }
    
    return false;
  }
  
  /**
   * Reset the bucket for a key
   */
  public reset(key: string): void {
    this.buckets.delete(key);
  }
}

// Export a default rate limiter instance for API requests
export const apiRateLimiter = new RateLimiter(100, 10, 1000); // 100 requests, refilling at 10 per second
