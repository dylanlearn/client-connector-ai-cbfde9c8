
import { supabase } from '@/integrations/supabase/client'; 
import { toast } from 'sonner';
import { SystemMonitoringRecord, SystemStatus } from './types';

/**
 * Fetches the current system status from the API
 * @returns A Promise that resolves to the current system status
 */
export async function getSystemStatus(): Promise<SystemStatus | null> {
  try {
    const { data, error } = await supabase.functions.invoke('system-status', {
      method: 'GET'
    });
    
    if (error) throw error;
    
    return data as SystemStatus;
  } catch (error) {
    console.error('Failed to fetch system status:', error);
    return null;
  }
}

/**
 * Fetches historical system monitoring records for the specified period
 * @param period The time period to fetch records for ('day', 'week', 'month')
 * @returns A Promise that resolves to an array of system monitoring records
 */
export async function getSystemMetrics(
  period: 'day' | 'week' | 'month' = 'day'
): Promise<SystemMonitoringRecord[] | null> {
  try {
    const { data, error } = await supabase.functions.invoke('system-metrics', {
      body: { period }
    });
    
    if (error) throw error;
    
    return data as SystemMonitoringRecord[];
  } catch (error) {
    console.error(`Failed to fetch system metrics for period ${period}:`, error);
    return null;
  }
}

/**
 * Reports a system issue to the monitoring system
 * @param component The affected component
 * @param description A description of the issue
 * @param severity The severity of the issue ('low', 'medium', 'high')
 * @returns A Promise that resolves to a boolean indicating success
 */
export async function reportSystemIssue(
  component: string,
  description: string,
  severity: 'low' | 'medium' | 'high'
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('report-issue', {
      body: {
        component,
        description,
        severity,
        timestamp: new Date().toISOString()
      }
    });
    
    if (error) throw error;
    
    toast.success('Issue reported', {
      description: 'The system issue has been reported successfully'
    });
    
    return true;
  } catch (error) {
    console.error('Failed to report system issue:', error);
    
    toast.error('Failed to report issue', {
      description: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
    
    return false;
  }
}

/**
 * Subscribe to system status updates
 * @param callback The callback to execute when status updates are received
 * @returns A function to unsubscribe from status updates
 */
export function subscribeToSystemStatus(
  callback: (status: SystemStatus) => void
): () => void {
  // This would typically use a WebSocket or real-time subscription
  // For now, we'll just poll the API every 30 seconds
  
  const intervalId = setInterval(async () => {
    const status = await getSystemStatus();
    if (status) {
      callback(status);
    }
  }, 30000);
  
  // Return unsubscribe function
  return () => clearInterval(intervalId);
}
