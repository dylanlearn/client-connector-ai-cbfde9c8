
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeData
} from "../wireframe-types";

/**
 * Service for generating wireframes through edge functions
 */
export const wireframeGenerator = {
  /**
   * Generate wireframe by calling the Edge Function
   */
  generateWireframe: async (
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    try {
      const startTime = performance.now();
      
      const { data, error } = await supabase.functions.invoke<{
        wireframe: WireframeData;
        model?: string;
        usage?: { 
          total_tokens: number;
          completion_tokens: number;
          prompt_tokens: number;
        };
      }>('generate-wireframe', {
        body: params
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
        success: true
      };
    } catch (error) {
      console.error("Error generating wireframe:", error);
      throw error;
    }
  }
};
