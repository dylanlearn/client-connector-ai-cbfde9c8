
import { DesignMemoryService } from "../design-memory-service";
import { LandBookCacheService } from "./cache-service";
import { LandBookQueryOptions, LandBookPaginatedResult } from "./types";

/**
 * Service for querying Land Book design patterns
 */
export const LandBookQueryService = {
  /**
   * Query design patterns similar to Land-book
   */
  queryPatterns: async (
    options: LandBookQueryOptions = {}
  ): Promise<LandBookPaginatedResult> => {
    // Generate cache key from options
    const cacheKey = `landbook-patterns-${JSON.stringify(options)}`;
    
    // Check cache first
    const cachedResult = LandBookCacheService.getFromCache<LandBookPaginatedResult>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    // Default pagination
    const pageSize = options.pageSize || 10;
    const page = options.page || 1;
    const offset = (page - 1) * pageSize;
    
    // Get query options without pagination for total count
    const countOptions = { ...options };
    delete countOptions.pageSize;
    delete countOptions.page;
    
    // Query design memory with pagination
    const paginatedOptions = {
      ...options,
      limit: pageSize
    };
    
    try {
      // Get paginated results
      const memoryResults = await DesignMemoryService.queryDesignMemory(paginatedOptions);
      
      // Get total count using a separate query - necessary for pagination
      // Note: In production we might use a more efficient approach like SQL COUNT(*) via a custom RPC
      const allResults = await DesignMemoryService.queryDesignMemory(countOptions);
      const total = allResults.length;
      
      const result = {
        data: memoryResults,
        total,
        page,
        pageSize,
        hasMore: offset + memoryResults.length < total
      };
      
      // Store in cache with 15-minute expiration
      LandBookCacheService.storeInCache(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error("Error querying LandBook patterns:", error);
      throw error;
    }
  },
  
  /**
   * Get curated design patterns for a specific industry
   */
  getPatternsForIndustry: async (
    industry: string,
    options: LandBookQueryOptions = {}
  ): Promise<LandBookPaginatedResult> => {
    // Generate cache key from industry and options
    const cacheKey = `landbook-industry-${industry}-${JSON.stringify(options)}`;
    
    // Check cache first
    const cachedResult = LandBookCacheService.getFromCache<LandBookPaginatedResult>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    try {
      // Update options to filter by industry tag
      const industryOptions = {
        ...options,
        tags: [...(options.tags || []), industry]
      };
      
      // Use the standard query patterns method with industry filter
      const result = await LandBookQueryService.queryPatterns(industryOptions);
      
      // Store in cache with 30-minute expiration
      LandBookCacheService.storeInCache(cacheKey, result, 30 * 60 * 1000);
      
      return result;
    } catch (error) {
      console.error(`Error getting patterns for industry ${industry}:`, error);
      throw error;
    }
  }
};
