
import { useState, useCallback } from 'react';
import { Toast } from '@/hooks/use-toast';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult 
} from '@/services/ai/wireframe/wireframe-types';
import { unifiedWireframeService } from '@/services/ai/wireframe/unified-wireframe-service';
import { DebugLogger } from '@/utils/monitoring/debug-logger';

export const useWireframeGenerator = (
  creativityLevel: number, 
  setCurrentWireframe: (wireframe: WireframeGenerationResult | null) => void, 
  toastFn: (props: Toast) => string
) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    setIsGenerating(true);
    setError(null);
    
    const operationId = `wireframe-${Date.now()}`;
    DebugLogger.startTimer(operationId);
    
    try {
      // Apply creativity level if not already set
      const enhancedParams = {
        ...params,
        creativityLevel: params.creativityLevel || creativityLevel
      };
      
      // Direct API call with optimized parameters
      const result = await unifiedWireframeService.generateWireframe(enhancedParams);
      
      if (result.success && result.wireframe) {
        setCurrentWireframe(result);
        toastFn({
          title: "Wireframe Generated",
          description: "Your wireframe has been created successfully"
        });
      } else {
        throw new Error(result.message || "Failed to generate wireframe");
      }
      
      DebugLogger.endTimer(operationId);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      DebugLogger.error('Wireframe generation failed', { 
        context: 'wireframe-generator',
        metadata: { error: errorMessage }
      });
      
      setError(error instanceof Error ? error : new Error(errorMessage));
      
      toastFn({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return {
        wireframe: null,
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [creativityLevel, setCurrentWireframe, toastFn]);

  const generateCreativeVariation = useCallback(async (
    baseWireframe: any,
    styleChanges: string = "Create a more creative variation"
  ): Promise<WireframeGenerationResult> => {
    setIsGenerating(true);
    setError(null);
    
    const operationId = `variation-${Date.now()}`;
    DebugLogger.startTimer(operationId);
    
    try {
      const result = await unifiedWireframeService.generateWireframeVariation(
        baseWireframe,
        styleChanges,
        true
      );
      
      if (result.success && result.wireframe) {
        setCurrentWireframe(result);
        toastFn({
          title: "Variation Generated",
          description: "A new creative variation has been created"
        });
      } else {
        throw new Error(result.message || "Failed to generate variation");
      }
      
      DebugLogger.endTimer(operationId);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      DebugLogger.error('Variation generation failed', { 
        context: 'wireframe-generator',
        metadata: { error: errorMessage }
      });
      
      setError(error instanceof Error ? error : new Error(errorMessage));
      
      toastFn({
        title: "Variation Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return {
        wireframe: null,
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [setCurrentWireframe, toastFn]);

  return {
    isGenerating,
    error,
    generateWireframe,
    generateCreativeVariation
  };
};
