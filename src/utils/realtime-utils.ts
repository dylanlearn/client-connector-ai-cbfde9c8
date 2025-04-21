
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

/**
 * Create a realtime subscription for a specific table
 * @param channelName Unique name for the channel
 * @param tableName Table to subscribe to
 * @param filter Optional filter to apply
 * @param onChanges Callback function when changes occur
 * @returns Object with unsubscribe function
 */
export const createRealtimeSubscription = (
  channelName: string,
  tableName: string,
  filter?: string,
  onChanges?: (payload: any) => void
) => {
  // Create channel configuration
  const channelConfig: any = {
    event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
    schema: 'public',
    table: tableName
  };
  
  // Add filter if provided
  if (filter) {
    channelConfig.filter = filter;
  }
  
  // Create and subscribe to the channel
  const channel = supabase.channel(channelName)
    .on(
      'postgres_changes',
      channelConfig,
      (payload) => {
        if (onChanges) {
          onChanges(payload);
        }
      }
    )
    .subscribe();
  
  // Return object with unsubscribe function
  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
};
