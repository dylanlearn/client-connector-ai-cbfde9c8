
/**
 * Interface for error handling configuration
 */
export interface ErrorHandlingConfig {
  shouldShowToUser: boolean;
  shouldReportToMonitoring: boolean;
  retryStrategy?: string;
  customMessage?: string;
}

/**
 * Get error handling configuration from the server
 */
export async function getErrorHandlingConfig(
  component: string, 
  errorType: string
): Promise<ErrorHandlingConfig> {
  // In a real implementation, this would fetch from an API or configuration service
  // For now, return default values
  return {
    shouldShowToUser: true,
    shouldReportToMonitoring: true,
    retryStrategy: 'exponential-backoff',
    customMessage: undefined
  };
}
