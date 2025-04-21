
import { useState, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { toast } from 'sonner';
import { 
  CompositionPrinciple,
  DesignPrincipleAnalysis
} from '@/services/ai/design/principle-analysis/types';
import { DesignPrincipleAnalyzerService } from '@/services/ai/design/principle-analysis/design-principle-analyzer';

interface UseDesignPrincipleAnalysisOptions {
  showToasts?: boolean;
}

/**
 * Hook for analyzing wireframes against design principles
 */
export function useDesignPrincipleAnalysis({
  showToasts = true
}: UseDesignPrincipleAnalysisOptions = {}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DesignPrincipleAnalysis | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Analyze a wireframe for adherence to design principles
   */
  const analyzeDesignPrinciples = useCallback(async (
    wireframe: WireframeData,
    principles?: CompositionPrinciple[]
  ): Promise<DesignPrincipleAnalysis | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await DesignPrincipleAnalyzerService.analyzeComposition(wireframe, principles);
      
      setAnalysisResult(result);
      
      if (showToasts) {
        if (result.overallScore >= 80) {
          toast.success('Design follows principles well!');
        } else if (result.overallScore >= 60) {
          toast.info('Design has some areas for improvement.');
        } else {
          toast.warning('Design needs significant improvement.');
        }
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error analyzing design principles');
      setError(error);
      
      if (showToasts) {
        toast.error('Error analyzing design principles: ' + error.message);
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [showToasts]);
  
  /**
   * Apply a specific design principle improvement to a wireframe
   */
  const applyPrincipleImprovement = useCallback(async (
    wireframe: WireframeData,
    principle: CompositionPrinciple
  ): Promise<WireframeData | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await DesignPrincipleAnalyzerService.applyPrincipleImprovements(wireframe, principle);
      
      if (showToasts) {
        toast.success(`Applied ${principle} improvements to the design.`);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Unknown error applying ${principle}`);
      setError(error);
      
      if (showToasts) {
        toast.error(`Error applying ${principle}: ` + error.message);
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [showToasts]);
  
  /**
   * Clear any previous analysis results
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
  }, []);
  
  return {
    isAnalyzing,
    analysisResult,
    error,
    analyzeDesignPrinciples,
    applyPrincipleImprovement,
    clearAnalysis
  };
}

// Export the hook
export default useDesignPrincipleAnalysis;
