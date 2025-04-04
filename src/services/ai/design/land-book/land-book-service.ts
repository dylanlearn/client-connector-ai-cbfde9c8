
import { LandBookCacheService } from './cache-service';
import { LandBookQueryService } from './query-service';
import { LandBookAnalysisService } from './analysis-service';
import { 
  LandBookQueryOptions, 
  LandBookAnalysis, 
  LandBookPaginatedResult 
} from './types';

/**
 * Service for accessing Land-book inspired design patterns
 */
export const LandBookService = {
  // Query methods
  queryPatterns: LandBookQueryService.queryPatterns,
  getPatternsForIndustry: LandBookQueryService.getPatternsForIndustry,
  
  // Analysis methods
  getDesignAnalysis: LandBookAnalysisService.getDesignAnalysis,
  
  // Cache control methods
  clearCache: LandBookCacheService.clearCache,
  setCacheEnabled: LandBookCacheService.setCacheEnabled
};

// Re-export types
export type {
  LandBookQueryOptions,
  LandBookAnalysis,
  LandBookPaginatedResult
};
