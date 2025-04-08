
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { wireframeGenerator } from '@/services/ai/wireframe/api/wireframe-generator';
import { wireframeMemoryService } from '@/services/ai/wireframe/wireframe-memory-service';
import { Toast } from '@/hooks/use-toast'; // Change import type from ToastProps to Toast
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeResult
} from '@/services/ai/wireframe/wireframe-types';

export function useWireframeGenerator(
  creativityLevel: number = 7,
  setCurrentWireframe: (wireframe: WireframeGenerationResult | null) => void,
  toast: (props: Toast) => void // Changed from ToastProps to Toast
) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const generateWireframe = useCallback(async (params: WireframeGenerationParams) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Get design memory if available
      const designMemory = params.projectId 
        ? await wireframeMemoryService.getDesignMemory(params.projectId).catch(() => null)
        : null;
      
      // Enhance params with design memory and creativity settings
      const enhancedParams = {
        ...params,
        creativityLevel: params.creativityLevel ?? creativityLevel,
        enhancedCreativity: params.enhancedCreativity ?? true
      };
      
      if (designMemory) {
        enhancedParams.stylePreferences = designMemory.stylePreferences;
        // Additional logic for using design memory
      }
      
      const result = await wireframeGenerator.generateWireframe(enhancedParams);
      
      if (!result?.wireframe) {
        throw new Error("Failed to generate wireframe");
      }
      
      setCurrentWireframe(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Wireframe generation error:", err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      // Provide a fallback wireframe with error information for graceful UI handling
      const fallbackResult: WireframeGenerationResult = {
        wireframe: {
          id: uuidv4(),
          title: "Error: Failed to generate wireframe",
          sections: [],
          description: `Error: ${errorMessage}`
        },
        error: errorMessage,
        success: false // Set success to false
      };
      
      setCurrentWireframe(fallbackResult);
      
      toast({
        title: "Wireframe generation failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return fallbackResult;
    } finally {
      setIsGenerating(false);
    }
  }, [creativityLevel, setCurrentWireframe, toast]);
  
  const generateCreativeVariation = useCallback(async (
    baseWireframe: WireframeGenerationResult
  ) => {
    try {
      toast({
        title: "Generating variation",
        description: "Creating a creative variation of the wireframe..."
      });
      
      if (!baseWireframe?.wireframe) {
        throw new Error("No base wireframe provided for variation");
      }
      
      const result = await generateWireframe({
        baseWireframe: baseWireframe.wireframe,
        description: `Create a more creative variation of the existing wireframe: ${baseWireframe.wireframe.title || ''}`,
        style: baseWireframe.wireframe.style,
        creativityLevel: Math.min(10, creativityLevel + 1), // Increase creativity
        enhancedCreativity: true,
        // Remove imageUrl from this object as it's not a valid property in WireframeGenerationParams
        // and use it properly in the wireframe object if needed
        imageUrl: baseWireframe.imageUrl || baseWireframe.wireframe.imageUrl
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create variation";
      console.error("Variation generation error:", err);
      
      toast({
        title: "Variation generation failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      const fallbackResult: WireframeGenerationResult = {
        wireframe: {
          id: uuidv4(),
          title: "Error: Failed to generate variation",
          sections: [],
          description: `Error: ${errorMessage}`
        },
        error: err instanceof Error ? err.message : String(err),
        success: false // Set success to false
      };
      
      return fallbackResult;
    }
  }, [generateWireframe, creativityLevel, toast]);
  
  const generateFromExample = useCallback(async (
    examplePrompt: string
  ) => {
    try {
      toast({
        title: "Generating from example",
        description: "Creating wireframe from example..."
      });
      
      const result = await generateWireframe({
        description: examplePrompt,
        creativityLevel
        // Remove the success property as it's not a valid property for WireframeGenerationParams
        // Success should be in the result, not in the params
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate from example";
      
      // Return a wireframe with error info
      const fallbackResult: WireframeGenerationResult = {
        wireframe: {
          id: uuidv4(),
          title: "Error: Generation from example failed",
          sections: [],
          description: `Error: ${errorMessage}`
        },
        error: errorMessage,
        success: false // Set success to false
      };
      
      return fallbackResult;
    }
  }, [generateWireframe, creativityLevel, toast]);
  
  return {
    isGenerating,
    error,
    generateWireframe,
    generateCreativeVariation, 
    generateFromExample
  };
}
