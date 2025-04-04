
import { supabase } from "@/integrations/supabase/client";
import { WireframeData, WireframeGenerationParams } from "./wireframe-service";

interface CachedWireframe {
  id: string;
  params_hash: string;
  wireframe_data: WireframeData;
  created_at: string;
  expires_at: string;
  hit_count: number;
}

/**
 * Service for caching wireframes to reduce duplicate generations and improve performance
 */
export const WireframeCacheService = {
  /**
   * Generate a unique hash for wireframe generation parameters
   */
  generateParamsHash: (params: WireframeGenerationParams): string => {
    // Create a deterministic string from the params
    const paramsString = JSON.stringify({
      prompt: params.prompt,
      style: params.style || '',
      complexity: params.complexity || 'medium',
      industry: params.industry || '',
      pages: params.pages?.sort() || [],
      moodboardSelections: params.moodboardSelections || {}
    });
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < paramsString.length; i++) {
      const char = paramsString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  },
  
  /**
   * Check if a wireframe with similar parameters exists in cache
   */
  checkCache: async (params: WireframeGenerationParams): Promise<WireframeData | null> => {
    try {
      const paramsHash = WireframeCacheService.generateParamsHash(params);
      
      // Use RPC for cache lookup
      const { data, error } = await supabase.rpc('check_wireframe_cache', {
        p_params_hash: paramsHash
      });
      
      if (error || !data) {
        return null;
      }
      
      // Update hit count
      await supabase.rpc('increment_cache_hit', {
        p_cache_id: data.id
      });
      
      console.log(`Cache hit for wireframe params hash: ${paramsHash}`);
      return data.wireframe_data;
    } catch (error) {
      console.error("Error checking wireframe cache:", error);
      return null;
    }
  },
  
  /**
   * Store a wireframe in cache
   */
  storeInCache: async (params: WireframeGenerationParams, wireframeData: WireframeData, expiryHours: number = 24): Promise<void> => {
    try {
      const paramsHash = WireframeCacheService.generateParamsHash(params);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);
      
      // Use RPC to store in cache
      await supabase.rpc('store_wireframe_in_cache', {
        p_params_hash: paramsHash,
        p_wireframe_data: wireframeData as any,
        p_expires_at: expiresAt.toISOString(),
        p_generation_params: params as any
      });
        
      console.log(`Stored wireframe in cache with hash: ${paramsHash}`);
    } catch (error) {
      console.error("Error storing wireframe in cache:", error);
    }
  },
  
  /**
   * Clear expired cache entries
   */
  clearExpiredCache: async (): Promise<number> => {
    try {
      // Use RPC to clear expired entries
      const { data, error } = await supabase.rpc('clear_expired_wireframe_cache');
      
      if (error) {
        console.error("Error clearing expired wireframe cache:", error);
        return 0;
      }
      
      const removedCount = data || 0;
      console.log(`Cleared ${removedCount} expired wireframe cache entries`);
      return removedCount;
    } catch (error) {
      console.error("Exception clearing expired wireframe cache:", error);
      return 0;
    }
  }
};
