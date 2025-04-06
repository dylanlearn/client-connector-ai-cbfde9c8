
import { ClientErrorLogger } from './client-error-logger';
import { APIUsageMonitor } from './api-usage';
import { PerformanceMonitor } from './performance-monitoring';
import { SystemStatusMonitor } from './system-status';

/**
 * Initialize all monitoring systems
 */
export function initializeMonitoringSystem({
  enableErrorLogging = true,
  enableAPIMonitoring = true,
  enablePerformanceTracking = true,
  enableSystemStatusChecks = true,
  samplingRate = 0.1, // Only track 10% of sessions by default to reduce overhead
  errorSamplingRate = 1.0 // But track all errors
} = {}) {
  
  console.log('Initializing monitoring system...');
  
  // Determine if this session should be monitored (random sampling)
  const shouldMonitorSession = Math.random() < samplingRate;
  
  if (!shouldMonitorSession && Math.random() >= errorSamplingRate) {
    console.log('This session is not selected for monitoring (sampling)');
    return {
      enabled: false,
      reason: 'Not selected for sampling'
    };
  }
  
  try {
    // Client error logging
    if (enableErrorLogging) {
      console.log('Initializing error logging...');
      ClientErrorLogger.initialize({
        maxBufferSize: 50,
        flushInterval: 30000, // 30 seconds
        criticalErrorTypes: ['auth', 'payment', 'api']
      });
      
      // ClientErrorLogger doesn't have a registerHandler method, we need to add a function to handle errors
      ClientErrorLogger.handleError = function(error: Error, context?: string) {
        console.log(`Error handled by monitoring system: ${error.message}`, context);
        // Log error to monitoring system
      };
    }
    
    // API usage monitoring
    if (enableAPIMonitoring) {
      console.log('Initializing API usage monitoring...');
      APIUsageMonitor.initialize();
    }
    
    // Performance monitoring
    if (enablePerformanceTracking) {
      console.log('Initializing performance monitoring...');
      PerformanceMonitor.initialize({
        trackPageLoads: true,
        trackAPILatency: true,
        trackLongTasks: true
      });
    }
    
    // System status checks
    if (enableSystemStatusChecks) {
      console.log('Initializing system status monitoring...');
      SystemStatusMonitor.initialize({
        checkInterval: 60000 // 1 minute
      });
    }
    
    console.log('Monitoring system initialized successfully');
    
    return {
      enabled: true,
      components: {
        errorLogging: enableErrorLogging,
        apiMonitoring: enableAPIMonitoring,
        performanceTracking: enablePerformanceTracking,
        systemStatusChecks: enableSystemStatusChecks
      }
    };
    
  } catch (error) {
    console.error('Failed to initialize monitoring system:', error);
    return {
      enabled: false,
      error
    };
  }
}
