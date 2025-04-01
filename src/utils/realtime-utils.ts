
import { supabase } from "@/integrations/supabase/client";

/**
 * Enables real-time updates for a specific table
 * @param tableName The name of the table to enable real-time updates for
 */
export const enableRealtimeForTable = async (tableName: string): Promise<boolean> => {
  try {
    // First, allow full replica identity for the table to ensure we get complete 
    // before/after data with real-time events
    const { error: replicaError } = await supabase.rpc(
      'alter_table_replica_identity', // Custom RPC function
      { table_name: tableName },
      { count: 'exact' } // This allows using custom RPC functions not in the TypeScript definition
    );
    
    if (replicaError) {
      console.error(`Error setting replica identity for ${tableName}:`, replicaError);
      return false;
    }
    
    // Then add the table to the realtime publication
    const { error: pubError } = await supabase.rpc(
      'add_table_to_realtime_publication', // Custom RPC function
      { table_name: tableName },
      { count: 'exact' } // This allows using custom RPC functions not in the TypeScript definition
    );
    
    if (pubError) {
      console.error(`Error adding ${tableName} to realtime publication:`, pubError);
      return false;
    }
    
    console.log(`Realtime enabled for ${tableName}`);
    return true;
  } catch (error) {
    console.error(`Error enabling realtime for ${tableName}:`, error);
    return false;
  }
};

/**
 * Sets up real-time channel with enhanced logging for debugging
 * @param channelName The name for the real-time channel
 * @param table The table to subscribe to
 * @param filter Optional filter condition
 * @param callback The callback function when events occur
 */
export const createRealtimeSubscription = (
  channelName: string,
  table: string,
  filter: string | object | null = null,
  callback: (payload: any) => void
) => {
  let channel = supabase.channel(channelName);
  
  const filterConfig = typeof filter === 'string' 
    ? filter
    : filter 
      ? JSON.stringify(filter) 
      : null;
  
  const subscription = channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table,
      ...(filterConfig ? { filter: filterConfig } : {})
    },
    (payload) => {
      console.log(`[Realtime] ${table} update:`, payload);
      callback(payload);
    }
  );
  
  subscription.subscribe((status) => {
    console.log(`[Realtime] Channel ${channelName} status:`, status);
  });
  
  return {
    channel,
    unsubscribe: () => supabase.removeChannel(channel)
  };
};
