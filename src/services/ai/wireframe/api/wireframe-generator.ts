
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeData
} from "../wireframe-types";
import { CreativeEnhancementService } from "../../creative-enhancement-service";

/**
 * Service for generating wireframes through edge functions with enhanced creativity
 */
export const wireframeGenerator = {
  /**
   * Generate wireframe by calling the Edge Function with creative enhancements
   */
  generateWireframe: async (
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    try {
      const startTime = performance.now();
      
      // Add creative enhancements to the params
      const enhancedParams = {
        ...params,
        enhancedCreativity: params.enhancedCreativity ?? true, // Enable by default
        creativityLevel: params.creativityLevel ?? 8, // Default high creativity
        // Create a cache key based on params to enable caching
        cacheKey: params.description ? 
          `${params.description.substring(0, 50)}_${params.style || 'default'}_${params.colorScheme || 'default'}` : 
          undefined
      };
      
      // Apply advanced creative enhancement with the service
      if (enhancedParams.enhancedCreativity && enhancedParams.description) {
        // Use the wireframing creative profile for optimal results
        enhancedParams.description = CreativeEnhancementService.enhancePrompt(
          enhancedParams.description,
          "wireframing",
          {
            industry: params.industry || undefined,
            style: params.style || undefined
          }
        );
        
        console.log("Enhanced prompt:", enhancedParams.description);
      }
      
      const { data, error } = await supabase.functions.invoke<{
        wireframe: WireframeData;
        model?: string;
        usage?: { 
          total_tokens: number;
          completion_tokens: number;
          prompt_tokens: number;
        };
      }>('generation-api', {
        body: {
          action: 'generate-wireframe',
          ...enhancedParams
        }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.wireframe) {
        throw new Error("No wireframe data returned from API");
      }
      
      const endTime = performance.now();
      const generationTime = (endTime - startTime) / 1000; // Convert to seconds
      
      return {
        wireframe: data.wireframe,
        generationTime,
        model: data.model,
        usage: data.usage,
        success: true
      };
    } catch (error) {
      console.error("Error generating wireframe:", error);
      throw error;
    }
  }
};
