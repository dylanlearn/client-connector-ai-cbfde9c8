
import { supabase } from "@/integrations/supabase/client";
import { recordApiUsage } from "@/utils/monitoring/api-usage";

/**
 * Service for generating design images using AI
 */
export const DesignImageService = {
  /**
   * Generate a design image using AI
   */
  generateDesignImage: async (
    designType: string,
    description: string,
    style?: string
  ): Promise<string> => {
    try {
      // Start timing the API call for monitoring
      const startTime = performance.now();
      
      const { data, error } = await supabase.functions.invoke("generate-design-image", {
        body: {
          designType,
          description,
          style
        }
      });
      
      // Record API usage for monitoring
      const endTime = performance.now();
      await recordApiUsage(
        "generate-design-image", 
        endTime - startTime, 
        error ? 500 : 200,
        undefined,
        { designType, style }
      );
      
      if (error) {
        console.error("Error generating design image:", error);
        throw new Error(`Failed to generate image: ${error.message}`);
      }
      
      if (!data?.success || !data?.imageUrl) {
        throw new Error("Failed to generate image: No image URL returned");
      }
      
      return data.imageUrl;
    } catch (error) {
      console.error("Exception in generateDesignImage:", error);
      
      // Return fallback image based on design type
      const fallbackImages: Record<string, string> = {
        hero: "https://placehold.co/1024x576/3b82f6/ffffff?text=Hero+Section",
        navbar: "https://placehold.co/1024x576/475569/ffffff?text=Navigation+Bar",
        about: "https://placehold.co/1024x576/10b981/ffffff?text=About+Section",
        footer: "https://placehold.co/1024x576/6366f1/ffffff?text=Footer+Section",
        font: "https://placehold.co/1024x576/f59e0b/ffffff?text=Typography",
        animation: "https://placehold.co/1024x576/ec4899/ffffff?text=Animation",
        interaction: "https://placehold.co/1024x576/8b5cf6/ffffff?text=Interaction"
      };
      
      const fallbackImage = fallbackImages[designType.toLowerCase()] || 
        "https://placehold.co/1024x576/64748b/ffffff?text=Design+Image";
      
      // Re-throw the error for the hook to handle
      throw error;
    }
  },
  
  /**
   * Get a fallback image based on design type
   */
  getFallbackImage: (designType: string): string => {
    const fallbackImages: Record<string, string> = {
      hero: "https://placehold.co/1024x576/3b82f6/ffffff?text=Hero+Section",
      navbar: "https://placehold.co/1024x576/475569/ffffff?text=Navigation+Bar",
      about: "https://placehold.co/1024x576/10b981/ffffff?text=About+Section",
      footer: "https://placehold.co/1024x576/6366f1/ffffff?text=Footer+Section",
      font: "https://placehold.co/1024x576/f59e0b/ffffff?text=Typography",
      animation: "https://placehold.co/1024x576/ec4899/ffffff?text=Animation",
      interaction: "https://placehold.co/1024x576/8b5cf6/ffffff?text=Interaction"
    };
    
    return fallbackImages[designType.toLowerCase()] || 
      "https://placehold.co/1024x576/64748b/ffffff?text=Design+Image";
  }
};
