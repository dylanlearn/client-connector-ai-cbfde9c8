
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase.functions.invoke("generate-design-image", {
        body: {
          designType,
          description,
          style
        }
      });
      
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
      throw error;
    }
  }
};
