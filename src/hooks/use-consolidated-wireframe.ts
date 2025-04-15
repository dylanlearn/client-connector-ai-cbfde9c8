
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeData
} from '@/services/ai/wireframe/wireframe-types';
import { wireframeService } from '@/services/ai/wireframe/consolidated-wireframe-service';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { v4 as uuidv4 } from 'uuid';

export interface UseConsolidatedWireframeOptions {
  projectId?: string;
  initialData?: WireframeData | null;
  autoSave?: boolean;
  showToasts?: boolean;
  enhancedValidation?: boolean;
  onWireframeGenerated?: (result: WireframeGenerationResult) => void;
  onError?: (error: Error) => void;
}

/**
 * Consolidated wireframe hook - single hook for all wireframe operations
 */
export function useConsolidatedWireframe({
  projectId = uuidv4(),
  initialData = null,
  autoSave = false,
  showToasts = true,
  enhancedValidation = false,
  onWireframeGenerated,
  onError
}: UseConsolidatedWireframeOptions = {}) {
  // State
  const [wireframe, setWireframe] = useState<WireframeData | null>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generationResult, setGenerationResult] = useState<WireframeGenerationResult | null>(null);
  const [creativityLevel, setCreativityLevel] = useState<number>(8);
  
  // Error handling
  const errorHandler = useErrorHandler({
    componentName: 'ConsolidatedWireframe',
    onError,
    showToast: showToasts
  });

  // Notification helper
  const notify = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (showToasts) {
      if (type === 'success') toast.success(message);
      else if (type === 'error') toast.error(message);
      else toast.info(message);
    }
  }, [showToasts]);

  /**
   * Generate a wireframe
   */
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams | string
  ): Promise<WireframeGenerationResult> => {
    errorHandler.clearError();
    setIsGenerating(true);
    
    try {
      // Convert string to params object if needed
      const generationParams = typeof params === 'string' 
        ? { description: params, projectId, creativityLevel } 
        : { ...params, projectId: params.projectId || projectId };
      
      const result = await wireframeService.generateWireframe(generationParams);
      
      if (result.success && result.wireframe) {
        setWireframe(result.wireframe);
        setGenerationResult(result);
        notify('Wireframe generated successfully');
        
        if (onWireframeGenerated) {
          onWireframeGenerated(result);
        }
        
        // Auto-save if enabled
        if (autoSave && result.wireframe) {
          saveWireframe(result.wireframe);
        }
      } else {
        throw new Error(result.message || 'Failed to generate wireframe');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errorHandler.handleError(error, 'Error generating wireframe');
      notify(errorMessage, 'error');
      
      return {
        wireframe: null,
        success: false,
        message: errorMessage
      };
    } finally {
      setIsGenerating(false);
    }
  }, [projectId, creativityLevel, notify, onWireframeGenerated, errorHandler, autoSave]);

  /**
   * Generate a variation of the current wireframe
   */
  const generateVariation = useCallback(async (
    styleChanges: string,
    enhancedCreativity: boolean = false
  ): Promise<WireframeGenerationResult> => {
    if (!wireframe) {
      notify('No wireframe to create variation from', 'error');
      return { wireframe: null, success: false, message: 'No wireframe available' };
    }
    
    errorHandler.clearError();
    setIsGenerating(true);
    
    try {
      const result = await wireframeService.generateVariation(
        wireframe, 
        styleChanges,
        enhancedCreativity
      );
      
      if (result.success && result.wireframe) {
        setWireframe(result.wireframe);
        setGenerationResult(result);
        notify('Wireframe variation generated successfully');
        
        if (onWireframeGenerated) {
          onWireframeGenerated(result);
        }
      } else {
        throw new Error(result.message || 'Failed to generate variation');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errorHandler.handleError(error, 'Error generating wireframe variation');
      notify(errorMessage, 'error');
      
      return {
        wireframe: null,
        success: false,
        message: errorMessage
      };
    } finally {
      setIsGenerating(false);
    }
  }, [wireframe, notify, errorHandler, onWireframeGenerated]);

  /**
   * Save current wireframe
   */
  const saveWireframe = useCallback(async (wireframeToSave?: WireframeData): Promise<WireframeData | null> => {
    const dataToSave = wireframeToSave || wireframe;
    if (!dataToSave) {
      notify('No wireframe to save', 'error');
      return null;
    }
    
    setIsSaving(true);
    
    try {
      const savedWireframe = await wireframeService.saveWireframe(dataToSave);
      setWireframe(savedWireframe);
      notify('Wireframe saved successfully');
      return savedWireframe;
    } catch (error) {
      errorHandler.handleError(error, 'Error saving wireframe');
      notify('Failed to save wireframe', 'error');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [wireframe, errorHandler, notify]);

  /**
   * Export current wireframe to specified format
   */
  const exportWireframe = useCallback(async (format: string): Promise<{ url: string } | null> => {
    if (!wireframe) {
      notify('No wireframe to export', 'error');
      return null;
    }
    
    setIsExporting(true);
    
    try {
      const result = await wireframeService.exportWireframe(wireframe, format);
      if (result) {
        notify(`Wireframe exported as ${format}`);
      }
      return result;
    } catch (error) {
      errorHandler.handleError(error, 'Error exporting wireframe');
      notify('Failed to export wireframe', 'error');
      return null;
    } finally {
      setIsExporting(false);
    }
  }, [wireframe, errorHandler, notify]);

  /**
   * Reset wireframe state
   */
  const reset = useCallback(() => {
    setWireframe(null);
    setGenerationResult(null);
    errorHandler.clearError();
  }, [errorHandler]);

  /**
   * Update wireframe with new data
   */
  const updateWireframe = useCallback((newWireframe: WireframeData | null) => {
    setWireframe(newWireframe);
    
    if (autoSave && newWireframe) {
      saveWireframe(newWireframe);
    }
  }, [autoSave, saveWireframe]);

  return {
    // State
    wireframe,
    isGenerating,
    isSaving,
    isExporting,
    error: errorHandler.error,
    generationResult,
    creativityLevel,
    
    // Actions
    generateWireframe,
    generateVariation,
    saveWireframe,
    exportWireframe,
    updateWireframe,
    setCreativityLevel,
    reset,
    
    // Reference to underlying service for advanced usage
    wireframeService
  };
}

export default useConsolidatedWireframe;
