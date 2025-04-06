
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClientErrorLogger } from "./client-error-logger";
import { recordApiUsage } from "./api-usage";
import { recordSystemStatus, SystemStatus } from "./system-status";
import { v4 as uuidv4 } from 'uuid';

// Service names for consistent reporting
export enum ServiceName {
  WIREFRAME = 'wireframe',
  CREATIVE_AI = 'creative_ai',
  SUBSCRIPTION = 'subscription',
  AUTH = 'auth',
  DESIGN_SUGGESTIONS = 'design_suggestions',
  A_B_TESTING = 'ab_testing',
  DATABASE = 'database',
  MEMORY = 'memory',
  API = 'api',
  INTEGRATION = 'integration'
}

// Severity levels for events
export enum Severity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Structured event data
export interface ObservabilityEvent {
  eventId: string;
  timestamp: string;
  service: ServiceName;
  operation: string;
  severity: Severity;
  userId?: string;
  message: string;
  duration?: number;
  metadata?: Record<string, any>;
  correlationId?: string;
  sessionId?: string;
}

// Performance data structure
export interface PerformanceData {
  operation: string;
  service: ServiceName;
  startTime: number;
  metadata?: Record<string, any>;
}

// Cache for active performance measurements
const activePerformanceTracking = new Map<string, PerformanceData>();

// Get a session ID that persists for the current browser session
const getSessionId = (): string => {
  if (!window.sessionStorage.getItem('observability_session_id')) {
    window.sessionStorage.setItem('observability_session_id', uuidv4());
  }
  return window.sessionStorage.getItem('observability_session_id') as string;
};

/**
 * Unified observability service for enterprise-level monitoring
 */
export const UnifiedObservability = {
  /**
   * Log an event to the observability system
   */
  logEvent: async (
    service: ServiceName,
    operation: string,
    severity: Severity,
    message: string,
    metadata?: Record<string, any>,
    userId?: string,
    correlationId?: string
  ): Promise<string> => {
    const eventId = uuidv4();
    const timestamp = new Date().toISOString();
    const sessionId = getSessionId();

    // Create structured event object
    const event: ObservabilityEvent = {
      eventId,
      timestamp,
      service,
      operation,
      severity,
      message,
      userId,
      metadata,
      correlationId,
      sessionId
    };

    // Log to console with appropriate styling
    const consoleStyles = {
      [Severity.DEBUG]: 'color: gray',
      [Severity.INFO]: 'color: blue',
      [Severity.WARNING]: 'color: orange',
      [Severity.ERROR]: 'color: red',
      [Severity.CRITICAL]: 'color: red; font-weight: bold',
    };
    
    console.log(
      `%c[${service}] ${operation}: ${message}`, 
      consoleStyles[severity] || '',
      metadata || ''
    );

    try {
      // Store in database for analysis
      await supabase
        .from('system_events')
        .insert([{
          event_id: eventId,
          service,
          operation,
          severity,
          message,
          user_id: userId,
          metadata,
          correlation_id: correlationId,
          session_id: sessionId
        }]);
      
      // Record system status for critical and error events
      if (severity === Severity.CRITICAL || severity === Severity.ERROR) {
        let status: SystemStatus = 'warning';
        if (severity === Severity.CRITICAL) status = 'critical';
        
        await recordSystemStatus(
          service,
          status,
          undefined,
          undefined,
          message,
          metadata
        );
        
        // Also log critical client errors
        if (severity === Severity.CRITICAL) {
          ClientErrorLogger.logError(
            new Error(`${service}/${operation}: ${message}`),
            `${service}-${operation}`,
            userId,
            metadata
          );
        }
      }
      
      // Show toast for critical events visible to the user
      if (severity === Severity.CRITICAL && 
          metadata?.showToast !== false) {
        toast.error(`System error in ${service}`, {
          description: message
        });
      }
      
    } catch (error) {
      // Don't fail the application if logging fails
      console.error('Failed to record observability event:', error);
    }
    
    return eventId;
  },
  
  /**
   * Start tracking performance for an operation
   */
  startPerformanceTracking: (
    service: ServiceName,
    operation: string,
    metadata?: Record<string, any>
  ): string => {
    const trackingId = uuidv4();
    activePerformanceTracking.set(trackingId, {
      service,
      operation,
      startTime: performance.now(),
      metadata
    });
    return trackingId;
  },
  
  /**
   * End tracking performance and log the result
   */
  endPerformanceTracking: async (
    trackingId: string,
    success: boolean = true,
    additionalMetadata?: Record<string, any>
  ): Promise<number> => {
    const performanceData = activePerformanceTracking.get(trackingId);
    if (!performanceData) {
      console.warn(`No performance tracking found for ID: ${trackingId}`);
      return 0;
    }
    
    const { service, operation, startTime, metadata } = performanceData;
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Combine metadata
    const combinedMetadata = {
      ...metadata,
      ...additionalMetadata,
      duration,
      success
    };
    
    // Log event
    await UnifiedObservability.logEvent(
      service,
      operation,
      success ? Severity.INFO : Severity.WARNING,
      `${operation} ${success ? 'completed' : 'failed'} in ${duration.toFixed(2)}ms`,
      combinedMetadata
    );
    
    // If this is an API call, record it in the API usage metrics
    if (service === ServiceName.API) {
      await recordApiUsage(
        operation,
        duration,
        success ? 200 : 500,
        combinedMetadata?.userId,
        combinedMetadata
      );
    }
    
    // Clean up
    activePerformanceTracking.delete(trackingId);
    
    return duration;
  },
  
  /**
   * Create a correlation ID for tracking related events
   */
  createCorrelationId: (): string => {
    return uuidv4();
  },
  
  /**
   * Get the current session ID
   */
  getSessionId
};

// Export types
export type { PerformanceData };
