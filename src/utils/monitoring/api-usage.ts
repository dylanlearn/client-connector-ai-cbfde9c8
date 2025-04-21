
export interface ApiUsage {
  endpoint: string;
  count: number;
  averageTime: number;
  errorRate: number;
  timestamp: string;
}

export interface ApiMetrics {
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  topEndpoints: {
    endpoint: string;
    requests: number;
  }[];
  timeSeriesData: {
    timestamp: string;
    requests: number;
  }[];
}

/**
 * Record a client-side error for monitoring purposes
 */
export function recordClientError(
  errorOrMessage: Error | string,
  stackOrContext?: string | Record<string, any>,
  componentName?: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<boolean> {
  // Normalize parameters
  const errorMessage = errorOrMessage instanceof Error ? errorOrMessage.message : errorOrMessage;
  const stack = errorOrMessage instanceof Error ? errorOrMessage.stack : 
                (typeof stackOrContext === 'string' ? stackOrContext : undefined);
  const context = typeof stackOrContext === 'object' ? stackOrContext : 
                 (metadata || (componentName && typeof componentName === 'object' ? componentName : {}));

  // Handle backward compatibility
  const normalizedComponentName = typeof componentName === 'string' ? componentName : 'Unknown';
  const normalizedUserId = userId;
  const normalizedMetadata = metadata || {};

  console.error('Client error:', errorMessage, {
    stack,
    componentName: normalizedComponentName,
    userId: normalizedUserId,
    context,
    ...normalizedMetadata
  });
  
  // In a real implementation, this would send the error to a monitoring service
  return new Promise<boolean>((resolve) => {
    try {
      // Simulate sending error data to the server
      const errorData = {
        message: errorMessage,
        stack,
        context,
        componentName: normalizedComponentName,
        userId: normalizedUserId,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      };
      
      // Log for development purposes
      console.debug('Error data to be sent:', errorData);
      
      // In production, we would send this to an endpoint:
      // fetch('/api/client-errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // });
      
      resolve(true);
    } catch (e) {
      // Fail silently in the error reporter to avoid loops
      console.error('Failed to report error:', e);
      resolve(false);
    }
  });
}

/**
 * Fetch API usage metrics
 */
export async function getApiMetrics(period: 'hour' | 'day' | 'week' = 'day'): Promise<ApiMetrics> {
  // In a real app, this would fetch from an API
  // For now, we'll return mock data
  
  // Adjust the time range based on the period
  const timePoints = period === 'hour' ? 24 : period === 'day' ? 24 : 7;
  const timeSeriesData = Array.from({ length: timePoints }, (_, i) => {
    return {
      timestamp: new Date(Date.now() - (timePoints - i) * (period === 'hour' ? 60000 : period === 'day' ? 3600000 : 86400000)).toISOString(),
      requests: Math.floor(Math.random() * 50) + 50
    };
  });
  
  return {
    totalRequests: 2456,
    averageResponseTime: 125,
    errorRate: 0.8,
    topEndpoints: [
      { endpoint: '/api/users', requests: 532 },
      { endpoint: '/api/projects', requests: 423 },
      { endpoint: '/api/analytics', requests: 287 },
      { endpoint: '/api/auth/session', requests: 245 },
      { endpoint: '/api/integrations', requests: 169 }
    ],
    timeSeriesData
  };
}

// Add an alias for getApiMetrics to maintain backward compatibility
export const getApiUsageMetrics = getApiMetrics;
