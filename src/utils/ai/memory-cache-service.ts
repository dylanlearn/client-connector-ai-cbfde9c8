
import { redisClient } from '../redis/redis-wrapper';

// Check if running in browser
const isBrowser = typeof window !== 'undefined';

/**
 * Service for caching AI memory and embedding data using Redis
 * This significantly speeds up retrieval of frequently accessed memory patterns
 */
export const MemoryCacheService = {
  /**
   * Cache user memory context
   */
  cacheUserMemoryContext: async (userId: string, context: any): Promise<boolean> => {
    if (isBrowser) return false; // Skip in browser environment
    return await redisClient.cacheData(
      `memory:user:${userId}:context`, 
      context,
      1800 // 30 minutes cache
    );
  },
  
  /**
   * Get cached user memory context
   */
  getUserMemoryContext: async <T>(userId: string): Promise<T | null> => {
    if (isBrowser) return null; // Skip in browser environment
    return await redisClient.getCachedData<T>(`memory:user:${userId}:context`);
  },
  
  /**
   * Cache project memory context
   */
  cacheProjectMemoryContext: async (projectId: string, context: any): Promise<boolean> => {
    if (isBrowser) return false; // Skip in browser environment
    return await redisClient.cacheData(
      `memory:project:${projectId}:context`,
      context,
      3600 // 1 hour cache
    );
  },
  
  /**
   * Get cached project memory context
   */
  getProjectMemoryContext: async <T>(projectId: string): Promise<T | null> => {
    if (isBrowser) return null; // Skip in browser environment
    return await redisClient.getCachedData<T>(`memory:project:${projectId}:context`);
  },
  
  /**
   * Cache embedding vector for faster semantic search
   */
  cacheEmbeddingVector: async (
    contentHash: string, 
    embedding: number[]
  ): Promise<boolean> => {
    if (isBrowser) return false; // Skip in browser environment
    return await redisClient.cacheEmbedding(
      `embedding:${contentHash}`,
      embedding,
      86400 // 24 hours cache
    );
  },
  
  /**
   * Get cached embedding vector
   */
  getEmbeddingVector: async (contentHash: string): Promise<number[] | null> => {
    if (isBrowser) return null; // Skip in browser environment
    return await redisClient.getCachedEmbedding(`embedding:${contentHash}`);
  },
  
  /**
   * Cache semantic search results for frequently used queries
   */
  cacheSemanticSearchResults: async (
    query: string, 
    results: any[]
  ): Promise<boolean> => {
    if (isBrowser) return false; // Skip in browser environment
    
    // Create a stable hash for the query
    const queryHash = createQueryHash(query);
    
    return await redisClient.cacheData(
      `search:${queryHash}`,
      results,
      1800 // 30 minutes cache
    );
  },
  
  /**
   * Get cached semantic search results
   */
  getSemanticSearchResults: async <T>(query: string): Promise<T[] | null> => {
    if (isBrowser) return null; // Skip in browser environment
    
    // Create a stable hash for the query
    const queryHash = createQueryHash(query);
    
    return await redisClient.getCachedData<T[]>(`search:${queryHash}`);
  },
  
  /**
   * Clean up expired caches and stale data
   */
  cleanupStaleMemoryCache: async (): Promise<number> => {
    if (isBrowser) return 0; // Skip in browser environment
    // This would be managed automatically by Redis TTL
    // This method is a placeholder for more complex cleanup operations
    return 0;
  }
};

// Helper function to create a stable hash for a string
function createQueryHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}
