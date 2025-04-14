
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeData, 
  WireframeGenerationParams, 
  WireframeGenerationResult 
} from '@/services/ai/wireframe/wireframe-types';
import { parseError } from '@/utils/error-handling';

export interface UseWireframeOptions {
  projectId?: string;
  autoSave?: boolean;
  toastNotifications?: boolean;
  validationLevel?: 'basic' | 'standard' | 'advanced';
}

export function useWireframe(options: UseWireframeOptions = {}) {
  const {
    projectId = uuidv4(),
    autoSave = false,
    toastNotifications = true,
    validationLevel = 'standard'
  } = options;

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeData | null>(null);
  const [generationResult, setGenerationResult] = useState<WireframeGenerationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (toastNotifications) {
      type === 'success' 
        ? toast.success(message) 
        : toast.error(message);
    }
  }, [toastNotifications]);

  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams | string
  ): Promise<WireframeGenerationResult> => {
    setIsGenerating(true);
    setError(null);

    try {
      const generationParams: WireframeGenerationParams = typeof params === 'string'
        ? { 
            description: params, 
            projectId, 
            validationLevel 
          }
        : { 
            ...params, 
            projectId: params.projectId || projectId,
            validationLevel: params.validationLevel || validationLevel
          };

      // Simulated generation logic
      const result: WireframeGenerationResult = {
        wireframe: {
          id: uuidv4(),
          title: `Wireframe: ${generationParams.description}`,
          description: generationParams.description,
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
        intentData: { 
          primary: 'landing-page', 
          confidence: 0.9 
        },
        blueprint: { 
          layout: 'standard', 
          sections: ['hero', 'features', 'testimonials'] 
        }
      };

      setCurrentWireframe(result.wireframe);
      setGenerationResult(result);
      showNotification(result.message);

      return result;
    } catch (err) {
      const parsedError = parseError(err);
      const errorObj = new Error(parsedError.message);
      
      setError(errorObj);
      showNotification(parsedError.message, 'error');
      
      return {
        wireframe: null,
        success: false,
        message: parsedError.message,
        errors: [parsedError.message]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [projectId, validationLevel, showNotification]);

  const saveWireframe = useCallback(async () => {
    if (!currentWireframe) {
      showNotification('No wireframe to save', 'error');
      return null;
    }

    try {
      // Simulated save logic
      showNotification('Wireframe saved successfully');
      return currentWireframe;
    } catch (err) {
      const parsedError = parseError(err);
      showNotification(parsedError.message, 'error');
      return null;
    }
  }, [currentWireframe, showNotification]);

  const reset = useCallback(() => {
    setCurrentWireframe(null);
    setGenerationResult(null);
    setError(null);
  }, []);

  return {
    isGenerating,
    currentWireframe,
    generationResult,
    error,
    generateWireframe,
    saveWireframe,
    reset
  };
}
