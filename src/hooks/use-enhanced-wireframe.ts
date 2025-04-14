
import { useWireframe } from '@/hooks/useWireframe';
import { WireframeGenerationParams, EnhancedWireframeGenerationResult } from '@/services/ai/wireframe/wireframe-types';

/**
 * @deprecated Use useWireframe instead
 */
export function useAdvancedWireframe() {
  const {
    isGenerating,
    currentWireframe,
    generationResults,
    intentData,
    blueprint,
    generateWireframe,
    saveWireframe,
    applyFeedback,
    error
  } = useWireframe({
    useSonnerToasts: false,
    enhancedValidation: true
  });
  
  return {
    isGenerating,
    currentWireframe,
    generationResults,
    intentData,
    blueprint,
    generateWireframe,
    saveWireframe,
    applyFeedback,
    error
  };
}
