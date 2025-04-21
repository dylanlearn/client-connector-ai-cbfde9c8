
export interface SystemStatus {
  status: 'operational' | 'degraded' | 'outage';
  components: Record<string, {
    status: 'operational' | 'degraded' | 'outage';
    metrics: Record<string, string | number>;
  }>;
  lastUpdated: string;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  // In a real application, this would fetch from an API
  // For now, we'll return mock data
  return {
    status: 'operational',
    components: {
      'api': {
        status: 'operational',
        metrics: {
          'responseTime': '142ms',
          'requestsPerMinute': 120,
          'errorRate': '0.2%'
        }
      },
      'database': {
        status: 'operational',
        metrics: {
          'queryTime': '38ms',
          'connections': 24,
          'diskUsage': '32%'
        }
      },
      'storage': {
        status: 'operational',
        metrics: {
          'readSpeed': '12MB/s',
          'writeSpeed': '8MB/s',
          'availableSpace': '1.2TB'
        }
      },
      'auth': {
        status: 'operational',
        metrics: {
          'authTime': '220ms',
          'activeUsers': 542,
          'failedLogins': 3
        }
      }
    },
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Retrieves system metrics from all components
 */
export async function getSystemMetrics() {
  const status = await getSystemStatus();
  
  // Extract metrics from all components
  const metrics = Object.entries(status.components).reduce((acc, [key, component]) => {
    return {
      ...acc,
      [key]: component.metrics
    };
  }, {});
  
  return {
    metrics,
    status: status.status,
    lastUpdated: status.lastUpdated
  };
}
