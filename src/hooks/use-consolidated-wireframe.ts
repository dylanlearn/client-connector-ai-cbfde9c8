
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
}

export function useConsolidatedWireframe(options: UseConsolidatedWireframeOptions = {}) {
  const { 
    projectId, 
    initialData = null, 
    autoSave = false,
    showToasts = true,
    componentName = 'WireframeStudio'
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
      return null;
    } finally {
      setSaving(false);
    }
  }, [wireframe, showNotification, errorHandler]);
  
  // Export wireframe
  const exportWireframe = useCallback(async (format: string): Promise<boolean> => {
    if (!wireframe) return false;
    
    try {
      // Mock implementation - in a real app, this would handle different export formats
      showNotification(`Wireframe exported as ${format}`);
      return true;
    } catch (error) {
      errorHandler.handleError(error, `Failed to export wireframe as ${format}`);
      return false;
    }
  }, [wireframe, showNotification, errorHandler]);
  
  return {
    wireframe,
    isGenerating,
    isSaving,
    error: errorHandler.error,
    updateWireframe,
    saveWireframe,
    exportWireframe
  };
}
