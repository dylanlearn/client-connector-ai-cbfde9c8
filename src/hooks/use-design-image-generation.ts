
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

  /**
   * Generate a design image with AI
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
      toast.success(`${designType} image generated successfully!`);
      
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Failed to generate image: ${errorMessage}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedImageUrl,
    error,
    generateImage
  };
};
