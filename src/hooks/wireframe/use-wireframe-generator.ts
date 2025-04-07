
import { useState, useCallback } from 'react';
import { WireframeService } from '@/services/ai/wireframe/wireframe-service';
import { WireframeGenerationParams, WireframeGenerationResult, WireframeData } from '@/services/ai/wireframe/wireframe-types';

export function useWireframeGenerator(
  creativityLevel: number,
  setCurrentWireframe: (wireframe: WireframeGenerationResult | null) => void,
  toast: any
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams
  ) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const fullParams = {
        ...params,
        creativityLevel,
        // Ensure complexity is one of the allowed values
        complexity: params.complexity || 'moderate' as 'simple' | 'moderate' | 'complex'
      };
      
      const result = await WireframeService.generateWireframe(fullParams);
      
      setCurrentWireframe(result);
      
      toast({
        title: "Wireframe generated",
        description: "Your wireframe is ready"
      });
      
      return result;
    } catch (err) {
      console.error('Error generating wireframe:', err);
      
      const errorObj = err instanceof Error ? err : new Error("Failed to generate wireframe");
      setError(errorObj);
      
      toast({
        title: "Generation failed",
        description: errorObj.message,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [creativityLevel, setCurrentWireframe, toast]);

  const generateCreativeVariation = useCallback(async (
    baseResult: WireframeGenerationResult
  ) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // In a real implementation, this would send the base wireframe 
      // to the backend to generate a variation with higher creativity
      const params: WireframeGenerationParams = {
        title: `Creative variation of ${baseResult.wireframe?.title || "Wireframe"}`,
        description: baseResult.wireframe?.description,
        baseWireframe: baseResult.wireframe,
        creativityLevel: Math.min(creativityLevel + 2, 10), // Increase creativity
        timestamp: new Date().toISOString()
      };
      
      const result = await WireframeService.generateWireframe(params);
      
      setCurrentWireframe(result);
      
      toast({
        title: "Creative variation generated",
        description: "Your new variation is ready"
      });
      
      return result;
    } catch (err) {
      console.error('Error generating creative variation:', err);
      
      const errorObj = err instanceof Error ? err : new Error("Failed to generate variation");
      setError(errorObj);
      
      toast({
        title: "Variation failed",
        description: errorObj.message,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [creativityLevel, setCurrentWireframe, toast]);

  return {
    isGenerating,
    error,
    generateWireframe,
    generateCreativeVariation
  };
}
