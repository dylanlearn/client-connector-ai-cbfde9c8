
import { useState } from "react";
import { AIContentGenerationService } from "@/services/ai/content";

export const useContentGeneration = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Generates content based on prompt and content type
   */
  const generateContent = async (prompt: string, contentType: string): Promise<string> => {
    setIsProcessing(true);
    
    try {
      // Call the AI service to generate content
      const content = await AIContentGenerationService.generateContent(
        prompt,
        contentType
      );
      
      return content;
    } catch (error) {
      console.error("Error generating content:", error);
      return `Error generating ${contentType} content`;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    generateContent,
    isProcessing
  };
};
