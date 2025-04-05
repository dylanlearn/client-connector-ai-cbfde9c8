import { useState } from "react";
import { DesignImageService } from "@/services/ai/design/design-image-service";
import { toast } from "sonner";

/**
 * Hook for generating design images
 */
export const useDesignImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  /**
   * Generate a design image with AI, with retry logic
   */
  const generateImage = async (
    designType: string,
    description: string,
    style?: string
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      toast.info(`Generating ${designType} image...`);
      
      const imageUrl = await DesignImageService.generateDesignImage(
        designType,
        description,
        style
      );
      
      setGeneratedImageUrl(imageUrl);
      setRetryCount(0);
      toast.success(`${designType} image generated successfully!`);
      
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // If we've reached the max retries, use a fallback image
      if (retryCount >= maxRetries) {
        setRetryCount(0);
        const fallbackUrl = DesignImageService.getFallbackImage(designType);
        setGeneratedImageUrl(fallbackUrl);
        toast.error(`Failed to generate image after multiple attempts. Using fallback image.`);
        return fallbackUrl;
      }
      
      // Otherwise increment the retry count and show retry message
      setRetryCount(prev => prev + 1);
      toast.error(`Failed to generate image: ${errorMessage}. Retry ${retryCount + 1}/${maxRetries}.`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedImageUrl,
    error,
    generateImage,
    retryCount
  };
};
