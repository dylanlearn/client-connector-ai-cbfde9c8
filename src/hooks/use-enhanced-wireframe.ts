
import { useWireframe } from '@/hooks/useWireframe';
import { WireframeGenerationParams, WireframeGenerationResult } from '@/services/ai/wireframe/wireframe-types';

/**
 * @deprecated Use useWireframe instead
 */
export function useAdvancedWireframe() {
  const {
    isGenerating,
    currentWireframe,
    generationResult,
    error,
    generateWireframe,
    saveWireframe,
    reset
  } = useWireframe({
    toastNotifications: false,
    enhancedValidation: true
  });
  
  // Create additional properties for backward compatibility
  const intentData = generationResult?.intentData || null;
  const blueprint = generationResult?.blueprint || null;
  
  return {
    isGenerating,
    currentWireframe,
    generationResults: generationResult,
    intentData,
    blueprint,
    generateWireframe,
    saveWireframe,
    applyFeedback: async (feedback: string) => currentWireframe, // Mock function for backward compatibility
    error
  };
}
