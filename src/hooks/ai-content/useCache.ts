
import { useCallback, useState } from 'react';
import { triggerCacheCleanup, scheduleCleanup } from './utils/cache-utils';
import { CacheCleanupResult, UseCacheReturn } from './types/cache-types';

/**
 * Hook for managing AI content cache
 * @param showToasts Whether to show toast notifications
 * @returns Cache management functions and state
 */
export function useCache(showToasts: boolean = false): UseCacheReturn {
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  
  // Function to manually trigger cache cleanup (for admin/development purposes)
  const cleanupCache = useCallback(async (): Promise<CacheCleanupResult> => {
    try {
      setIsCleaningUp(true);
      const result = await triggerCacheCleanup(showToasts);
      return result;
    } finally {
      setIsCleaningUp(false);
    }
  }, [showToasts]);

  // Schedule regular cache cleanup (for admin users)
  const scheduleRegularCleanup = useCallback(async (intervalMinutes: number = 60): Promise<NodeJS.Timeout> => {
    return scheduleCleanup(cleanupCache, intervalMinutes);
  }, [cleanupCache]);

  return {
    isCleaningUp,
    cleanupCache,
    scheduleRegularCleanup
  };
}
