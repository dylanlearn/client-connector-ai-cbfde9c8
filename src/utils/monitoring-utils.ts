
// Re-export from monitoring folder
export { 
  getApiMetrics,
  getApiUsageMetrics,
  recordApiUsage,
  recordApiError,
  recordClientError
} from './monitoring/api-usage';

export {
  recordClientError as recordErrorWithDetails,
  handleApiError,
  ErrorReporter,
  recordError,
  initializeErrorHandling
} from './monitoring/error-handling';

// Re-export types and functions separately to avoid name collision
export type { SystemStatus } from './monitoring/system-status';
export { getSystemStatus, getSystemMetrics } from './monitoring/system-status';
