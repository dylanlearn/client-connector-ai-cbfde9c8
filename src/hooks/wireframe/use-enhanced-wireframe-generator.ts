
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  WireframeData 
} from '@/services/ai/wireframe/wireframe-types';
import { createWireframeDataFromParams } from '@/services/ai/wireframe/wireframe-service-types';
import { advancedWireframeService } from '@/services/ai/wireframe/advanced-wireframe-service';
import { WireframeValidator } from '@/services/ai/wireframe/enhanced-wireframe-validator';
import { WireframeError, WireframeErrorType } from '@/types/error-types';
import { toast } from 'sonner';

export interface UseEnhancedWireframeGeneratorProps {
  onWireframeGenerated?: (result: WireframeGenerationResult) => void;
  defaultCreativityLevel?: number;
}

/**
 * Enhanced wireframe generator hook with improved error handling and validation
 */
export function useEnhancedWireframeGenerator({
  onWireframeGenerated,
  defaultCreativityLevel = 8
}: UseEnhancedWireframeGeneratorProps = {}) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [creativityLevel, setCreativityLevel] = useState<number>(defaultCreativityLevel);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeData | null>(null);
  
  // Use our custom error handler
  const { 
    error, 
    clearError, 
    handleError,
    wrapAsync
  } = useErrorHandler({ 
    componentName: 'WireframeGenerator',
    showToast: true
  });

  /**
   * Normalize and validate wireframe generation parameters
   */
  const prepareGenerationParams = (params: WireframeGenerationParams | string): WireframeGenerationParams => {
    try {
      // Convert string to params if needed
      let normalizedParams: WireframeGenerationParams;
      if (typeof params === 'string') {
        normalizedParams = {
          description: params,
          projectId: uuidv4(),
          creativityLevel
        };
      } else {
        normalizedParams = {
          ...params,
          creativityLevel: params.creativityLevel ?? creativityLevel
        };
      }
      
      // Validate the parameters
      WireframeValidator.validateGenerationParams(normalizedParams);
      
      return normalizedParams;
    } catch (error) {
      // Convert any errors to our standardized format
      if (error instanceof WireframeError) {
        throw error;
      }
      throw new WireframeError(
        error instanceof Error ? error.message : 'Invalid wireframe parameters',
        WireframeErrorType.INVALID_PARAMS
      );
    }
  };

  /**
   * Generate a wireframe with enhanced error handling and validation
   */
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams | string
  ): Promise<WireframeGenerationResult> => {
    clearError();
    setIsGenerating(true);
    
    try {
      // Prepare and validate the parameters
      const validatedParams = prepareGenerationParams(params);
      
      // Log generation attempt
      console.log('Generating wireframe with validated params:', validatedParams);
      
      // Call the service to generate the wireframe
      const result = await advancedWireframeService.generateWireframe(validatedParams);
      
      if (!result.success || !result.wireframe) {
        throw new WireframeError(
          result.message || 'Failed to generate wireframe',
          WireframeErrorType.GENERATION_FAILED
        );
      }
      
      // Validate the generated wireframe 
      WireframeValidator.validateWireframeData(result.wireframe);
      
      // Update state and notify
      setCurrentWireframe(result.wireframe);
      
      toast.success('Wireframe Generated', {
        description: 'Your wireframe was created successfully'
      });
      
      // Call the callback if provided
      if (onWireframeGenerated) {
        onWireframeGenerated(result);
      }
      
      return result;
    } catch (error) {
      const handledError = handleError(error, 'generating wireframe');
      
      // Return a standardized error response
      return {
        wireframe: null,
        success: false,
        message: handledError.message,
        errors: [handledError.message]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [clearError, creativityLevel, handleError, onWireframeGenerated]);

  /**
   * Generate a creative variation of an existing wireframe
   */
  const generateVariation = useCallback(async (
    baseWireframe: WireframeData, 
    styleChanges: string
  ): Promise<WireframeGenerationResult> => {
    return await wrapAsync(async () => {
      setIsGenerating(true);
      
      try {
        // Validate base wireframe
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
        const result = await advancedWireframeService.generateWireframe({
          description: `Variation of ${baseWireframe.title}: ${styleChanges}`,
          baseWireframe: baseWireframe,
          styleChanges,
          isVariation: true,
          enhancedCreativity: true,
          creativityLevel: creativityLevel + 2, // Increase creativity for variations
        });
        
        if (!result.success || !result.wireframe) {
          throw new WireframeError(
            result.message || 'Failed to generate variation',
            WireframeErrorType.GENERATION_FAILED
          );
        }
        
        // Validate the generated wireframe variation
        WireframeValidator.validateWireframeData(result.wireframe);
        
        // Update state and notify
        setCurrentWireframe(result.wireframe);
        
        toast.success('Variation Generated', {
          description: 'A new creative variation was generated successfully'
        });
        
        // Call the callback if provided
        if (onWireframeGenerated) {
          onWireframeGenerated(result);
        }
        
        return result;
      } finally {
        setIsGenerating(false);
      }
    }, true, 'generating wireframe variation') || {
      wireframe: null,
      success: false,
      message: 'Failed to generate wireframe variation',
      errors: ['Operation failed']
    };
  }, [creativityLevel, onWireframeGenerated, wrapAsync]);

  return {
    isGenerating,
    currentWireframe,
    error,
    creativityLevel,
    setCreativityLevel,
    generateWireframe,
    generateVariation,
    clearError
  };
}
