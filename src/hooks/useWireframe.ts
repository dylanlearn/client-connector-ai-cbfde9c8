
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  WireframeData, 
  WireframeGenerationParams, 
  WireframeGenerationResult 
} from '@/services/ai/wireframe/wireframe-types';
import { unifiedWireframeService } from '@/services/ai/wireframe/unified-wireframe-service';
import { ErrorHandler } from '@/utils/error-handling/error-handler';

export interface UseWireframeOptions {
  projectId?: string;
  initialData?: WireframeData | null;
  viewMode?: 'edit' | 'preview' | 'code';
  autoSave?: boolean;
  showToasts?: boolean;
  componentName?: string;
  // Legacy options for backward compatibility
  toastNotifications?: boolean;
  enhancedValidation?: boolean;
}

export function useWireframe({
  projectId,
  initialData = null,
  viewMode: initialViewMode = 'edit',
  autoSave = false,
  showToasts = true,
  componentName = 'WireframeComponent',
  // Handle legacy options
  toastNotifications,
  enhancedValidation
}: UseWireframeOptions = {}) {
  // Use toastNotifications as fallback if provided (for backward compatibility)
  const shouldShowToasts = toastNotifications !== undefined ? toastNotifications : showToasts;
  
  // State declarations
  const [wireframe, setWireframe] = useState<WireframeData | null>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  const errorHandler = ErrorHandler.createHandler(componentName, {
    showToast: shouldShowToasts,
    userId: undefined // Could be set from auth context if available
  });
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setShowSidebar(prev => !prev);
  }, []);
  
  // Select element
  const selectElement = useCallback((id: string | null) => {
    setSelectedElement(id);
  }, []);
  
  // Update wireframe
  const updateWireframe = useCallback((data: WireframeData | null) => {
    setWireframe(data);
    
    if (data && autoSave) {
      // We'll trigger auto-save here if enabled
      unifiedWireframeService.saveWireframe(data).catch(err => {
        errorHandler.handleError(err, 'auto-saving wireframe', { showToast: false });
      });
    }
  }, [autoSave, errorHandler]);
  
  // Generate wireframe
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const normalizedParams = typeof params === 'string' 
        ? { description: params, projectId } as WireframeGenerationParams
        : { ...params, projectId: params.projectId || projectId };
      
      const result = await unifiedWireframeService.generateWireframe(normalizedParams);
      
      if (result.success && result.wireframe) {
        setWireframe(result.wireframe);
        if (shouldShowToasts) {
          toast.success('Wireframe generated successfully');
        }
      } else {
        throw new Error(result.message || 'Failed to generate wireframe');
      }
      
      return result;
    } catch (err) {
      const handledError = errorHandler.handleError(err, 'generating wireframe');
      setError(handledError);
      return {
        wireframe: null,
        success: false,
        message: handledError.message,
        errors: [handledError.message]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [projectId, shouldShowToasts, errorHandler]);
  
  // Save wireframe
  const saveWireframe = useCallback(async (): Promise<WireframeData | null> => {
    if (!wireframe) return null;
    
    setIsSaving(true);
    try {
      const saved = await unifiedWireframeService.saveWireframe(wireframe);
      return saved;
    } catch (err) {
      const handledError = errorHandler.handleError(err, 'saving wireframe');
      setError(handledError);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [wireframe, errorHandler]);
  
  // Export wireframe
  const exportWireframe = useCallback(async (format: string): Promise<boolean> => {
    if (!wireframe) return false;
    
    try {
      return await unifiedWireframeService.exportWireframe(wireframe, format);
    } catch (err) {
      const handledError = errorHandler.handleError(err, 'exporting wireframe');
      setError(handledError);
      return false;
    }
  }, [wireframe, errorHandler]);
  
  // For backward compatibility with old hook APIs
  const reset = useCallback(() => {
    setWireframe(null);
    clearError();
  }, [clearError]);
  
  // Return new API and backward compatibility properties
  return {
    // New API
    wireframe,
    error,
    isGenerating,
    isSaving,
    viewMode,
    showSidebar,
    selectedElement,
    updateWireframe,
    generateWireframe,
    saveWireframe,
    exportWireframe,
    setViewMode,
    toggleSidebar,
    selectElement,
    clearError,
    
    // Backward compatibility properties (so old code doesn't break)
    currentWireframe: wireframe,
    generationResult: wireframe ? { 
      wireframe,
      success: true,
      message: 'Wireframe available',
      intentData: null,
      blueprint: null
    } : null,
    reset
  };
}
