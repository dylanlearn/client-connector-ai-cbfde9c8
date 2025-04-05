
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CacheCleanupResult, UseCacheReturn } from './types/cache-types';
import { triggerCacheCleanup, scheduleCleanup } from './utils/cache-utils';

/**
 * Hook for managing AI content cache
 */
export function useCache(showToasts = false): UseCacheReturn {
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { toast } = useToast();
  
  const cleanupCache = useCallback(async (): Promise<CacheCleanupResult> => {
    setIsCleaningUp(true);
    
    try {
      // Call the utility function that handles the actual cleanup
      const result = await triggerCacheCleanup(showToasts);
      return result;
    } catch (error) {
      console.error("Error cleaning up cache:", error);
      
      if (showToasts) {
        toast({
          title: "Cleanup Failed",
          description: "Could not clean up the content cache",
          variant: "destructive"
        });
      }
      
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error occurred",
        entriesRemoved: 0 
      };
    } finally {
      setIsCleaningUp(false);
    }
  }, [showToasts, toast]);
  
  const scheduleRegularCleanup = useCallback(async (intervalMinutes = 60): Promise<NodeJS.Timeout> => {
    return await scheduleCleanup(cleanupCache, intervalMinutes);
  }, [cleanupCache]);
  
  return {
    isCleaningUp,
    cleanupCache,
    scheduleRegularCleanup
  };
}
