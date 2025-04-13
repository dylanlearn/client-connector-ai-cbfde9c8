
import { useState, useCallback } from 'react';
import { Toast } from "@/hooks/use-toast";
import { 
  WireframeGenerationParams,
  WireframeGenerationResult,
  WireframeData,
  normalizeWireframeGenerationParams
} from '@/services/ai/wireframe/wireframe-types';
import { 
  generateWireframe as apiGenerateWireframeService,
  generateWireframeVariationWithStyle 
} from '@/services/ai/wireframe/wireframe-service';
import { v4 as uuidv4 } from 'uuid';

export function useWireframeGenerator(
  defaultCreativityLevel: number,
  setCurrentWireframe: React.Dispatch<React.SetStateAction<WireframeGenerationResult | null>>,
  showToast: (props: Toast) => string
) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a wireframe based on a prompt
  const generateWireframe = useCallback(async (params: WireframeGenerationParams) => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log("Starting wireframe generation with params:", params);
      
      // Normalize parameters for consistency
      const normalizedParams = normalizeWireframeGenerationParams(params);
      
      // Extract params that need special processing
      const projectId = normalizedParams.projectId;
      const creativityLevel = normalizedParams.creativityLevel || defaultCreativityLevel;
      const enhancedCreativity = normalizedParams.enhancedCreativity || false;
      
      console.log(`Enhanced wireframe generation initiated with creativityLevel: ${creativityLevel}`);

      // Call the service to generate the wireframe
      const result = await apiGenerateWireframeService(normalizedParams);

      if (result.success && result.wireframe) {
        console.log("Wireframe generated successfully:", result.wireframe.id);
        
        // Set the current wireframe
        setCurrentWireframe(result);

        // Show success toast
        showToast({
          title: "Wireframe Generated",
          description: "Your wireframe has been successfully generated"
        });

        return result;
      } else {
        throw new Error(result.message || "Failed to generate wireframe");
      }
    } catch (err) {
      console.error("Error generating wireframe:", err);
      
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      
      // Show error toast
      showToast({
        title: "Wireframe Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Return a default error result
      return {
        wireframe: null,
        success: false,
        message: errorMessage
      };
    } finally {
      setIsGenerating(false);
    }
  }, [defaultCreativityLevel, setCurrentWireframe, showToast]);

  // Generate a creative variation of an existing wireframe
  const generateCreativeVariation = useCallback(async (params: WireframeGenerationParams) => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log("Starting wireframe variation generation with params:", params);
      
      // Validate required parameters
      if (!params.baseWireframe && !params.description) {
        throw new Error("Either baseWireframe or description is required for variation generation");
      }
      
      // Apply creativity level
      const creativityLevel = params.creativityLevel || defaultCreativityLevel;
      
      // Call the service to generate the variation with all required arguments
      const result = await generateWireframeVariationWithStyle(
        params,
        creativityLevel 
      );

      if (result.success && result.wireframe) {
        console.log("Wireframe variation generated successfully:", result.wireframe.id);
        
        // Set the current wireframe
        setCurrentWireframe(result);

        // Show success toast
        showToast({
          title: "Variation Generated",
          description: "A new creative variation has been generated"
        });

        return result;
      } else {
        throw new Error(result.message || "Failed to generate variation");
      }
    } catch (err) {
      console.error("Error generating variation:", err);
      
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      
      // Show error toast
      showToast({
        title: "Variation Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Return a default error result
      return {
        wireframe: null,
        success: false,
        message: errorMessage
      };
    } finally {
      setIsGenerating(false);
    }
  }, [defaultCreativityLevel, setCurrentWireframe, showToast]);

  return {
    isGenerating,
    error,
    generateWireframe,
    generateCreativeVariation
  };
}
