
import { useWireframe } from '@/hooks/useWireframe';
import { WireframeGenerationParams, WireframeGenerationResult } from '@/services/ai/wireframe/wireframe-types';

/**
 * @deprecated Use useWireframe instead
 */
export function useAdvancedWireframe() {
  const {
    isGenerating,
    wireframe,
    currentWireframe, // Already mapped in useWireframe
    generationResult, // Already mapped in useWireframe
    error,
    generateWireframe,
    saveWireframe,
    reset,
    clearError
  } = useWireframe({
    showToasts: false,
    toastNotifications: false,
    enhancedValidation: true
  });
  
  // Create additional properties for backward compatibility
  const intentData = generationResult?.intentData || null;
  const blueprint = generationResult?.blueprint || null;
  
  return {
    isGenerating,
    currentWireframe: wireframe || currentWireframe,
    generationResults: generationResult,
    intentData,
    blueprint,
    generateWireframe,
    saveWireframe,
    applyFeedback: async (feedback: string) => wireframe || currentWireframe, // Mock function for backward compatibility
    error,
    reset: reset || clearError
  };
}
