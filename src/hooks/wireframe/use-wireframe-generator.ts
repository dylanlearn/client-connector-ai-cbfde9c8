
import { useState, useCallback } from 'react';
import { Toast } from '@/hooks/use-toast';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  WireframeData
} from '@/services/ai/wireframe/wireframe-types';
import { createWireframeDataFromParams } from '@/services/ai/wireframe/wireframe-service-types';
import { unifiedWireframeService } from '@/services/ai/wireframe/unified-wireframe-service';
import { v4 as uuidv4 } from 'uuid';
import { WireframeValidator } from '@/services/ai/wireframe/enhanced-wireframe-validator';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { WireframeError, WireframeErrorType } from '@/types/error-types';

export function useWireframeGenerator(
  creativityLevel: number,
  setCurrentWireframe: (wireframe: WireframeGenerationResult | null) => void,
  toast: (props: Toast) => string
) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use our centralized error handler
  const { 
    error, 
    clearError, 
    handleError, 
    wrapAsync 
  } = useErrorHandler({
    componentName: 'WireframeGenerator'
  });

  // Generate a wireframe from parameters
  const generateWireframe = useCallback(
    async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
      setIsGenerating(true);
      clearError();

      try {
        // Enhance params with creativity level if not already set
        const enhancedParams: WireframeGenerationParams = {
          ...params,
          creativityLevel: params.creativityLevel || creativityLevel,
          projectId: params.projectId || uuidv4(),
        };

        // Validate the parameters
        WireframeValidator.validateGenerationParams(enhancedParams);

        // Log generation attempt
        console.log('Generating wireframe with params:', JSON.stringify(enhancedParams, null, 2));

        // Call the service to generate the wireframe
        const result = await unifiedWireframeService.generateWireframe(enhancedParams);

        if (result.success && result.wireframe) {
          // Validate the generated wireframe
          WireframeValidator.validateWireframeData(result.wireframe);
          
          setCurrentWireframe(result);
          toast({
            title: 'Success',
            description: 'Wireframe generated successfully',
          });
        } else {
          throw new WireframeError(
            result.message || 'Failed to generate wireframe',
            WireframeErrorType.GENERATION_FAILED
          );
        }

        return result;
      } catch (err) {
        const handledError = handleError(err, 'generating wireframe');
        
        toast({
          title: 'Error',
          description: handledError.message,
          variant: 'destructive',
        });

        return {
          wireframe: null,
          success: false,
          message: handledError.message,
          errors: [handledError.message]
        };
      } finally {
        setIsGenerating(false);
      }
    },
    [creativityLevel, setCurrentWireframe, toast, clearError, handleError]
  );

  // Generate a creative variation of an existing wireframe
  const generateCreativeVariation = useCallback(
    async (baseWireframe: WireframeData, styleChanges: string): Promise<WireframeGenerationResult> => {
      return await wrapAsync(async () => {
        setIsGenerating(true);
        
        try {
          // Validate inputs
          WireframeValidator.validateWireframeData(baseWireframe);
          
          if (!styleChanges || styleChanges.trim().length === 0) {
            throw new WireframeError(
              'Style changes description is required',
              WireframeErrorType.INVALID_PARAMS
            );
          }

          // Log variation attempt
          console.log('Generating creative variation with style changes:', styleChanges);

          // Generate the variation
          const result = await unifiedWireframeService.generateWireframe({
            description: `Variation of ${baseWireframe.title}: ${styleChanges}`,
            baseWireframe: baseWireframe,
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
            throw new WireframeError(
              result.message || 'Failed to generate variation',
              WireframeErrorType.GENERATION_FAILED
            );
          }

          return result;
        } finally {
          setIsGenerating(false);
        }
      }, true, 'generating creative variation') || {
        wireframe: null,
        success: false,
        message: 'Failed to generate creative variation',
        errors: ['Operation failed']
      };
    },
    [creativityLevel, setCurrentWireframe, toast, wrapAsync]
  );

  return {
    isGenerating,
    error,
    generateWireframe,
    generateCreativeVariation,
  };
}
