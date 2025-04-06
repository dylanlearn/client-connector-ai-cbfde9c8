
import { supabase } from '@/integrations/supabase/client';

export interface ImageGenerationRequest {
  prompt: string;
  style?: string;
  size?: string;
  numberOfImages?: number;
}

export interface ImageGenerationResponse {
  imageUrls: string[];
  error?: string;
}

/**
 * Service for generating design images using AI
 */
export const DesignImageService = {
  /**
   * Generate a design image based on description and style
   */
  generateDesignImage: async (
    designType: string,
    description: string,
    style?: string
  ): Promise<string> => {
    try {
      const prompt = `${designType} design: ${description}${style ? `. Style: ${style}` : ''}`;
      
      // Call the Supabase Edge Function to generate image
      const { data, error } = await supabase.functions.invoke('generate-images', {
        body: { 
          prompt, 
          style: style || 'digital-art', 
          size: '1024x1024', 
          numberOfImages: 1 
        }
      });

      if (error) {
        console.error('Error generating design image:', error);
        throw new Error(`Failed to generate design image: ${error.message}`);
      }
      
      if (!data?.imageUrls || data.imageUrls.length === 0) {
        throw new Error('No image URLs returned from API');
      }
      
      return data.imageUrls[0];
    } catch (error) {
      console.error('Exception in generateDesignImage:', error);
      throw error;
    }
  },
  
  /**
   * Get a fallback image URL when generation fails
   */
  getFallbackImage: (designType: string): string => {
    const fallbackImages: Record<string, string> = {
      'website': 'https://placehold.co/600x400/e9ecef/495057?text=Website+Design',
      'logo': 'https://placehold.co/400x400/e9ecef/495057?text=Logo+Design',
      'banner': 'https://placehold.co/800x200/e9ecef/495057?text=Banner+Design',
      'icon': 'https://placehold.co/200x200/e9ecef/495057?text=Icon+Design',
      'default': 'https://placehold.co/600x400/e9ecef/495057?text=Design+Image'
    };
    
    return fallbackImages[designType.toLowerCase()] || fallbackImages.default;
  }
};

// Function to generate images based on prompt and design parameters
export const generateDesignImages = async (
  request: ImageGenerationRequest
): Promise<ImageGenerationResponse> => {
  try {
    const { prompt, style = 'digital-art', size = '1024x1024', numberOfImages = 1 } = request;
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-images', {
      body: { 
        prompt, 
        style, 
        size, 
        numberOfImages 
      }
    });

    if (error) {
      console.error('Error generating images:', error);
      return { 
        imageUrls: [], 
        error: error.message
      };
    }
    
    return {
      imageUrls: data?.imageUrls || [],
    };
  } catch (error) {
    console.error('Error in generateDesignImages:', error);
    return {
      imageUrls: [],
      error: 'Failed to generate design images'
    };
  }
};

// Function to store a generated image in Supabase Storage
export const storeGeneratedImage = async (
  imageUrl: string, 
  designId: string
): Promise<string | null> => {
  try {
    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error('Failed to fetch image');
    
    const imageBlob = await imageResponse.blob();
    
    // Upload to Storage
    const fileName = `design-${designId}-${Date.now()}.png`;
    const filePath = `generated-designs/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('design-images')
      .upload(filePath, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600'
      });
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from('design-images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error storing generated image:', error);
    return null;
  }
};
