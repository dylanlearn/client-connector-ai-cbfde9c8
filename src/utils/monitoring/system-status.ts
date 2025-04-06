
import { supabase } from "@/integrations/supabase/client";
import type { SystemMonitoringRecord, SystemStatus } from "./types";

/**
 * Records a system status update to the monitoring database
 */
export async function recordSystemStatus(
  component: string,
  status: SystemStatus,
  value?: number,
  threshold?: number,
  message?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const record: SystemMonitoringRecord = {
      component,
      status,
      value,
      threshold,
      message,
      metadata,
      event_type: 'status_update'
    };

    const { error } = await supabase
      .from('system_monitoring')
      .insert(record);

    if (error) {
      console.error('Error recording system status:', error);
    }
  } catch (err) {
    console.error('Failed to record system status:', err);
  }
}

/**
 * Fetches the latest system status for a specific component
 */
export async function getLatestComponentStatus(
  component: string
): Promise<SystemMonitoringRecord | null> {
  try {
    const { data, error } = await supabase
      .from('system_monitoring')
      .select('*')
      .eq('component', component)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching component status:', error);
      return null;
    }

    return data as SystemMonitoringRecord;
  } catch (err) {
    console.error('Failed to get component status:', err);
    return null;
  }
}

/**
 * Gets overall system health across all monitored components
 */
export async function getSystemHealth(): Promise<Record<string, SystemStatus>> {
  try {
    const { data, error } = await supabase
      .rpc('get_latest_component_statuses');

    if (error) {
      console.error('Error fetching system health:', error);
      return {};
    }

    const health: Record<string, SystemStatus> = {};
    
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        health[item.component] = item.status as SystemStatus;
      });
    }

    return health;
  } catch (err) {
    console.error('Failed to get system health:', err);
    return {};
  }
}

/**
 * Triggers an alert for critical system status
 */
export async function triggerSystemAlert(
  component: string,
  status: SystemStatus,
  message: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('system_monitoring')
      .insert({
        component,
        status,
        message,
        event_type: 'alert'
      });

    if (error) {
      console.error('Error triggering system alert:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to trigger system alert:', err);
    return false;
  }
}
