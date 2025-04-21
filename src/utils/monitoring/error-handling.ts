
// Error handling utilities for monitoring

/**
 * Records client-side errors
 */
export function recordClientError(error: Error, componentName?: string) {
  // Implementation would log to monitoring service
  console.error(`Client Error${componentName ? ` in ${componentName}` : ''}: ${error.message}`);
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    component: componentName
  };
}

/**
 * Handles API errors and logs them appropriately
 */
export function handleApiError(error: Error, endpoint: string) {
  // Log to monitoring service
  console.error(`API Error at ${endpoint}: ${error.message}`);
  return {
    handled: true,
    message: error.message,
    endpoint
  };
}

/**
 * Error reporter utility class
 */
export class ErrorReporter {
  private static instance: ErrorReporter;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }
  
  report(error: Error, context?: Record<string, any>) {
    // Implementation would send to monitoring service
    console.error('Reported Error:', error.message, context);
  }
}

/**
 * General error recording function
 */
export function recordError(error: Error, category: string, metadata?: Record<string, any>) {
  // Implementation would log to monitoring service
  console.error(`[${category}] Error: ${error.message}`, metadata);
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    category,
    message: error.message,
    metadata
  };
}

// Re-export initialization functions from monitoring-initializer
export { initializeErrorHandling, initializeMonitoringSystem } from './monitoring-initializer';
