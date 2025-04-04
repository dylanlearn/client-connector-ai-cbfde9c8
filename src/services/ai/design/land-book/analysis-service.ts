
import { DesignMemoryService } from "../design-memory-service";
import { DesignMemoryEntry } from "../types/design-memory-types";
import { LandBookCacheService } from "./cache-service";
import { LandBookAnalysis } from "./types";

/**
 * Service for analyzing design patterns
 */
export const LandBookAnalysisService = {
  /**
   * Get deep design analysis for a specific design
   */
  getDesignAnalysis: async (
    designId: string
  ): Promise<LandBookAnalysis> => {
    // Generate cache key
    const cacheKey = `landbook-analysis-${designId}`;
    
    // Check cache first
    const cachedResult = LandBookCacheService.getFromCache<LandBookAnalysis>(cacheKey);
    if (cachedResult) {
      return cachedResult;
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
      LandBookCacheService.storeInCache(cacheKey, analysis, 60 * 60 * 1000);
      
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
function extractKeyElements(design: DesignMemoryEntry): string[] {
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
