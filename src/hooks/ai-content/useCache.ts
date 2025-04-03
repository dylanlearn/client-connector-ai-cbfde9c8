
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing AI content cache
 */
export function useCache(showToasts: boolean = false) {
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  
  // Function to manually trigger cache cleanup (for admin/development purposes)
  const cleanupCache = useCallback(async (): Promise<{success: boolean, message: string, entriesRemoved?: number}> => {
    try {
      setIsCleaningUp(true);
      const { data, error } = await supabase.functions.invoke("cleanup-expired-cache");
      
      setIsCleaningUp(false);
      
      if (error) {
        console.error("Failed to trigger cache cleanup:", error);
        if (showToasts) {
          toast.error("Cache cleanup failed");
        }
        return { 
          success: false, 
          message: `Failed to clean up cache: ${error.message}`
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
      setIsCleaningUp(false);
      console.error("Error triggering cache cleanup:", error);
      if (showToasts) {
        toast.error("Cache cleanup failed");
      }
      return { 
        success: false, 
        message: `Error cleaning up cache: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }, [showToasts]);

  // Schedule regular cache cleanup (for admin users)
  const scheduleRegularCleanup = useCallback(async (intervalMinutes: number = 60): Promise<NodeJS.Timeout> => {
    // First immediate run
    await cleanupCache();
    
    // Then schedule recurring cleanup
    return setInterval(async () => {
      console.log(`Running scheduled cache cleanup (every ${intervalMinutes} minutes)`);
      await cleanupCache();
    }, intervalMinutes * 60 * 1000);
  }, [cleanupCache]);

  return {
    isCleaningUp,
    cleanupCache,
    scheduleRegularCleanup
  };
}
