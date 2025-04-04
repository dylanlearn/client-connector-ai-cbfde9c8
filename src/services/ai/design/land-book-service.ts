
import { supabase } from "@/integrations/supabase/client";
import { DesignMemoryService } from "./design-memory-service";
import { DesignMemoryQueryOptions } from "./types/design-memory-types";

export interface LandBookQueryOptions extends DesignMemoryQueryOptions {
  pageSize?: number;
  page?: number;
  sortBy?: 'relevance' | 'date' | 'popularity';
  sortDirection?: 'asc' | 'desc';
}

export interface LandBookAnalysis {
  designType: string;
  conversionScore: number;
  keyElements: string[];
  targetAudience: string[];
  industryRelevance: string[];
}

export interface LandBookPaginatedResult {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

interface CacheItem {
  timestamp: number;
  data: any;
  expiresIn: number;
}

/**
 * Service for accessing Land-book inspired design patterns
 */
export const LandBookService = {
  // Simple in-memory cache
  _cache: new Map<string, CacheItem>(),
  _cacheEnabled: true,
  
  /**
   * Set whether caching is enabled
   */
  setCacheEnabled: (enabled: boolean): void => {
    LandBookService._cacheEnabled = enabled;
  },
  
  /**
   * Clear the entire cache or a specific key
   */
  clearCache: (cacheKey?: string): void => {
    if (cacheKey) {
      LandBookService._cache.delete(cacheKey);
    } else {
      LandBookService._cache.clear();
    }
  },
  
  /**
   * Query design patterns similar to Land-book
   */
  queryPatterns: async (
    options: LandBookQueryOptions = {}
  ): Promise<LandBookPaginatedResult> => {
    // Generate cache key from options
    const cacheKey = `landbook-patterns-${JSON.stringify(options)}`;
    
    // Check cache first
    if (LandBookService._cacheEnabled) {
      const cached = LandBookService._cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.expiresIn) {
        console.log('Cache hit for LandBook patterns');
        return cached.data;
      }
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
      if (LandBookService._cacheEnabled) {
        LandBookService._cache.set(cacheKey, {
          timestamp: Date.now(),
          data: result,
          expiresIn: 15 * 60 * 1000 // 15 minutes
        });
      }
      
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
    if (LandBookService._cacheEnabled) {
      const cached = LandBookService._cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.expiresIn) {
        console.log('Cache hit for industry patterns');
        return cached.data;
      }
    }
    
    try {
      // Update options to filter by industry tag
      const industryOptions = {
        ...options,
        tags: [...(options.tags || []), industry]
      };
      
      // Use the standard query patterns method with industry filter
      const result = await LandBookService.queryPatterns(industryOptions);
      
      // Store in cache with 30-minute expiration
      if (LandBookService._cacheEnabled) {
        LandBookService._cache.set(cacheKey, {
          timestamp: Date.now(),
          data: result,
          expiresIn: 30 * 60 * 1000 // 30 minutes
        });
      }
      
      return result;
    } catch (error) {
      console.error(`Error getting patterns for industry ${industry}:`, error);
      throw error;
    }
  },
  
  /**
   * Get deep design analysis for a specific design
   */
  getDesignAnalysis: async (
    designId: string
  ): Promise<LandBookAnalysis> => {
    // Generate cache key
    const cacheKey = `landbook-analysis-${designId}`;
    
    // Check cache first
    if (LandBookService._cacheEnabled) {
      const cached = LandBookService._cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.expiresIn) {
        console.log('Cache hit for design analysis');
        return cached.data;
      }
    }
    
    try {
      // Query database for the specific design by ID
      // In a real implementation, this would use Supabase to fetch the design
      
      // Simplified implementation - using design memory service
      const designs = await DesignMemoryService.queryDesignMemory({
        search_term: designId,
        limit: 1
      });
      
      if (designs.length === 0) {
        throw new Error(`Design with ID ${designId} not found`);
      }
      
      const design = designs[0];
      
      // Generate analysis
      const analysis: LandBookAnalysis = {
        designType: design.category,
        conversionScore: design.relevance_score ? design.relevance_score * 10 : 7.5,
        keyElements: extractKeyElements(design),
        targetAudience: design.tags.filter(tag => tag.includes('audience') || tag.includes('user')),
        industryRelevance: design.tags.filter(tag => !tag.includes('audience') && !tag.includes('user'))
      };
      
      // Store in cache with 1-hour expiration
      if (LandBookService._cacheEnabled) {
        LandBookService._cache.set(cacheKey, {
          timestamp: Date.now(),
          data: analysis,
          expiresIn: 60 * 60 * 1000 // 1 hour
        });
      }
      
      return analysis;
    } catch (error) {
      console.error(`Error getting design analysis for ${designId}:`, error);
      throw error;
    }
  }
};

/**
 * Extract key elements from a design memory entry
 */
function extractKeyElements(design: any): string[] {
  const elements: string[] = [];
  
  if (design.visual_elements) {
    if (design.visual_elements.layout) elements.push(`Layout: ${design.visual_elements.layout}`);
    if (design.visual_elements.color_scheme) elements.push(`Color Scheme: ${design.visual_elements.color_scheme}`);
    if (design.visual_elements.typography) elements.push(`Typography: ${design.visual_elements.typography}`);
  }
  
  if (design.layout_pattern && design.layout_pattern.type) {
    elements.push(`Pattern: ${design.layout_pattern.type}`);
  }
  
  // Add more elements as needed
  
  return elements;
}
