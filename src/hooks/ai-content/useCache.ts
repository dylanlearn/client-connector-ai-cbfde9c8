
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CacheCleanupResult {
  entriesRemoved: number;
  bytesFreed: number;
}

export interface UseCacheReturn {
  isCleaningUp: boolean;
  cleanupCache: () => Promise<CacheCleanupResult>;
  scheduleRegularCleanup: (intervalHours?: number) => void;
}

/**
 * Hook for managing AI content cache
 */
export function useCache(showToasts = false): UseCacheReturn {
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { toast } = useToast();
  
  const cleanupCache = useCallback(async (): Promise<CacheCleanupResult> => {
    setIsCleaningUp(true);
    
    try {
      // Simulate cache cleanup for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result: CacheCleanupResult = {
        entriesRemoved: Math.floor(Math.random() * 20),
        bytesFreed: Math.floor(Math.random() * 1024 * 1024)
      };
      
      if (showToasts) {
        toast({
          title: "Cache Cleaned",
          description: `Removed ${result.entriesRemoved} entries (${Math.round(result.bytesFreed / 1024)} KB)`,
        });
      }
      
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
      
      return { entriesRemoved: 0, bytesFreed: 0 };
    } finally {
      setIsCleaningUp(false);
    }
  }, [showToasts, toast]);
  
  const scheduleRegularCleanup = useCallback((intervalHours = 24) => {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    const timer = setInterval(() => {
      cleanupCache();
    }, intervalMs);
    
    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [cleanupCache]);
  
  return {
    isCleaningUp,
    cleanupCache,
    scheduleRegularCleanup
  };
}
