
import { supabase } from "@/integrations/supabase/client";
import { WireframeGenerationParams, WireframeGenerationResult } from './wireframe-types';

/**
 * Service for caching wireframe generation results
 */
export const WireframeCacheService = {
  /**
   * Generate a cache key for wireframe params
   */
  generateCacheKey: (params: WireframeGenerationParams): string | undefined => {
    if (!params.description && !params.prompt) {
      return undefined;
    }
    
    // Create a deterministic cache key based on significant parameters
    const keyParts = [
      params.description || params.prompt || '',
      params.style || 'default',
      params.colorTheme || 'default',
      params.complexity || 'standard',
      params.industry || 'general',
      params.enhancedCreativity ? 'creative' : 'standard',
      params.creativityLevel?.toString() || '5'
    ];
    
    // Add additional parameters if they exist
    if (params.componentTypes?.length) {
      keyParts.push(params.componentTypes.join('-'));
    }
    
    // Handle extra parameters that might be present
    if (params.moodboardSelections) {
      const { layoutPreferences, fonts, colors, tone } = params.moodboardSelections;
      if (layoutPreferences?.length) keyParts.push(`layout:${layoutPreferences.join('|')}`);
      if (fonts?.length) keyParts.push(`fonts:${fonts.join('|')}`);
      if (colors?.length) keyParts.push(`colors:${colors.join('|')}`);
      if (tone?.length) keyParts.push(`tone:${tone.join('|')}`);
    }
    
    // Create a hash of the key parts
    const keyString = keyParts.join('_').toLowerCase();
    return `wireframe:${keyString.substring(0, 100)}`;
  },
  
  /**
   * Store a generation result in the cache
   */
  cacheResult: async (cacheKey: string, result: WireframeGenerationResult): Promise<void> => {
    try {
      if (!cacheKey) {
        return;
      }
      
      await supabase
        .from('wireframe_cache')
        .upsert({
          cache_key: cacheKey,
          result_data: result,
          created_at: new Date().toISOString(),
          expiry: new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString() // 24hr expiry
        });
    } catch (error) {
      console.error("Error caching wireframe result:", error);
    }
  },
  
  /**
   * Retrieve a cached generation result
   */
  getCachedResult: async (cacheKey: string): Promise<WireframeGenerationResult | null> => {
    try {
      if (!cacheKey) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('wireframe_cache')
        .select('result_data')
        .eq('cache_key', cacheKey)
        .gt('expiry', new Date().toISOString())
        .single();
      
      if (error || !data) {
        return null;
      }
      
      return data.result_data as WireframeGenerationResult;
    } catch (error) {
      console.error("Error retrieving cached wireframe:", error);
      return null;
    }
  }
};
