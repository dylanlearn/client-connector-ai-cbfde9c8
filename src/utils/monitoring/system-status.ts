
import { SystemStatus, SystemMonitoringRecord } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches the current system status
 */
export async function getSystemStatus(): Promise<SystemStatus> {
  try {
    // Try to fetch from the database first
    const { data, error } = await supabase
      .from('system_status')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.log('Using default system status due to: ', error || 'No data');
      return getDefaultSystemStatus();
    }
    
    return {
      status: data.status || 'healthy',
      components: data.components || getDefaultSystemStatus().components,
      lastUpdated: data.updated_at || new Date().toISOString(),
      incidents: data.incidents || []
    };
  } catch (error) {
    console.error('Error in getSystemStatus:', error);
    return getDefaultSystemStatus();
  }
}

/**
 * Fetches system metrics for the specified time period
 */
export async function getSystemMetrics(period: 'hour' | 'day' | 'week'): Promise<SystemMonitoringRecord[]> {
  try {
    // Determine time range based on period
    const now = new Date();
    let startTime: Date;
    
    switch (period) {
      case 'hour':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'week':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'day':
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    const { data, error } = await supabase
      .from('system_metrics')
      .select('*')
      .gte('timestamp', startTime.toISOString())
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching system metrics:', error);
      return getDefaultMetrics();
    }
    
    return data as SystemMonitoringRecord[] || getDefaultMetrics();
  } catch (error) {
    console.error('Error in getSystemMetrics:', error);
    return getDefaultMetrics();
  }
}

/**
 * Returns a default system status object for use when actual data isn't available
 */
function getDefaultSystemStatus(): SystemStatus {
  return {
    status: 'healthy',
    components: {
      api: {
        status: 'healthy',
        metrics: { uptime: 99.9, responseTime: 250 },
        lastUpdated: new Date().toISOString()
      },
      database: {
        status: 'healthy',
        metrics: { connections: 12, querySpeed: 45 },
        lastUpdated: new Date().toISOString()
      },
      memory: {
        status: 'warning',
        metrics: { used: 78.5, available: 21.5 },
        lastUpdated: new Date().toISOString()
      },
      storage: {
        status: 'healthy',
        metrics: { usage: 45.2, availability: 99.99 },
        lastUpdated: new Date().toISOString()
      },
      functions: {
        status: 'healthy',
        metrics: { invocations: 1250, errors: 2 },
        lastUpdated: new Date().toISOString()
      }
    },
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Returns default metrics data for displaying charts when actual data isn't available
 */
function getDefaultMetrics(): SystemMonitoringRecord[] {
  const metrics: SystemMonitoringRecord[] = [];
  const now = new Date();
  
  // Generate some sample data for the past 24 hours
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - (24 - i) * 60 * 60 * 1000);
    
    // API response time
    metrics.push({
      timestamp: timestamp.toISOString(),
      component: 'api',
      metric: 'responseTime',
      value: 200 + Math.random() * 100,
      status: 'healthy'
    });
    
    // Database query time
    metrics.push({
      timestamp: timestamp.toISOString(),
      component: 'database',
      metric: 'queryTime',
      value: 25 + Math.random() * 40,
      status: 'healthy'
    });
    
    // Memory usage
    const memoryValue = 60 + Math.random() * 30;
    metrics.push({
      timestamp: timestamp.toISOString(),
      component: 'memory',
      metric: 'usage',
      value: memoryValue,
      status: memoryValue > 80 ? 'warning' : 'healthy'
    });
  }
  
  return metrics;
}
