
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  WireframeData 
} from '@/services/ai/wireframe/wireframe-types';
import { createWireframeDataFromParams } from '@/services/ai/wireframe/wireframe-service-types';
import { unifiedWireframeService } from '@/services/ai/wireframe/unified-wireframe-service';
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
  
  const errorHandler = useErrorHandler({ 
    componentName: 'WireframeGenerator',
    showToast: true
  });

  /**
   * Normalize and validate wireframe generation parameters
   */
  const prepareGenerationParams = (params: WireframeGenerationParams | string): WireframeGenerationParams => {
    try {
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
      
      WireframeValidator.validateGenerationParams(normalizedParams);
      
      return normalizedParams;
    } catch (error) {
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
    errorHandler.clearError();
    setIsGenerating(true);
    
    try {
      const validatedParams = prepareGenerationParams(params);
      
      console.log('Generating wireframe with validated params:', validatedParams);
      
      const result = await unifiedWireframeService.generateWireframe(validatedParams);
      
      if (!result.success || !result.wireframe) {
        throw new WireframeError(
          result.message || 'Failed to generate wireframe',
          WireframeErrorType.GENERATION_FAILED
        );
      }
      
      WireframeValidator.validateWireframeData(result.wireframe);
      
      setCurrentWireframe(result.wireframe);
      
      toast.success('Wireframe Generated', {
        description: 'Your wireframe was created successfully'
      });
      
      if (onWireframeGenerated) {
        onWireframeGenerated(result);
      }
      
      return result;
    } catch (error) {
      const handledError = errorHandler.handleError(error, 'generating wireframe');
      
      return {
        wireframe: null,
        success: false,
        message: handledError.message,
        errors: [handledError.message]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [errorHandler, creativityLevel, onWireframeGenerated]);

  /**
   * Generate a creative variation of an existing wireframe
   */
  const generateVariation = useCallback(async (
    baseWireframe: WireframeData, 
    styleChanges: string
  ): Promise<WireframeGenerationResult> => {
    return await errorHandler.wrapAsync(async () => {
      setIsGenerating(true);
      
      try {
        WireframeValidator.validateWireframeData(baseWireframe);
        
        if (!styleChanges || styleChanges.trim().length === 0) {
          throw new WireframeError(
            'Style changes description is required',
            WireframeErrorType.INVALID_PARAMS
          );
        }
        
        console.log('Generating creative variation with style changes:', styleChanges);
        
        const result = await unifiedWireframeService.generateWireframeVariation(
          baseWireframe,
          styleChanges,
          true
        );
        
        if (!result.success || !result.wireframe) {
          throw new WireframeError(
            result.message || 'Failed to generate variation',
            WireframeErrorType.GENERATION_FAILED
          );
        }
        
        WireframeValidator.validateWireframeData(result.wireframe);
        
        setCurrentWireframe(result.wireframe);
        
        toast.success('Variation Generated', {
          description: 'A new creative variation was generated successfully'
        });
        
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
  }, [creativityLevel, onWireframeGenerated, errorHandler]);

  return {
    isGenerating,
    currentWireframe,
    error: errorHandler.error,
    creativityLevel,
    setCreativityLevel,
    generateWireframe,
    generateVariation,
    clearError: errorHandler.clearError
  };
}
