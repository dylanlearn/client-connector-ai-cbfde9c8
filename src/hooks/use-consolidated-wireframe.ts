
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  WireframeData, 
  WireframeGenerationParams,
  WireframeGenerationResult 
} from '@/services/ai/wireframe/wireframe-types';
import { useErrorHandler } from '@/hooks/use-error-handler';

export interface UseConsolidatedWireframeOptions {
  projectId?: string;
  initialData?: WireframeData | null;
  autoSave?: boolean;
  showToasts?: boolean;
  componentName?: string;
  onError?: (error: Error) => void;
  onWireframeGenerated?: (result: WireframeGenerationResult) => void;
}

export function useConsolidatedWireframe(options: UseConsolidatedWireframeOptions = {}) {
  const { 
    projectId, 
    initialData = null, 
    autoSave = false,
    showToasts = true,
    componentName = 'WireframeStudio',
    onError,
    onWireframeGenerated
  } = options;
  
  // State
  const [wireframe, setWireframe] = useState<WireframeData | null>(initialData);
  const [isGenerating, setGenerating] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  
  // Use our error handler hook
  const errorHandler = useErrorHandler({ 
    componentName, 
    showToast: showToasts 
  });
  
  // Show notifications
  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (showToasts) {
      type === 'success' ? toast.success(message) : toast.error(message);
    }
  }, [showToasts]);
  
  // Update wireframe
  const updateWireframe = useCallback((newWireframe: WireframeData | null) => {
    setWireframe(newWireframe);
    if (newWireframe && autoSave) {
      // Auto-save functionality could be implemented here
    }
  }, [autoSave]);
  
  // Save wireframe
  const saveWireframe = useCallback(async (): Promise<WireframeData | null> => {
    if (!wireframe) return null;
    
    setSaving(true);
    try {
      // Mock implementation - in a real app, this would save to a database
      await new Promise(resolve => setTimeout(resolve, 500));
      showNotification('Wireframe saved successfully');
      return wireframe;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to save wireframe');
      onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    } finally {
      setSaving(false);
    }
  }, [wireframe, showNotification, errorHandler, onError]);
  
  // Export wireframe
  const exportWireframe = useCallback(async (format: string): Promise<boolean> => {
    if (!wireframe) return false;
    
    try {
      // Mock implementation - in a real app, this would handle different export formats
      showNotification(`Wireframe exported as ${format}`);
      return true;
    } catch (error) {
      errorHandler.handleError(error, `Failed to export wireframe as ${format}`);
      onError?.(error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }, [wireframe, showNotification, errorHandler, onError]);
  
  // Generate wireframe - add this function to fix WireframeControls errors
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    setGenerating(true);
    
    try {
      // Mock implementation for wireframe generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a simple wireframe based on params
      const newWireframe: WireframeData = {
        id: params.projectId || 'new-wireframe',
        title: params.description?.substring(0, 30) || 'New Wireframe',
        description: params.description || '',
        sections: [],
        colorScheme: params.colorScheme || {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#f59e0b',
          background: '#ffffff',
          text: '#111827'
        },
        typography: params.typography || {
          headings: 'Inter',
          body: 'Inter'
        }
      };
      
      // Update state
      setWireframe(newWireframe);
      
      // Create result
      const result: WireframeGenerationResult = {
        wireframe: newWireframe,
        success: true,
        message: 'Wireframe generated successfully'
      };
      
      // Call the callback if provided
      if (onWireframeGenerated) {
        onWireframeGenerated(result);
      }
      
      showNotification('Wireframe generated successfully');
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errorHandler.handleError(error, 'Failed to generate wireframe');
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      
      return {
        wireframe: null,
        success: false,
        message: errorMessage
      };
    } finally {
      setGenerating(false);
    }
  }, [errorHandler, setWireframe, showNotification, onWireframeGenerated, onError]);
  
  return {
    wireframe,
    isGenerating,
    isSaving,
    error: errorHandler.error,
    updateWireframe,
    saveWireframe,
    exportWireframe,
    generateWireframe
  };
}
