
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CacheCleanupResult } from '../types/cache-types';

/**
 * Triggers cache cleanup by invoking the Supabase function
 * @param showToasts Whether to show toast notifications
 * @returns Result of the cleanup operation
 */
export async function triggerCacheCleanup(showToasts: boolean = false): Promise<CacheCleanupResult> {
  try {
    const { data, error } = await supabase.functions.invoke("cleanup-expired-cache");
    
    if (error) {
      console.error("Failed to trigger cache cleanup:", error);
      if (showToasts) {
        toast.error("Cache cleanup failed");
      }
      return { 
        success: false, 
        message: `Failed to clean up cache: ${error.message}`,
        entriesRemoved: 0
      };
    }
    
    if (showToasts) {
      toast.success(`Cache cleanup complete. Removed ${data?.entriesRemoved || 0} entries.`);
    }
    
    return { 
      success: true, 
      message: "Cache cleanup successful",
      entriesRemoved: data?.entriesRemoved
    };
  } catch (error) {
    console.error("Error triggering cache cleanup:", error);
    if (showToasts) {
      toast.error("Cache cleanup failed");
    }
    return { 
      success: false, 
      message: `Error cleaning up cache: ${error instanceof Error ? error.message : 'Unknown error'}`,
      entriesRemoved: 0
    };
  }
}

/**
 * Schedules regular cache cleanup at specified intervals
 * @param cleanupFunction Function to execute for cleanup
 * @param intervalMinutes Minutes between cleanup operations
 * @returns Interval timer that can be cleared later
 */
export async function scheduleCleanup(
  cleanupFunction: () => Promise<CacheCleanupResult>,
  intervalMinutes: number = 60
): Promise<NodeJS.Timeout> {
  // First immediate run
  await cleanupFunction();
  
  // Then schedule recurring cleanup
  const timer = setInterval(async () => {
    console.log(`Running scheduled cache cleanup (every ${intervalMinutes} minutes)`);
    await cleanupFunction();
  }, intervalMinutes * 60 * 1000);
  
  return timer;
}
