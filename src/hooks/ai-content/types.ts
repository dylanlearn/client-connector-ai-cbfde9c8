
/**
 * Types for AI content and cache management
 */

export interface ContentCacheEntry {
  id: string;
  content: string;
  contentType: string;
  expiresAt: Date;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface ContentCacheOptions {
  /** Time in seconds until the content expires */
  expiresIn?: number;
  /** User ID associated with the content */
  userId?: string;
  /** Additional metadata to store with the content */
  metadata?: Record<string, any>;
}

export interface FetchContentOptions {
  /** Force a fresh generation, ignoring cache */
  forceFresh?: boolean;
  /** Include cached entries that are expired */
  includeExpired?: boolean;
  /** Maximum age in seconds to consider content fresh */
  maxAgeSecs?: number;
  /** Specific user ID to retrieve content for */
  userId?: string;
}

export interface GenerateContentOptions extends ContentCacheOptions {
  /** Whether to cache the result */
  cache?: boolean;
  /** Whether to use fallback content if generation fails */
  useFallback?: boolean;
  /** Context to use when selecting fallback content */
  fallbackContext?: string;
}

export interface ContentRateLimitInfo {
  /** How many requests the user has made in the current period */
  count: number;
  /** The maximum number of requests allowed in the period */
  limit: number;
  /** Whether the user is currently rate limited */
  isLimited: boolean;
  /** When the rate limit resets */
  resetsAt: Date;
}

export interface CacheCleanupResult {
  success: boolean;
  message: string;
  entriesRemoved?: number;
}

export interface AIContentHookReturn {
  /** Function to generate content */
  generateContent: <T = string>(
    prompt: string, 
    options?: GenerateContentOptions
  ) => Promise<T>;
  
  /** Function to fetch content from cache */
  fetchCachedContent: <T = string>(
    cacheKey: string, 
    options?: FetchContentOptions
  ) => Promise<T | null>;
  
  /** Function to clean up expired cache entries */
  cleanupCache: () => Promise<CacheCleanupResult>;
  
  /** Function to schedule regular cache cleanup */
  scheduleRegularCleanup: (intervalMinutes?: number) => Promise<NodeJS.Timeout>;
  
  /** Current generation status */
  isGenerating: boolean;
  
  /** Any error that occurred during content generation */
  error: Error | null;
  
  /** Rate limit information */
  rateLimit: ContentRateLimitInfo | null;
}

export interface FallbackContentMap {
  [context: string]: string;
  default: string;
}
