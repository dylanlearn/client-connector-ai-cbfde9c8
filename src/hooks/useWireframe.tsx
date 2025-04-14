
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { unifiedWireframeService } from '@/services/ai/wireframe/unified-wireframe-service';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  WireframeData, 
  EnhancedWireframeGenerationResult 
} from '@/services/ai/wireframe/wireframe-types';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { WireframeError, WireframeErrorType } from '@/types/error-types';
import { toast as sonnerToast } from 'sonner';

export interface UseWireframeOptions {
  projectId?: string;
  initialWireframe?: WireframeData;
  defaultCreativityLevel?: number;
  autoSave?: boolean;
  onWireframeGenerated?: (result: WireframeGenerationResult) => void;
  onError?: (error: Error) => void;
  useSonnerToasts?: boolean;
  enhancedValidation?: boolean;
}

/**
 * Unified hook for all wireframe operations
 */
export function useWireframe({
  projectId: initialProjectId,
  initialWireframe,
  defaultCreativityLevel = 7,
  autoSave = false,
  onWireframeGenerated,
  onError,
  useSonnerToasts = false,
  enhancedValidation = true
}: UseWireframeOptions = {}) {
  // State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [projectId] = useState<string>(() => initialProjectId || uuidv4());
  const [creativityLevel, setCreativityLevel] = useState<number>(defaultCreativityLevel);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeData | null>(initialWireframe || null);
  const [generationResults, setGenerationResults] = useState<EnhancedWireframeGenerationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Hooks
  const { toast } = useToast();
  const { error, clearError, handleError, wrapAsync } = useErrorHandler({
    componentName: 'Wireframe',
    showToast: false
  });
  
  // Extract useful data from generation results
  const intentData = generationResults?.intentData || null;
  const blueprint = generationResults?.blueprint || null;
  
  // Helper for displaying toast messages
  const showToast = useCallback((title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    if (useSonnerToasts) {
      variant === 'destructive' 
        ? sonnerToast.error(title, { description }) 
        : sonnerToast.success(title, { description });
    } else {
      toast({
        title,
        description,
        variant
      });
    }
  }, [toast, useSonnerToasts]);
  
  // Normalize and validate parameters
  const prepareGenerationParams = useCallback((params: WireframeGenerationParams | string): WireframeGenerationParams => {
    try {
      let normalizedParams: WireframeGenerationParams;
      
      if (typeof params === 'string') {
        normalizedParams = {
          description: params,
          projectId,
          creativityLevel
        };
      } else {
        normalizedParams = {
          ...params,
          projectId: params.projectId || projectId,
          creativityLevel: params.creativityLevel ?? creativityLevel
        };
      }
      
      // Validate parameters if enhanced validation is enabled
      if (enhancedValidation) {
        if (!normalizedParams.description || normalizedParams.description.trim().length === 0) {
          throw new WireframeError('Description is required', WireframeErrorType.INVALID_PARAMS);
        }
        
        if (normalizedParams.creativityLevel !== undefined && 
           (normalizedParams.creativityLevel < 1 || normalizedParams.creativityLevel > 10)) {
          throw new WireframeError(
            'Creativity level must be between 1 and 10', 
            WireframeErrorType.INVALID_PARAMS
          );
        }
      }
      
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
  }, [projectId, creativityLevel, enhancedValidation]);
  
  // Generate a wireframe
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams | string
  ): Promise<WireframeGenerationResult> => {
    clearError();
    setIsGenerating(true);
    setValidationError(null);
    
    try {
      // Normalize and validate parameters
      const validatedParams = prepareGenerationParams(params);
      
      console.log('Generating wireframe with params:', validatedParams);
      
      // Call service to generate wireframe
      const result = await unifiedWireframeService.generateWireframe(validatedParams);
      
      if (!result.success || !result.wireframe) {
        throw new Error(result.message || 'Failed to generate wireframe');
      }
      
      // Update state with new wireframe
      setCurrentWireframe(result.wireframe);
      setGenerationResults(result as EnhancedWireframeGenerationResult);
      
      // Show success message
      showToast(
        'Wireframe Generated',
        'Your wireframe was created successfully'
      );
      
      // Call callback if provided
      if (onWireframeGenerated) {
        onWireframeGenerated(result);
      }
      
      // Auto-save if enabled
      if (autoSave && result.wireframe) {
        await saveWireframe(result.wireframe.title || 'Generated Wireframe');
      }
      
      return result;
    } catch (error) {
      const handledError = handleError(error, 'generating wireframe');
      
      setValidationError(handledError.message);
      
      showToast(
        'Wireframe Generation Failed',
        handledError.message,
        'destructive'
      );
      
      if (onError) {
        onError(handledError);
      }
      
      return {
        wireframe: null,
        success: false,
        message: handledError.message,
        errors: [handledError.message]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [
    clearError, 
    handleError, 
    prepareGenerationParams, 
    showToast, 
    onWireframeGenerated, 
    onError, 
    autoSave
  ]);
  
  // Generate a variation of an existing wireframe
  const generateVariation = useCallback(async (
    baseWireframe: WireframeData,
    styleChanges: string
  ): Promise<WireframeGenerationResult> => {
    return await wrapAsync(async () => {
      setIsGenerating(true);
      
      try {
        if (!styleChanges || styleChanges.trim().length === 0) {
          throw new Error('Style changes description is required');
        }
        
        console.log('Generating wireframe variation with style changes:', styleChanges);
        
        const result = await unifiedWireframeService.generateWireframeVariation(
          baseWireframe,
          styleChanges,
          true
        );
        
        if (!result.success || !result.wireframe) {
          throw new Error(result.message || 'Failed to generate variation');
        }
        
        setCurrentWireframe(result.wireframe);
        setGenerationResults(result as EnhancedWireframeGenerationResult);
        
        showToast(
          'Variation Generated',
          'A new creative variation was generated successfully'
        );
        
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
  }, [wrapAsync, showToast, onWireframeGenerated]);
  
  // Apply feedback to an existing wireframe
  const applyFeedback = useCallback(async (
    wireframeData: WireframeData, 
    feedback: string
  ): Promise<WireframeGenerationResult> => {
    setIsGenerating(true);
    clearError();
    
    try {
      if (!feedback || feedback.trim().length === 0) {
        throw new Error('Feedback text is required');
      }
      
      const result = await unifiedWireframeService.applyFeedback(wireframeData, feedback);
      
      if (!result.success || !result.wireframe) {
        throw new Error(result.message || 'Failed to apply feedback');
      }
      
      setCurrentWireframe(result.wireframe);
      setGenerationResults(result as EnhancedWireframeGenerationResult);
      
      showToast(
        'Feedback Applied',
        'The wireframe has been updated based on your feedback'
      );
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const errorObj = err instanceof Error ? err : new Error(errorMessage);
      
      showToast(
        'Feedback Application Failed',
        errorMessage,
        'destructive'
      );
      
      if (onError) {
        onError(errorObj);
      }
      
      return {
        success: false,
        message: errorMessage,
        wireframe: wireframeData
      };
    } finally {
      setIsGenerating(false);
    }
  }, [clearError, showToast, onError]);
  
  // Save wireframe data
  const saveWireframe = useCallback(async (
    description: string
  ): Promise<WireframeData | null> => {
    if (!currentWireframe) return null;
    
    setIsSaving(true);
    
    try {
      // In a real implementation, this would save to a database
      // For now, simulate a successful save
      console.log(`Saving wireframe ${currentWireframe.id} with description: ${description}`);
      
      // Update the description on the current wireframe
      const updatedWireframe = {
        ...currentWireframe,
        description
      };
      
      setCurrentWireframe(updatedWireframe);
      
      showToast(
        'Wireframe Saved',
        'Your wireframe has been saved successfully'
      );
      
      return updatedWireframe;
    } catch (err) {
      console.error("Error saving wireframe:", err);
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      showToast(
        'Failed to Save Wireframe',
        errorMessage,
        'destructive'
      );
      
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
      
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [currentWireframe, showToast, onError]);
  
  // Reset state
  const reset = useCallback(() => {
    setCurrentWireframe(null);
    setGenerationResults(null);
    clearError();
    setValidationError(null);
  }, [clearError]);
  
  return {
    // State
    isGenerating,
    isSaving,
    currentWireframe,
    generationResults,
    intentData,
    blueprint,
    creativityLevel,
    projectId,
    error,
    validationError,
    
    // Actions
    generateWireframe,
    generateVariation,
    applyFeedback,
    saveWireframe,
    setCreativityLevel,
    reset,
    clearError,
    
    // Helper function for easy integration with forms
    createGenerateFunction: (setFormError?: (error: string) => void) => 
      async (params: WireframeGenerationParams | string) => {
        const result = await generateWireframe(params);
        if (!result.success && setFormError) {
          setFormError(result.message || 'Failed to generate wireframe');
        }
        return result;
      }
  };
}
