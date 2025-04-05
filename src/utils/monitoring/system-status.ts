
import { supabase } from "@/integrations/supabase/client";
import { SystemStatus, SystemMonitoringRecord, MonitoringConfiguration } from "./types";

// Re-export SystemStatus from types using export type syntax
export type { SystemStatus };

/**
 * Record a system status event in the database
 */
export const recordSystemStatus = async (
  component: string,
  status: SystemStatus,
  value?: number,
  threshold?: number,
  message?: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  try {
    // Prepare the record
    const record: SystemMonitoringRecord = {
      component,
      status,
      value,
      threshold,
      message,
      metadata,
      event_type: 'status_update',
    };
    
    // Insert into the database using type assertion
    const { error } = await (supabase
      .from('system_monitoring' as any)
      .insert(record as any));
      
    if (error) {
      console.error('Error recording system status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in recordSystemStatus:', error);
    return false;
  }
};

/**
 * Get configuration for a monitoring component
 */
export const getMonitoringConfiguration = async (component: string): Promise<MonitoringConfiguration | null> => {
  try {
    const { data, error } = await (supabase
      .from('monitoring_configuration' as any)
      .select('*')
      .eq('component', component)
      .maybeSingle()) as any;
      
    if (error) {
      console.error('Error fetching monitoring configuration:', error);
      return null;
    }
    
    return data as MonitoringConfiguration;
  } catch (error) {
    console.error('Error in getMonitoringConfiguration:', error);
    return null;
  }
};
