
import { useState, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  SmartLayoutGeneratorService, 
  LayoutAlternative,
  LayoutGenerationOptions,
  LayoutGenerationResult
} from '@/services/ai/design/layout/smart-layout-generator-service';
import { toast } from 'sonner';

interface UseSmartLayoutAlternativesOptions {
  showToasts?: boolean;
}

/**
 * Hook for generating and managing smart layout alternatives
 */
export function useSmartLayoutAlternatives({
  showToasts = true
}: UseSmartLayoutAlternativesOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<LayoutGenerationResult | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Generate layout alternatives for a wireframe
   */
  const generateAlternatives = useCallback(async (
    wireframe: WireframeData,
    options: LayoutGenerationOptions = {}
  ) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await SmartLayoutGeneratorService.generateAlternatives(wireframe, options);
      setGenerationResult(result);
      
      if (result.alternatives.length > 0) {
        setSelectedAlternative(result.alternatives[0].id);
        
        if (showToasts) {
          toast.success(`Generated ${result.alternatives.length} layout alternatives`);
        }
      } else {
        if (showToasts) {
          toast.error('No layout alternatives could be generated');
        }
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error generating layout alternatives');
      setError(error);
      
      if (showToasts) {
        toast.error('Error generating alternatives: ' + error.message);
      }
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [showToasts]);
  
  /**
   * Apply a selected layout alternative to the wireframe
   */
  const applyAlternative = useCallback((wireframe: WireframeData, alternativeId: string): WireframeData | null => {
    if (!generationResult) {
      if (showToasts) {
        toast.error('No layout alternatives have been generated');
      }
      return null;
    }
    
    try {
      const updatedWireframe = SmartLayoutGeneratorService.applyLayoutAlternative(
        wireframe,
        alternativeId,
        generationResult.alternatives
      );
      
      if (showToasts) {
        const alternative = generationResult.alternatives.find(alt => alt.id === alternativeId);
        toast.success(`Applied layout alternative: ${alternative?.name || 'Selected layout'}`);
      }
      
      return updatedWireframe;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error applying layout alternative');
      setError(error);
      
      if (showToasts) {
        toast.error('Error applying alternative: ' + error.message);
      }
      
      return null;
    }
  }, [generationResult, showToasts]);
  
  /**
   * Reset the generator state
   */
  const reset = useCallback(() => {
    setGenerationResult(null);
    setSelectedAlternative(null);
    setError(null);
  }, []);
  
  return {
    isGenerating,
    generationResult,
    selectedAlternative,
    error,
    generateAlternatives,
    applyAlternative,
    setSelectedAlternative,
    reset
  };
}
