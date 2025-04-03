
/**
 * Types for cache-related functionality
 */

/**
 * Result of cache cleanup operation
 */
export interface CacheCleanupResult {
  /**
   * Whether the operation was successful
   */
  success: boolean;
  
  /**
   * Message describing the result
   */
  message: string;
  
  /**
   * Number of entries removed (if successful)
   */
  entriesRemoved?: number;
}

/**
 * Return type for the useCache hook
 */
export interface UseCacheReturn {
  /**
   * Whether a cache cleanup operation is in progress
   */
  isCleaningUp: boolean;
  
  /**
   * Function to manually trigger cache cleanup
   */
  cleanupCache: () => Promise<CacheCleanupResult>;
  
  /**
   * Schedule regular cache cleanup at specified intervals
   * @param intervalMinutes Minutes between cleanup operations
   */
  scheduleRegularCleanup: (intervalMinutes?: number) => Promise<NodeJS.Timeout>;
}
