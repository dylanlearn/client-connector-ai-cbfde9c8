
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for generating enhanced creative images using Hugging Face models
 */
export const HuggingFaceImageService = {
  /**
   * Generate creative images using advanced Hugging Face models
   * @param prompt The description of the image to generate
   * @param options Additional options for image generation
   * @returns URL of generated image
   */
  generateImage: async (
    prompt: string, 
    options: {
      model?: string;
      style?: string;
      enhancedCreativity?: boolean;
      size?: string;
    } = {}
  ): Promise<string> => {
    try {
      const {
        model = 'black-forest-labs/FLUX.1-schnell', // Fast & high quality model
        style = 'detailed, creative',
        enhancedCreativity = true,
        size = '1024x1024'
      } = options;
      
      // Call the Supabase Edge Function to generate image
      const { data, error } = await supabase.functions.invoke('generate-advanced-image', {
        body: {
          prompt: enhancedCreativity 
            ? `${prompt}. Make it highly creative, unique, and visually striking. ${style}` 
            : `${prompt}. ${style}`,
          model,
          size
        }
      });
      
      if (error) {
        console.error('Error generating image with Hugging Face:', error);
        throw new Error(`Failed to generate image: ${error.message}`);
      }
      
      if (!data?.image) {
        throw new Error('No image URL returned from API');
      }
      
      return data.image;
    } catch (error) {
      console.error('Exception in HuggingFaceImageService:', error);
      throw error;
    }
  },
  
  /**
   * Generate multiple creative variations of an image concept
   * @param concept The base concept for variations
   * @param count Number of variations to generate
   * @returns Array of image URLs
   */
  generateVariations: async (
    concept: string,
    count: number = 3
  ): Promise<string[]> => {
    try {
      const variations: string[] = [];
      
      // Generate multiple variations in parallel
      const promises = Array(count).fill(0).map((_, index) => 
        this.generateImage(`${concept} - variation ${index + 1}`, {
          enhancedCreativity: true,
          style: 'unique creative interpretation, high quality'
        })
      );
      
      const results = await Promise.allSettled(promises);
      
      // Collect successful variations - Fix for TS2532 error
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          variations.push(result.value);
        }
      });
      
      return variations;
    } catch (error) {
      console.error('Error generating variations:', error);
      return [];
    }
  }
};
