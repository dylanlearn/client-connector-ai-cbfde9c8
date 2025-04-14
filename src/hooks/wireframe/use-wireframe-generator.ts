
import { useState, useCallback } from 'react';
import { Toast } from '@/hooks/use-toast';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  WireframeData
} from '@/services/ai/wireframe/wireframe-types';
import { createWireframeDataFromParams } from '@/services/ai/wireframe/wireframe-service-types';
import { advancedWireframeService } from '@/services/ai/wireframe/advanced-wireframe-service';
import { v4 as uuidv4 } from 'uuid';

export function useWireframeGenerator(
  creativityLevel: number,
  setCurrentWireframe: (wireframe: WireframeGenerationResult | null) => void,
  toast: (props: Toast) => string
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Generate a wireframe from parameters
  const generateWireframe = useCallback(
    async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
      setIsGenerating(true);
      setError(null);

      try {
        // Enhance params with creativity level if not already set
        const enhancedParams: WireframeGenerationParams = {
          ...params,
          creativityLevel: params.creativityLevel || creativityLevel,
          projectId: params.projectId || uuidv4(),
        };

        // Log generation attempt
        console.log('Generating wireframe with params:', JSON.stringify(enhancedParams, null, 2));

        // Call the service to generate the wireframe
        const result = await advancedWireframeService.generateWireframe(enhancedParams);

        if (result.success && result.wireframe) {
          setCurrentWireframe(result);
          toast({
            title: 'Success',
            description: 'Wireframe generated successfully',
          });
        } else {
          throw new Error(result.message || 'Failed to generate wireframe');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(err instanceof Error ? err : new Error(errorMessage));

        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
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
    },
    [creativityLevel, setCurrentWireframe, toast]
  );

  // Generate a creative variation of an existing wireframe
  const generateCreativeVariation = useCallback(
    async (baseWireframe: WireframeData, styleChanges: string): Promise<WireframeGenerationResult> => {
      setIsGenerating(true);
      setError(null);

      try {
        // Log variation attempt
        console.log('Generating creative variation with style changes:', styleChanges);

        // Convert params to WireframeData if needed
        const baseData = baseWireframe;

        // Generate the variation
        const result = await advancedWireframeService.generateWireframe({
          description: `Variation of ${baseData.title}: ${styleChanges}`,
          baseWireframe: baseData,
          styleChanges,
          isVariation: true,
          enhancedCreativity: true,
          creativityLevel: creativityLevel + 2, // Increase creativity for variations
        });

        if (result.success && result.wireframe) {
          setCurrentWireframe(result);
          toast({
            title: 'Success',
            description: 'Creative variation generated successfully',
          });
        } else {
          throw new Error(result.message || 'Failed to generate variation');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(err instanceof Error ? err : new Error(errorMessage));

        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
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
    },
    [creativityLevel, setCurrentWireframe, toast]
  );

  return {
    isGenerating,
    error,
    generateWireframe,
    generateCreativeVariation,
  };
}
