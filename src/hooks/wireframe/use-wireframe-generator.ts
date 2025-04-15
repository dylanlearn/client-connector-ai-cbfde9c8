
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
    
    DebugLogger.info('Starting wireframe generation', { 
      context: 'wireframe-generator',
      metadata: { params, creativityLevel }
    });
    
    try {
      // Apply creativity level if not already set
      const enhancedParams = {
        ...params,
        creativityLevel: params.creativityLevel || creativityLevel
      };
      
      // Direct API call with optimized parameters
      const result = await unifiedWireframeService.generateWireframe(enhancedParams);
      
      // Update current wireframe state
      if (result.success && result.wireframe) {
        setCurrentWireframe(result);
        
        DebugLogger.info('Wireframe generated successfully', { 
          context: 'wireframe-generator',
          metadata: { wireframeId: result.wireframe.id }
        });
        
        // Show success toast
        toastFn({
          title: "Wireframe Generated",
          description: "Your wireframe has been created successfully"
        });
      } else {
        throw new Error(result.message || "Failed to generate wireframe");
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      DebugLogger.error('Wireframe generation failed', { 
        context: 'wireframe-generator',
        metadata: { error: errorMessage }
      });
      
      setError(error instanceof Error ? error : new Error(errorMessage));
      
      // Show error toast
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
    
    DebugLogger.info('Starting wireframe variation generation', { 
      context: 'wireframe-generator',
      metadata: { baseWireframeId: baseWireframe?.id, styleChanges }
    });
    
    try {
      // Optimized direct call to generate variation
      const result = await unifiedWireframeService.generateWireframeVariation(
        baseWireframe,
        styleChanges,
        true // Enhanced creativity
      );
      
      // Update current wireframe state
      if (result.success && result.wireframe) {
        setCurrentWireframe(result);
        
        DebugLogger.info('Wireframe variation generated successfully', { 
          context: 'wireframe-generator',
          metadata: { wireframeId: result.wireframe.id }
        });
        
        // Show success toast
        toastFn({
          title: "Variation Generated",
          description: "A new creative variation has been created"
        });
      } else {
        throw new Error(result.message || "Failed to generate variation");
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      DebugLogger.error('Wireframe variation generation failed', { 
        context: 'wireframe-generator',
        metadata: { error: errorMessage }
      });
      
      setError(error instanceof Error ? error : new Error(errorMessage));
      
      // Show error toast
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
