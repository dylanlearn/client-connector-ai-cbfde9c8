
import { ClientErrorLogger } from './client-error-logger';
import { UnifiedObservability, ServiceName, Severity } from './unified-observability';
import { initializeErrorHandling } from './error-handling';
import { getErrorHandlingConfig } from './error-config';

/**
 * Initialize the enterprise monitoring system
 */
export async function initializeMonitoringSystem(): Promise<void> {
  // Initialize client error logging
  ClientErrorLogger.initialize();
  
  // Initialize global error handling
  initializeErrorHandling();
  
  // Check if we have a custom monitoring configuration
  const monitoringConfig = await getErrorHandlingConfig('System', 'initialization');
  
  const severityLevel = monitoringConfig?.severity === 'critical' ? Severity.CRITICAL :
                       monitoringConfig?.severity === 'error' ? Severity.ERROR :
                       monitoringConfig?.severity === 'warning' ? Severity.WARNING :
                       Severity.INFO;
  
  // Log system initialization
  await UnifiedObservability.logEvent(
    ServiceName.API,
    'system_initialization',
    severityLevel,
    'Enterprise monitoring system initialized',
    {
      timestamp: new Date().toISOString(),
      browserInfo: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      configuredAction: monitoringConfig?.action || 'default'
    }
  ).catch(console.error);
  
  console.log('🔍 Enterprise monitoring system initialized with error handling configuration');
}
