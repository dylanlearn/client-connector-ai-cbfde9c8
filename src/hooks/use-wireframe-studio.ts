
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  WireframeData, 
  WireframeGenerationParams,
  WireframeGenerationResult 
} from '@/services/ai/wireframe/wireframe-types';
import { wireframeService } from '@/services/ai/wireframe/wireframe-service';
import { useErrorHandler } from '@/hooks/use-error-handler';

export interface UseWireframeStudioOptions {
  projectId?: string;
  initialData?: WireframeData | null;
  autoSave?: boolean;
  showToasts?: boolean;
  componentName?: string;
  onError?: (error: Error) => void;
  onWireframeGenerated?: (result: WireframeGenerationResult) => void;
  creativityLevel?: number;
  viewMode?: 'edit' | 'preview' | 'code';
}

/**
 * Unified wireframe hook that combines all wireframe functionality
 */
export function useWireframeStudio(options: UseWireframeStudioOptions = {}) {
  const { 
    projectId, 
    initialData = null, 
    autoSave = false,
    showToasts = true,
    componentName = 'WireframeStudio',
    onError,
    onWireframeGenerated,
    creativityLevel: initialCreativityLevel = 8,
    viewMode: initialViewMode = 'edit'
  } = options;
  
  // State management
  const [wireframe, setWireframe] = useState<WireframeData | null>(initialData);
  const [isGenerating, setGenerating] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [creativityLevel, setCreativityLevel] = useState(initialCreativityLevel);
  
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
      // Auto-save functionality
      wireframeService.saveWireframe(newWireframe)
        .then(() => {
          if (showToasts) {
            toast.success('Wireframe auto-saved');
          }
        })
        .catch(error => {
          errorHandler.handleError(error, 'Failed to auto-save wireframe');
        });
    }
  }, [autoSave, errorHandler, showToasts]);
  
  // Generate wireframe
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    setGenerating(true);
    
    try {
      // Add project ID if not provided
      const enhancedParams = {
        ...params,
        projectId: params.projectId || projectId,
        creativityLevel: params.creativityLevel || creativityLevel
      };
      
      // Call the service
      const result = await wireframeService.generateWireframe(enhancedParams);
      
      if (result.success && result.wireframe) {
        setWireframe(result.wireframe);
        showNotification('Wireframe generated successfully');
        
        if (onWireframeGenerated) {
          onWireframeGenerated(result);
        }
      } else {
        throw new Error(result.message || 'Failed to generate wireframe');
      }
      
      return result;
    } catch (error) {
      const handledError = errorHandler.handleError(error, 'generating wireframe');
      if (onError) {
        onError(handledError);
      }
      
      return {
        wireframe: null,
        success: false,
        message: handledError.message
      };
    } finally {
      setGenerating(false);
    }
  }, [projectId, creativityLevel, showNotification, errorHandler, onError, onWireframeGenerated]);
  
  // Generate variation
  const generateVariation = useCallback(async (
    baseWireframe: WireframeData,
    styleChanges: string
  ): Promise<WireframeGenerationResult> => {
    setGenerating(true);
    
    try {
      const result = await wireframeService.generateWireframeVariation(
        baseWireframe, 
        styleChanges, 
        creativityLevel > 7
      );
      
      if (result.success && result.wireframe) {
        setWireframe(result.wireframe);
        showNotification('Wireframe variation generated successfully');
        
        if (onWireframeGenerated) {
          onWireframeGenerated(result);
        }
      } else {
        throw new Error(result.message || 'Failed to generate wireframe variation');
      }
      
      return result;
    } catch (error) {
      const handledError = errorHandler.handleError(error, 'generating wireframe variation');
      if (onError) {
        onError(handledError);
      }
      
      return {
        wireframe: null,
        success: false,
        message: handledError.message
      };
    } finally {
      setGenerating(false);
    }
  }, [creativityLevel, showNotification, errorHandler, onError, onWireframeGenerated]);
  
  // Save wireframe
  const saveWireframe = useCallback(async (): Promise<WireframeData | null> => {
    if (!wireframe) return null;
    
    setSaving(true);
    try {
      const savedWireframe = await wireframeService.saveWireframe(wireframe);
      showNotification('Wireframe saved successfully');
      
      // Update with the saved version
      setWireframe(savedWireframe);
      
      return savedWireframe;
    } catch (error) {
      const handledError = errorHandler.handleError(error, 'Failed to save wireframe');
      if (onError) {
        onError(handledError);
      }
      return null;
    } finally {
      setSaving(false);
    }
  }, [wireframe, showNotification, errorHandler, onError]);
  
  // Export wireframe
  const exportWireframe = useCallback(async (format: string): Promise<boolean> => {
    if (!wireframe) return false;
    
    try {
      const result = await wireframeService.exportWireframe(wireframe, format);
      if (result) {
        showNotification(`Wireframe exported as ${format} successfully`);
      } else {
        throw new Error(`Failed to export as ${format}`);
      }
      return result;
    } catch (error) {
      const handledError = errorHandler.handleError(error, `Failed to export wireframe as ${format}`);
      if (onError) {
        onError(handledError);
      }
      return false;
    }
  }, [wireframe, showNotification, errorHandler, onError]);
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setShowSidebar(prev => !prev);
  }, []);
  
  // Handle section selection
  const selectElement = useCallback((elementId: string | null) => {
    setSelectedElement(elementId);
  }, []);

  return {
    // State
    wireframe,
    isGenerating,
    isSaving,
    error: errorHandler.error,
    viewMode,
    showSidebar,
    selectedElement,
    creativityLevel,
    
    // Actions
    updateWireframe,
    generateWireframe,
    generateVariation,
    saveWireframe,
    exportWireframe,
    setViewMode,
    toggleSidebar,
    selectElement,
    setCreativityLevel,
    
    // Utilities
    clearError: errorHandler.clearError
  };
}
