
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
      
      const { data, error } = await supabase
        .from('wireframe_cache')
        .select('*')
        .eq('params_hash', paramsHash)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data) {
        return null;
      }
      
      // Update hit count
      await supabase
        .from('wireframe_cache')
        .update({ hit_count: (data as unknown as CachedWireframe).hit_count + 1 })
        .eq('id', (data as unknown as CachedWireframe).id);
      
      console.log(`Cache hit for wireframe params hash: ${paramsHash}`);
      return (data as unknown as CachedWireframe).wireframe_data;
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
      
      await supabase
        .from('wireframe_cache')
        .insert({
          params_hash: paramsHash,
          wireframe_data: wireframeData as any,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          hit_count: 1,
          generation_params: params as any
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
      const { data, error } = await supabase
        .from('wireframe_cache')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('id');
      
      if (error) {
        console.error("Error clearing expired wireframe cache:", error);
        return 0;
      }
      
      const removedCount = data?.length || 0;
      console.log(`Cleared ${removedCount} expired wireframe cache entries`);
      return removedCount;
    } catch (error) {
      console.error("Exception clearing expired wireframe cache:", error);
      return 0;
    }
  }
};
