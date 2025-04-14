
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { WireframeData, WireframeGenerationParams, WireframeGenerationResult } from '@/services/ai/wireframe/wireframe-types';
import { AppError, ErrorResponse } from '@/types/error-types';
import { ErrorHandler } from '@/utils/error-handler';
import { parseError } from '@/utils/error-handling';

export interface UseWireframeOptions {
  projectId?: string;
  enhancedValidation?: boolean;
  useSonnerToasts?: boolean;
  autoSave?: boolean;
  onWireframeGenerated?: (result: WireframeGenerationResult) => void;
  onError?: (error: Error) => void;
  enhancedCreativity?: boolean;
}

export function useWireframe(options: UseWireframeOptions = {}) {
  // Default options
  const {
    projectId = uuidv4(),
    enhancedValidation = false,
    useSonnerToasts = false,
    autoSave = false,
    onWireframeGenerated,
    onError,
    enhancedCreativity = false,
  } = options;

  // State management
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeData | null>(null);
  const [generationResults, setGenerationResults] = useState<WireframeGenerationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [intentData, setIntentData] = useState<any>(null);
  const [blueprint, setBlueprint] = useState<any>(null);

  // Clear any errors when options change
  useEffect(() => {
    setError(null);
  }, [projectId]);

  // Reset all state
  const reset = useCallback(() => {
    setIsGenerating(false);
    setCurrentWireframe(null);
    setGenerationResults(null);
    setError(null);
    setIntentData(null);
    setBlueprint(null);
  }, []);

  // Show toast message if enabled
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (useSonnerToasts) {
      if (type === 'success') {
        toast.success("Success", { description: message });
      } else {
        toast.error("Error", { description: message });
      }
    }
  }, [useSonnerToasts]);

  // Handle errors consistently
  const handleError = useCallback((err: unknown) => {
    const parsedError = parseError(err);
    const errorObject = new Error(parsedError.message);
    
    // Copy over any additional properties from the parsed error
    if (parsedError.details) {
      (errorObject as any).details = parsedError.details;
    }
    if (parsedError.originalError) {
      (errorObject as any).originalError = parsedError.originalError;
    }
    
    setError(errorObject);
    
    if (onError) {
      onError(errorObject);
    }
    
    showToast(parsedError.message, 'error');
    return errorObject;
  }, [onError, showToast]);

  // Generate a wireframe
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams | string
  ): Promise<WireframeGenerationResult> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Handle string input (convert to params object)
      let generationParams: WireframeGenerationParams;
      
      if (typeof params === 'string') {
        generationParams = {
          description: params,
          projectId: projectId,
          enhancedCreativity
        };
      } else {
        // Use provided params, ensuring projectId
        generationParams = {
          ...params,
          projectId: params.projectId || projectId,
          enhancedCreativity: params.enhancedCreativity || enhancedCreativity
        };
      }

      // This would be where we call the actual wireframe generation service
      // For now, simulate the generation with a mock result
      console.log('Generating wireframe with params:', generationParams);
      
      // Mock wireframe generation result
      const result: WireframeGenerationResult = {
        wireframe: {
          id: uuidv4(),
          title: `Wireframe for ${generationParams.description?.substring(0, 30) || 'Unnamed project'}`,
          description: generationParams.description || '',
          sections: [],
          colorScheme: {
            primary: '#3182ce',
            secondary: '#805ad5',
            accent: '#ed8936',
            background: '#ffffff',
            text: '#1a202c'
          },
          typography: {
            headings: 'Inter',
            body: 'Inter'
          }
        },
        success: true,
        message: 'Wireframe generated successfully',
        // Store the intent analysis and blueprint data in the result object
        // These are now properly typed through the WireframeGenerationResult interface
        intentData: { primary: 'landing-page', confidence: 0.9 },
        blueprint: { layout: 'standard', sections: ['hero', 'features', 'testimonials'] }
      };

      setCurrentWireframe(result.wireframe);
      setGenerationResults(result);
      
      if (result.intentData) {
        setIntentData(result.intentData);
      }
      
      if (result.blueprint) {
        setBlueprint(result.blueprint);
      }

      if (onWireframeGenerated) {
        onWireframeGenerated(result);
      }

      showToast('Wireframe generated successfully');
      return result;
    } catch (err) {
      const errorObj = handleError(err);
      return {
        wireframe: null,
        success: false,
        message: errorObj.message,
        errors: [errorObj.message]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [projectId, enhancedCreativity, handleError, showToast, onWireframeGenerated]);

  // Save the current wireframe
  const saveWireframe = useCallback(async (comment?: string) => {
    if (!currentWireframe) {
      showToast('No wireframe to save', 'error');
      return null;
    }

    try {
      // This would be where we call the actual save service
      console.log('Saving wireframe:', currentWireframe, 'with comment:', comment);
      
      showToast('Wireframe saved successfully');
      return currentWireframe;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [currentWireframe, showToast, handleError]);

  // Apply feedback to the current wireframe
  const applyFeedback = useCallback(async (feedback: string) => {
    if (!currentWireframe) {
      showToast('No wireframe to update', 'error');
      return null;
    }

    setIsGenerating(true);

    try {
      // This would be where we call the actual feedback service
      console.log('Applying feedback to wireframe:', feedback);
      
      // Mock updated wireframe
      const updatedWireframe = {
        ...currentWireframe,
        lastUpdated: new Date().toISOString()
      };

      setCurrentWireframe(updatedWireframe);
      showToast('Feedback applied successfully');
      return updatedWireframe;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [currentWireframe, showToast, handleError]);

  return {
    isGenerating,
    currentWireframe,
    generationResults,
    intentData,
    blueprint,
    error,
    generateWireframe,
    saveWireframe,
    applyFeedback,
    reset
  };
}
