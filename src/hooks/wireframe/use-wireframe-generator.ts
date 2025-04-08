
import { useState, useCallback } from 'react';
import { wireframeApiService } from '@/services/ai/wireframe';
import type { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  WireframeResult
} from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';

// This hook provides wireframe generation functionality
export function useWireframeGenerator(
  creativityLevel: number = 8,
  setCurrentWireframe?: (result: WireframeGenerationResult | null) => void,
  toast?: any
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a wireframe based on provided parameters
  const generateWireframe = useCallback(async (params: WireframeGenerationParams): Promise<WireframeGenerationResult | null> => {
    try {
      setIsGenerating(true);
      setError(null);

      // First, check if user is trying to generate from existing wireframe
      let initialWireframe = null;
      if (params.baseWireframe && params.baseWireframe.id) {
        initialWireframe = await wireframeApiService.getWireframe(params.baseWireframe.id);
      }

      // Enhance params with creativity level if not provided
      const enhancedParams = {
        ...params,
        creativityLevel: params.creativityLevel || creativityLevel,
        enhancedCreativity: params.enhancedCreativity !== undefined ? params.enhancedCreativity : true
      };

      // Call the API service to generate wireframe
      const result = await wireframeApiService.generateWireframe(enhancedParams);

      if (!result || !result.wireframe) {
        const errorMsg = "Failed to generate wireframe";
        setError(errorMsg);
        if (toast) toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { 
          wireframe: {
            id: uuidv4(), // Ensure ID is set
            title: "Error", // Ensure title is set
            sections: [],
            description: "Failed to generate wireframe"
          },
          error: errorMsg 
        };
      }
      
      // Ensure the wireframe has an ID
      if (!result.wireframe.id) {
        result.wireframe.id = uuidv4();
      }
      
      // Ensure the wireframe has a title
      if (!result.wireframe.title) {
        result.wireframe.title = enhancedParams.pageType || "Generated Wireframe";
      }

      // Create the result object
      const generationResult: WireframeGenerationResult = {
        wireframe: result.wireframe,
        imageUrl: result.imageUrl
      };

      // Update current wireframe if setter provided
      if (setCurrentWireframe) {
        setCurrentWireframe(generationResult);
      }

      return generationResult;
    } catch (error: any) {
      const errorMsg = error.message || "An unexpected error occurred";
      setError(errorMsg);
      if (toast) toast({ title: "Error", description: errorMsg, variant: "destructive" });
      return { 
        wireframe: {
          id: uuidv4(), // Ensure ID is set
          title: "Error", // Ensure title is set
          sections: [],
          description: "An error occurred"
        },
        error: errorMsg 
      };
    } finally {
      setIsGenerating(false);
    }
  }, [creativityLevel, toast, setCurrentWireframe]);

  // Generate a creative variation of an existing wireframe
  const generateCreativeVariation = useCallback(async (
    currentWireframe: WireframeGenerationResult
  ): Promise<WireframeGenerationResult | null> => {
    try {
      setIsGenerating(true);
      setError(null);

      if (!currentWireframe || !currentWireframe.wireframe) {
        const errorMsg = "No wireframe to generate variation from";
        setError(errorMsg);
        if (toast) toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { 
          wireframe: {
            id: uuidv4(), // Ensure ID is set
            title: "Error", // Ensure title is set
            sections: [],
            description: "No wireframe to generate variation from"
          },
          error: errorMsg 
        };
      }

      // Create our own implementation since the API service doesn't seem to have this method
      const variationParams: WireframeGenerationParams = {
        description: `Creative variation of "${currentWireframe.wireframe.title || 'Untitled Wireframe'}"`,
        baseWireframe: {
          ...currentWireframe.wireframe,
          // Ensure the id and title fields are properly set for WireframeData
          id: currentWireframe.wireframe.id || uuidv4(),
          title: currentWireframe.wireframe.title || 'Untitled Wireframe'
        },
        creativityLevel: creativityLevel,
        enhancedCreativity: true
      };

      // Use the regular generateWireframe with our variation parameters
      return await generateWireframe(variationParams);
    } catch (error: any) {
      const errorMsg = error.message || "An unexpected error occurred";
      setError(errorMsg);
      if (toast) toast({ title: "Error", description: errorMsg, variant: "destructive" });
      return { 
        wireframe: {
          id: uuidv4(), // Ensure ID is set
          title: "Error", // Ensure title is set
          sections: [],
          description: "An error generating variation"
        },
        error: errorMsg 
      };
    } finally {
      setIsGenerating(false);
    }
  }, [creativityLevel, toast, setCurrentWireframe, generateWireframe]);

  return {
    isGenerating,
    error,
    generateWireframe,
    generateCreativeVariation
  };
}
