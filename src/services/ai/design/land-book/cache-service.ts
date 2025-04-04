
import { CacheItem } from './types';

/**
 * Service for caching Land Book query results
 */
export const LandBookCacheService = {
  // Simple in-memory cache
  _cache: new Map<string, CacheItem>(),
  _cacheEnabled: true,
  
  /**
   * Set whether caching is enabled
   */
  setCacheEnabled: (enabled: boolean): void => {
    LandBookCacheService._cacheEnabled = enabled;
  },
  
  /**
   * Check if caching is enabled
   */
  isCacheEnabled: (): boolean => {
    return LandBookCacheService._cacheEnabled;
  },
  
  /**
   * Clear the entire cache or a specific key
   */
  clearCache: (cacheKey?: string): void => {
    if (cacheKey) {
      LandBookCacheService._cache.delete(cacheKey);
    } else {
      LandBookCacheService._cache.clear();
    }
  },
  
  /**
   * Get an item from cache if it exists and is not expired
   */
  getFromCache: <T>(cacheKey: string): T | null => {
    if (!LandBookCacheService._cacheEnabled) {
      return null;
    }
    
    const cached = LandBookCacheService._cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.expiresIn) {
      console.log('Cache hit for LandBook data');
      return cached.data as T;
    }
    
    return null;
  },
  
  /**
   * Store an item in the cache with a specified expiration time
   */
  storeInCache: <T>(cacheKey: string, data: T, expiresInMs: number = 15 * 60 * 1000): void => {
    if (!LandBookCacheService._cacheEnabled) {
      return;
    }
    
    LandBookCacheService._cache.set(cacheKey, {
      timestamp: Date.now(),
      data,
      expiresIn: expiresInMs
    });
  }
};
