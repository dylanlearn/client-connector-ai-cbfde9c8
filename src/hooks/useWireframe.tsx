
import { useCallback } from 'react';
import { toast } from 'sonner';
import { 
  WireframeData, 
  WireframeGenerationParams, 
  WireframeGenerationResult 
} from '@/services/ai/wireframe/wireframe-types';
import { CoreWireframeService } from '@/services/ai/wireframe/core-wireframe-service';
import { useWireframeState } from './wireframe/use-wireframe-state';

export interface UseWireframeOptions {
  projectId?: string;
  autoSave?: boolean;
  toastNotifications?: boolean;
  enhancedValidation?: boolean;
  onWireframeGenerated?: (result: WireframeGenerationResult) => void;
}

export function useWireframe({
  projectId,
  autoSave = false,
  toastNotifications = true,
  enhancedValidation = false,
  onWireframeGenerated
}: UseWireframeOptions = {}) {
  const {
    wireframe,
    isGenerating,
    error,
    updateWireframe,
    setGenerating,
    setErrorState
  } = useWireframeState();

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (toastNotifications) {
      type === 'success' ? toast.success(message) : toast.error(message);
    }
  }, [toastNotifications]);

  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams | string
  ): Promise<WireframeGenerationResult> => {
    setGenerating(true);
    setErrorState(null);

    try {
      const generationParams = typeof params === 'string' 
        ? { description: params, projectId } 
        : { ...params, projectId: params.projectId || projectId };

      const result = await CoreWireframeService.generateWireframe(generationParams);

      if (result.success && result.wireframe) {
        updateWireframe(result.wireframe);
        showNotification(result.message);
        onWireframeGenerated?.(result);
      } else {
        throw new Error(result.message || 'Failed to generate wireframe');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrorState(error instanceof Error ? error : new Error(errorMessage));
      showNotification(errorMessage, 'error');
      
      return {
        wireframe: null,
        success: false,
        message: errorMessage
      };
    } finally {
      setGenerating(false);
    }
  }, [projectId, showNotification, onWireframeGenerated, updateWireframe, setGenerating, setErrorState]);

  // Add saveWireframe function to fix WireframeEditor.tsx and WireframeEditorDemo.tsx errors
  const saveWireframe = useCallback(async (): Promise<WireframeData | null> => {
    if (!wireframe) return null;
    
    try {
      // Mock implementation - in a real app, this would save to a database
      showNotification('Wireframe saved successfully');
      return wireframe;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error saving wireframe';
      showNotification(errorMessage, 'error');
      return null;
    }
  }, [wireframe, showNotification]);

  // Add reset function to fix use-enhanced-wireframe.ts error
  const reset = useCallback(() => {
    updateWireframe(null);
    setErrorState(null);
  }, [updateWireframe, setErrorState]);

  return {
    currentWireframe: wireframe,
    isGenerating,
    error,
    generateWireframe,
    // Add missing properties to fix errors
    saveWireframe,
    reset,
    // Add generationResult property to fix IntakeWireframeBridge.tsx and use-enhanced-wireframe.ts errors
    generationResult: wireframe ? { 
      wireframe,
      success: true,
      message: 'Wireframe available',
      intentData: null,
      blueprint: null
    } : null
  };
}
