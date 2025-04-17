
import { useState, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useErrorHandler } from './use-error-handler';

export interface UseWireframeStudioOptions {
  projectId?: string;
  initialData?: WireframeData | null;
  viewMode?: 'edit' | 'preview' | 'code';  // Added this property
  autoSave?: boolean;
  showToasts?: boolean;
  componentName?: string;
}

export function useWireframeStudio(options: UseWireframeStudioOptions = {}) {
  const {
    projectId,
    initialData = null,
    viewMode: initialViewMode = 'edit',
    autoSave = false,
    showToasts = true,
    componentName = 'WireframeStudio'
  } = options;

  const errorHandler = useErrorHandler({ componentName });
  
  // State declarations
  const [wireframe, setWireframe] = useState<WireframeData | null>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // Clear error handler
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
  }, []);
  
  // Generate wireframe (simplified mock)
  const generateWireframe = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Mock implementation
      console.log('Generating wireframe with prompt:', prompt);
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return { success: false, error };
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  // Save wireframe (simplified mock)
  const saveWireframe = useCallback(async () => {
    if (!wireframe) return null;
    
    setIsSaving(true);
    try {
      // Mock implementation
      console.log('Saving wireframe:', wireframe);
      return wireframe;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [wireframe]);
  
  // Export wireframe (simplified mock)
  const exportWireframe = useCallback(async (format: string) => {
    if (!wireframe) return false;
    
    try {
      // Mock implementation
      console.log(`Exporting wireframe as ${format}:`, wireframe);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return false;
    }
  }, [wireframe]);
  
  return {
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
    clearError
  };
}
