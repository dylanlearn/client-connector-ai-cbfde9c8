
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeData
} from "../wireframe-types";
import { CreativePromptService } from "../../creative-prompt-service";

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
          `${params.description.substring(0, 50)}_${params.style || 'default'}_${params.colorTheme || 'default'}` : 
          undefined
      };
      
      // Enhance the description with creativity if specified
      if (enhancedParams.enhancedCreativity && enhancedParams.description) {
        enhancedParams.description = CreativePromptService.enhancePrompt(
          enhancedParams.description,
          enhancedParams.creativityLevel || 8
        );
      }
      
      const { data, error } = await supabase.functions.invoke<{
        wireframe: WireframeData;
        model?: string;
        usage?: { 
          total_tokens: number;
          completion_tokens: number;
          prompt_tokens: number;
        };
        creativityLevel?: number;
      }>('generate-wireframe', {
        body: enhancedParams
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
        model: data.model,
        usage: data.usage,
        generationTime,
        success: true,
        creativityLevel: data.creativityLevel || enhancedParams.creativityLevel
      };
    } catch (error) {
      console.error("Error generating wireframe:", error);
      throw error;
    }
  }
};
