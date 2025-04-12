
import { useState, useCallback } from 'react';
import { Toast } from "@/hooks/use-toast";
import { 
  WireframeGenerationParams,
  WireframeGenerationResult,
  WireframeData
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
      // Extract params that need special processing
      const projectId = params.projectId;
      const creativityLevel = params.creativityLevel || defaultCreativityLevel;
      const enhancedCreativity = params.enhancedCreativity || false;
      
      // Process style params if it's a string or object
      let processedStyle: string | Record<string, any> = {}; 
      if (params.style) {
        if (typeof params.style === 'string') {
          processedStyle = params.style;
        } else {
          processedStyle = { ...params.style };
        }
      }
      
      // Create the generation params with proper typing
      const generationParams: WireframeGenerationParams = {
        description: params.description,
        industry: params.industry,
        style: processedStyle,
        colorScheme: params.colorScheme,
        projectId: projectId,
        creativityLevel: creativityLevel,
        enhancedCreativity: enhancedCreativity,
        intakeData: params.intakeData
      };

      // Call the service to generate the wireframe
      const result = await apiGenerateWireframeService(generationParams);

      if (result.success && result.wireframe) {
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
        wireframe: {
          id: uuidv4(),
          title: 'Error Wireframe',
          description: 'An error occurred during generation',
          sections: [],
          colorScheme: {
            primary: '#3b82f6',
            secondary: '#10b981',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#000000'
          },
          typography: {
            headings: 'Inter',
            body: 'Inter'
          }
        },
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
      // Call the service to generate the variation
      const result = await generateWireframeVariationWithStyle({
        ...params,
        creativityLevel: params.creativityLevel || defaultCreativityLevel
      });

      if (result.success && result.wireframe) {
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
        wireframe: {
          id: uuidv4(),
          title: 'Error in Variation',
          description: 'An error occurred during variation generation',
          sections: [],
          colorScheme: {
            primary: '#3b82f6',
            secondary: '#10b981',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#000000'
          },
          typography: {
            headings: 'Inter',
            body: 'Inter'
          }
        },
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
