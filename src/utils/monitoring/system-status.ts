
import { SystemStatus } from './types';

export async function getSystemStatus(): Promise<SystemStatus> {
  // In a real app, this would be an API call to fetch real-time system status
  // For now, we'll simulate different components and their health status
  
  return {
    status: 'healthy',
    components: {
      database: {
        status: 'healthy',
        metrics: {
          connections: 12,
          queryLatencyMs: 45,
          errorRate: '0.02%'
        },
        lastUpdated: new Date().toISOString()
      },
      redis: {
        status: 'healthy',
        metrics: {
          connections: 8,
          memoryUsageMb: 24,
          hitRate: '98.5%'
        },
        lastUpdated: new Date().toISOString()
      },
      api: {
        status: 'healthy',
        metrics: {
          requestsPerMinute: 120,
          avgResponseTimeMs: 85,
          errorRate: '0.5%'
        },
        lastUpdated: new Date().toISOString()
      },
      storage: {
        status: 'healthy',
        metrics: {
          usedSpaceGb: 1.2,
          totalSpaceGb: 5,
          filesCount: 3426
        },
        lastUpdated: new Date().toISOString()
      },
    },
    lastUpdated: new Date().toISOString()
  };
}
