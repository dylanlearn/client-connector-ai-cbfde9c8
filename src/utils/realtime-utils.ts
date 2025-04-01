
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures a table is set up for realtime updates.
 * Sets REPLICA IDENTITY to FULL and adds the table to the realtime publication.
 * 
 * @param tableName The name of the table to enable realtime for
 * @returns Promise that resolves when the operation is complete
 */
export const setupTableForRealtime = async (tableName: string): Promise<boolean> => {
  try {
    // Set REPLICA IDENTITY to FULL to ensure complete row data in events
    const { error: replicaError } = await supabase.rpc(
      'alter_table_replica_identity',
      { table_name: tableName, identity_type: 'FULL' }
    );
    
    if (replicaError) {
      console.error(`Error setting REPLICA IDENTITY for ${tableName}:`, replicaError);
      return false;
    }
    
    // Add table to realtime publication
    const { error: pubError } = await supabase.rpc(
      'add_table_to_publication',
      { table_name: tableName, publication_name: 'supabase_realtime' }
    );
    
    if (pubError) {
      console.error(`Error adding ${tableName} to publication:`, pubError);
      return false;
    }
    
    console.log(`Table ${tableName} set up for realtime successfully`);
    return true;
  } catch (error) {
    console.error(`Error setting up realtime for ${tableName}:`, error);
    return false;
  }
};

/**
 * Sets up realtime for all client-related tables
 */
export const setupRealtimeForClientTables = async (): Promise<void> => {
  try {
    // Set up realtime for all client-related tables
    await Promise.all([
      setupTableForRealtime('client_access_links'),
      setupTableForRealtime('client_tasks'),
      setupTableForRealtime('client_link_deliveries')
    ]);
    
    console.log('All client tables set up for realtime');
  } catch (error) {
    console.error('Error setting up realtime for client tables:', error);
  }
};

/**
 * Creates a realtime subscription for a table with specified conditions
 * 
 * @param channelName Unique name for this subscription channel
 * @param tableName The name of the table to subscribe to
 * @param filterString Filter string to apply (e.g. "column=eq.value")
 * @param callback Function to call when an event occurs
 * @returns Unsubscribe function
 */
export const createRealtimeSubscription = (
  channelName: string,
  tableName: string,
  filterString: string,
  callback: (payload: any) => void
) => {
  try {
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: filterString
        },
        callback
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  } catch (error) {
    console.error(`Error creating realtime subscription for ${channelName}:`, error);
    return {
      unsubscribe: () => {
        console.log(`Error creating subscription, nothing to unsubscribe from`);
      }
    };
  }
};
