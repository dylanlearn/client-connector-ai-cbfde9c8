
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
