
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
  callback: (payload: any) => void,
  errorCallback?: (error: Error) => void
) => {
  let retryCount = 0;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds
  
  const setupSubscription = () => {
    try {
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
        .subscribe((status) => {
          console.log(`Realtime subscription status (${channelName}):`, status);
          
          if (status === 'SUBSCRIBED') {
            console.log(`Successfully subscribed to ${channelName}`);
            retryCount = 0;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            const error = new Error(`Subscription error: ${status}`);
            console.error(error);
            
            if (errorCallback) {
              errorCallback(error);
            }
            
            // Retry subscription if under max retries
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              console.log(`Retrying subscription (${retryCount}/${MAX_RETRIES})...`);
              
              setTimeout(() => {
                supabase.removeChannel(channel);
                setupSubscription();
              }, RETRY_DELAY * retryCount);
            }
          }
        });

      return {
        unsubscribe: () => {
          console.log(`Unsubscribing from ${channelName}`);
          supabase.removeChannel(channel);
        },
      };
    } catch (error) {
      console.error(`Error creating realtime subscription for ${channelName}:`, error);
      
      if (errorCallback) {
        errorCallback(error instanceof Error ? error : new Error(`Subscription setup error: ${error}`));
      }
      
      return {
        unsubscribe: () => {
          console.log(`Dummy unsubscribe from failed ${channelName} subscription`);
        },
      };
    }
  };
  
  return setupSubscription();
};
