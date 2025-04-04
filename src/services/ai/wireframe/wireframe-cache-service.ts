import { supabase } from "@/integrations/supabase/client";
import { WireframeData, WireframeGenerationParams } from "./wireframe-types";

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
  checkCache: async (paramsHash: string): Promise<{
    hit: boolean;
    cacheId?: string;
    wireframeData?: any;
  }> => {
    try {
      const { data, error } = await supabase.rpc('check_wireframe_cache', {
        p_params_hash: paramsHash
      });
      
      if (error) {
        console.error('Cache check error:', error);
        return { hit: false };
      }
      
      if (!data) {
        return { hit: false };
      }
      
      // Increment the hit counter for the found cache
      if (data.id) {
        await supabase.rpc('increment_cache_hit', {
          p_cache_id: data.id
        });
      }
      
      return {
        hit: !!data,
        cacheId: data?.id,
        wireframeData: data?.wireframe_data
      };
    } catch (error) {
      console.error('Error checking wireframe cache:', error);
      return { hit: false };
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
      
      // Use edge function to store in cache
      await supabase.functions.invoke("process-wireframe-tasks", {
        body: {
          operation: "store_in_cache",
          params_hash: paramsHash,
          wireframe_data: wireframeData,
          expires_at: expiresAt.toISOString(),
          generation_params: params
        }
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
      // Use edge function to clear expired entries
      const { data, error } = await supabase.functions.invoke("process-wireframe-tasks", {
        body: {
          operation: "clear_expired_cache"
        }
      });
      
      if (error) {
        console.error("Error clearing expired wireframe cache:", error);
        return 0;
      }
      
      const removedCount = data?.removed || 0;
      console.log(`Cleared ${removedCount} expired wireframe cache entries`);
      return removedCount;
    } catch (error) {
      console.error("Exception clearing expired wireframe cache:", error);
      return 0;
    }
  }
};
