
import { useState, useCallback } from 'react';
import { WireframeService } from '@/services/ai/wireframe/wireframe-service';
import { WireframeApiService } from '@/services/ai/wireframe/api/wireframe-api-service';
import type { 
  WireframeGenerationParams, 
  WireframeGenerationResult 
} from '@/services/ai/wireframe/wireframe-types';

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
        initialWireframe = await WireframeApiService.getWireframe(params.baseWireframe.id);
      }

      // Enhance params with creativity level if not provided
      const enhancedParams = {
        ...params,
        creativityLevel: params.creativityLevel || creativityLevel,
        enhancedCreativity: params.enhancedCreativity !== undefined ? params.enhancedCreativity : true
      };

      // Call the API service to generate wireframe - WireframeApiService instead of WireframeService
      const result = await WireframeApiService.generateWireframe(enhancedParams);

      if (!result || !result.wireframe) {
        const errorMsg = "Failed to generate wireframe";
        setError(errorMsg);
        if (toast) toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { error: errorMsg };
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
      return { error: errorMsg };
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
        return { error: errorMsg };
      }

      // Generate a creative variation using the API service - WireframeApiService instead of WireframeService
      const result = await WireframeApiService.generateCreativeVariation({
        baseWireframe: currentWireframe.wireframe,
        creativityLevel: creativityLevel
      });

      if (!result || !result.wireframe) {
        const errorMsg = "Failed to generate wireframe variation";
        setError(errorMsg);
        if (toast) toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { error: errorMsg };
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
      return { error: errorMsg };
    } finally {
      setIsGenerating(false);
    }
  }, [creativityLevel, toast, setCurrentWireframe]);

  return {
    isGenerating,
    error,
    generateWireframe,
    generateCreativeVariation
  };
}
