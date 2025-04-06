
import { ClientErrorLogger } from './client-error-logger';
import { UnifiedObservability, ServiceName, Severity } from './unified-observability';
import { initializeErrorHandling } from './error-handling';

/**
 * Initialize the enterprise monitoring system
 */
export function initializeMonitoringSystem(): void {
  // Initialize client error logging
  ClientErrorLogger.initialize();
  
  // Initialize global error handling
  initializeErrorHandling();
  
  // Log system initialization
  UnifiedObservability.logEvent(
    ServiceName.API,
    'system_initialization',
    Severity.INFO,
    'Enterprise monitoring system initialized',
    {
      timestamp: new Date().toISOString(),
      browserInfo: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    }
  ).catch(console.error);
  
  console.log('🔍 Enterprise monitoring system initialized');
}
