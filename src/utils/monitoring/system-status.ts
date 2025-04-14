
import { supabase } from '@/integrations/supabase/client';
import { SystemStatus, SystemMonitoringRecord } from './types';

/**
 * Fetches the current system status
 */
export async function getSystemStatus(): Promise<SystemStatus> {
  try {
    const { data, error } = await supabase
      .from('system_status')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching system status:', error);
      return getDefaultSystemStatus();
    }
    
    if (!data) {
      return getDefaultSystemStatus();
    }
    
    return {
      status: data.status || 'operational',
      components: data.components || {},
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
      return [];
    }
    
    return data as SystemMonitoringRecord[] || [];
  } catch (error) {
    console.error('Error in getSystemMetrics:', error);
    return [];
  }
}

/**
 * Returns a default system status object
 */
function getDefaultSystemStatus(): SystemStatus {
  return {
    status: 'operational',
    components: {
      api: 'operational',
      database: 'operational',
      storage: 'operational',
      auth: 'operational'
    },
    lastUpdated: new Date().toISOString(),
    incidents: []
  };
}
