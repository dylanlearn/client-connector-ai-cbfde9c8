/**
 * Records client-side errors to monitoring system
 * @param error The error message or object
 * @param stack Optional error stack trace
 * @param context Optional context information
 * @param userId Optional user ID for tracking
 * @param metadata Optional additional data about the error
 * @returns A Promise that resolves when the error is recorded
 */
export async function recordClientError(
  error: string | Error,
  stack?: string | null,
  context?: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  // Handle different parameter patterns for backward compatibility
  let errorMessage: string;
  let errorStack: string | null = null;
  let errorContext: string | undefined = context;
  let errorUserId: string | undefined = userId;
  let errorMetadata: Record<string, any> | undefined = metadata;
  
  // Parse error parameter
  if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = error.message;
    errorStack = error.stack || null;
  }
  
  // If stack wasn't passed explicitly but is available on the error object
  if (!stack && errorStack) {
    stack = errorStack;
  }
  
  // Log the error locally
  console.error(`[Error Recording] ${errorMessage}`, {
    stack,
    context: errorContext,
    userId: errorUserId,
    metadata: errorMetadata
  });
  
  // In a real implementation, this would send the error to a backend service
  // For now, we'll just return a resolved promise after a short delay
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 100);
  });
}

/**
 * Get API usage metrics for the monitoring dashboard
 */
export async function getApiUsageMetrics(period: string = 'day') {
  // In a real app this would fetch from an API endpoint
  // Here we'll return mock data based on the period
  
  let dataPoints = 0;
  let interval = '';
  
  switch (period) {
    case 'hour':
      dataPoints = 12;
      interval = '5 minutes';
      break;
    case 'day':
      dataPoints = 24;
      interval = '1 hour';
      break;
    case 'week':
      dataPoints = 7;
      interval = '1 day';
      break;
    case 'month':
      dataPoints = 30;
      interval = '1 day';
      break;
    default:
      dataPoints = 24;
      interval = '1 hour';
  }
  
  // Generate mock data
  const apiCalls = Array.from({ length: dataPoints }, (_, i) => ({
    timestamp: new Date(Date.now() - (i * (period === 'hour' ? 300000 : period === 'day' ? 3600000 : 86400000))).toISOString(),
    totalCalls: Math.floor(Math.random() * 1000) + 500,
    errorRate: Math.random() * 2,
    avgResponseTime: Math.floor(Math.random() * 100) + 50,
  })).reverse();
  
  return {
    apiCalls,
    summary: {
      totalCalls: apiCalls.reduce((sum, item) => sum + item.totalCalls, 0),
      avgErrorRate: Number((apiCalls.reduce((sum, item) => sum + item.errorRate, 0) / apiCalls.length).toFixed(2)),
      avgResponseTime: Math.floor(apiCalls.reduce((sum, item) => sum + item.avgResponseTime, 0) / apiCalls.length),
      interval,
      period
    }
  };
}

// Keep backward compatibility
export const getApiMetrics = getApiUsageMetrics;
