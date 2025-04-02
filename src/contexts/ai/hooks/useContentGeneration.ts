
import { useState } from "react";
import { AIGeneratorService } from "@/services/ai";

export const useContentGeneration = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate content using the AI
  const generateContent = async (options: any) => {
    setIsProcessing(true);
    try {
      const content = await AIGeneratorService.generateContent(options);
      return content;
    } catch (error) {
      console.error("Error generating content:", error);
      return `Error generating ${options.type || 'content'}`;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    generateContent
  };
};
