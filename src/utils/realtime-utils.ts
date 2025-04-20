
import { supabase } from "@/integrations/supabase/client";

/**
 * Setup realtime subscriptions for the critical tables needed for admin analytics
 */
export const setupRealtimeForClientTables = async () => {
  try {
    // First enable realtime for important tables
    const { error: apiUsageError } = await supabase.rpc('enable_realtime_for_table', {
      table_name: 'api_usage_metrics'
    });
    
    const { error: systemHealthError } = await supabase.rpc('enable_realtime_for_table', {
      table_name: 'system_health_checks'
    });
    
    const { error: systemAlertsError } = await supabase.rpc('enable_realtime_for_table', {
      table_name: 'system_alerts'
    });
    
    const { error: systemMonitoringError } = await supabase.rpc('enable_realtime_for_table', {
      table_name: 'system_monitoring'
    });
    
    if (apiUsageError || systemHealthError || systemAlertsError || systemMonitoringError) {
      console.error('Some tables could not be enabled for realtime:', {
        apiUsageError,
        systemHealthError,
        systemAlertsError,
        systemMonitoringError
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up realtime for tables:', error);
    return false;
  }
};
