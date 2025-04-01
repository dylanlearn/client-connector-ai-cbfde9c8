
import { supabase } from "@/integrations/supabase/client";

/**
 * Sets up a table for realtime updates.
 * 
 * @param table The name of the table to enable realtime for
 * @returns A promise that resolves when the operation is complete
 */
export const setupRealtimeForTable = async (table: string): Promise<void> => {
  try {
    // Set REPLICA IDENTITY to FULL to get complete row data in realtime events
    await supabase.rpc(
      'alter_table_replica_identity' as any,
      { table_name: table, identity_type: 'FULL' }
    );
    
    // Add the table to the realtime publication
    await supabase.rpc(
      'add_table_to_realtime_publication' as any,
      { table_name: table }
    );
    
    console.log(`Realtime set up for table: ${table}`);
  } catch (error) {
    console.error(`Error setting up realtime for table ${table}:`, error);
    throw error;
  }
};

/**
 * Creates a realtime subscription for a specific condition
 */
export const createRealtimeSubscription = (
  channelName: string,
  tableName: string,
  filterString: string,
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
        filter: filterString,
      },
      callback
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
};
