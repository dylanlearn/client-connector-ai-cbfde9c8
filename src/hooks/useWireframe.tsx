
import { useState, useCallback, useReducer } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeData, 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  isWireframeData
} from '@/services/ai/wireframe/wireframe-types';
import { parseError } from '@/utils/error-handling';

// Define state types for better predictability
type Status = 'idle' | 'generating' | 'saving' | 'error';

interface WireframeState {
  status: Status;
  wireframe: WireframeData | null;
  generationResult: WireframeGenerationResult | null;
  error: Error | null;
}

type WireframeAction = 
  | { type: 'START_GENERATION' }
  | { type: 'START_SAVING' }
  | { type: 'GENERATION_SUCCESS', payload: WireframeGenerationResult }
  | { type: 'SAVE_SUCCESS', payload: WireframeData }
  | { type: 'ERROR', payload: Error }
  | { type: 'RESET' };

// Simplified options interface
export interface UseWireframeOptions {
  projectId?: string;
  autoSave?: boolean;
  toastNotifications?: boolean;
  useSonnerToasts?: boolean;
  validationLevel?: 'basic' | 'standard' | 'advanced';
  enhancedValidation?: boolean;
  onWireframeGenerated?: (result: WireframeGenerationResult) => void;
}

// Create reducer for more predictable state management
function wireframeReducer(state: WireframeState, action: WireframeAction): WireframeState {
  switch (action.type) {
    case 'START_GENERATION':
      return { ...state, status: 'generating', error: null };
    
    case 'START_SAVING':
      return { ...state, status: 'saving', error: null };
    
    case 'GENERATION_SUCCESS':
      return { 
        ...state, 
        status: 'idle', 
        wireframe: action.payload.wireframe, 
        generationResult: action.payload,
        error: null 
      };
    
    case 'SAVE_SUCCESS':
      return { 
        ...state, 
        status: 'idle', 
        wireframe: action.payload, 
        error: null 
      };
    
    case 'ERROR':
      return { 
        ...state, 
        status: 'error', 
        error: action.payload 
      };
    
    case 'RESET':
      return { 
        status: 'idle', 
        wireframe: null, 
        generationResult: null, 
        error: null 
      };
    
    default:
      return state;
  }
}

// Main hook
export function useWireframe(options: UseWireframeOptions = {}) {
  const {
    projectId = uuidv4(),
    autoSave = false,
    toastNotifications = true,
    validationLevel = 'standard',
    enhancedValidation = false,
    onWireframeGenerated
  } = options;

  // Use reducer for state management
  const [state, dispatch] = useReducer(wireframeReducer, {
    status: 'idle',
    wireframe: null,
    generationResult: null,
    error: null
  });

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (toastNotifications) {
      type === 'success' 
        ? toast.success(message) 
        : toast.error(message);
    }
  }, [toastNotifications]);

  // Generate wireframe from description or parameters
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams | string
  ): Promise<WireframeGenerationResult> => {
    dispatch({ type: 'START_GENERATION' });
    
    try {
      // Normalize parameters
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

      dispatch({ type: 'GENERATION_SUCCESS', payload: result });
      showNotification(result.message);
      
      // Call the callback if provided
      if (onWireframeGenerated && result.success) {
        onWireframeGenerated(result);
      }

      // Auto-save if enabled
      if (autoSave && result.wireframe) {
        await saveWireframe();
      }

      return result;
    } catch (err) {
      const parsedError = parseError(err);
      const errorObj = new Error(parsedError.message);
      
      dispatch({ type: 'ERROR', payload: errorObj });
      showNotification(parsedError.message, 'error');
      
      return {
        wireframe: null,
        success: false,
        message: parsedError.message,
        errors: [parsedError.message]
      };
    }
  }, [projectId, validationLevel, showNotification, onWireframeGenerated, autoSave]);

  // Save wireframe
  const saveWireframe = useCallback(async (): Promise<WireframeData | null> => {
    if (!state.wireframe) {
      showNotification('No wireframe to save', 'error');
      return null;
    }

    dispatch({ type: 'START_SAVING' });
    
    try {
      // Simulate saving
      const savedWireframe = {
        ...state.wireframe,
        lastUpdated: new Date().toISOString()
      };
      
      dispatch({ type: 'SAVE_SUCCESS', payload: savedWireframe });
      showNotification('Wireframe saved successfully');
      
      return savedWireframe;
    } catch (err) {
      const parsedError = parseError(err);
      const errorObj = new Error(parsedError.message);
      
      dispatch({ type: 'ERROR', payload: errorObj });
      showNotification(parsedError.message, 'error');
      
      return null;
    }
  }, [state.wireframe, showNotification]);

  // Reset state
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Return a more focused, cleaner API
  return {
    // State
    isGenerating: state.status === 'generating',
    isSaving: state.status === 'saving',
    isIdle: state.status === 'idle',
    hasError: state.status === 'error',
    currentWireframe: state.wireframe,
    generationResult: state.generationResult,
    error: state.error,
    
    // Actions
    generateWireframe,
    saveWireframe,
    reset
  };
}
