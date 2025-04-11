import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { wireframeGenerator } from '@/services/ai/wireframe/api';
import { wireframeMemoryService } from '@/services/ai/wireframe/wireframe-memory-service';
import { Toast } from '@/hooks/use-toast';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult
} from '@/services/ai/wireframe/wireframe-types';

export function useWireframeGenerator(
  creativityLevel: number = 7,
  setCurrentWireframe: (wireframe: WireframeGenerationResult | null) => void,
  toast: (props: Toast) => string
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
      
      // Provide an error wireframe for graceful UI handling
      const fallbackResult: WireframeGenerationResult = {
        wireframe: {
          id: uuidv4(),
          title: "Error: Failed to generate wireframe",
          sections: [],
          description: `Error: ${errorMessage}`
        },
        error: errorMessage,
        success: false
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
      
      // Create a clean params object
      const params: WireframeGenerationParams = {
        baseWireframe: baseWireframe.wireframe,
        description: `Create a more creative variation of the existing wireframe: ${baseWireframe.wireframe.title || ''}`,
        style: baseWireframe.wireframe.style,
        creativityLevel: Math.min(10, creativityLevel + 1), // Increase creativity
        enhancedCreativity: true
      };
      
      const result = await generateWireframe(params);
      
      if (result && baseWireframe.imageUrl) {
        result.imageUrl = baseWireframe.imageUrl;
      }
      
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
        success: false
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
      
      const params: WireframeGenerationParams = {
        description: examplePrompt,
        creativityLevel
      };
      
      const result = await generateWireframe(params);
      
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
        success: false
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
