
import { useState, useCallback } from 'react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { 
  LayoutAnalyzerService, 
  LayoutAnalysisResult, 
  LayoutRecommendation 
} from '@/services/ai/design/layout-analysis/layout-analyzer-service';
import { toast } from 'sonner';

interface UseLayoutIntelligenceOptions {
  showToasts?: boolean;
  autoAnalyze?: boolean;
}

/**
 * Hook for interacting with the Layout Analyzer Service to get intelligent design recommendations
 */
export function useLayoutIntelligence({
  showToasts = true,
  autoAnalyze = false
}: UseLayoutIntelligenceOptions = {}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LayoutAnalysisResult | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<LayoutRecommendation | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Analyze a wireframe layout
   */
  const analyzeLayout = useCallback(async (wireframe: WireframeData) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await LayoutAnalyzerService.analyzeLayout(wireframe);
      setAnalysisResult(result);
      
      if (showToasts && result.recommendations.length > 0) {
        toast.success(`Layout analysis complete: ${result.recommendations.length} recommendations available`);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during layout analysis');
      setError(error);
      
      if (showToasts) {
        toast.error('Error analyzing layout: ' + error.message);
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [showToasts]);
  
  /**
   * Analyze a specific section
   */
  const analyzeSection = useCallback(async (section: WireframeSection) => {
    setError(null);
    
    try {
      return await LayoutAnalyzerService.analyzeSection(section);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during section analysis');
      setError(error);
      
      if (showToasts) {
        toast.error('Error analyzing section: ' + error.message);
      }
      
      return [];
    }
  }, [showToasts]);
  
  /**
   * Apply a layout recommendation
   */
  const applyRecommendation = useCallback(async (
    wireframe: WireframeData, 
    recommendationId: string
  ): Promise<WireframeData | null> => {
    setError(null);
    
    try {
      const recommendation = analysisResult?.recommendations.find(r => r.id === recommendationId);
      
      if (!recommendation) {
        throw new Error('Recommendation not found');
      }
      
      setSelectedRecommendation(recommendation);
      
      const updatedWireframe = await LayoutAnalyzerService.applyRecommendation(
        wireframe, 
        recommendationId
      );
      
      if (showToasts) {
        toast.success(`Applied recommendation: ${recommendation.description}`);
      }
      
      // After applying a recommendation, re-analyze the layout
      analyzeLayout(updatedWireframe);
      
      return updatedWireframe;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error applying recommendation');
      setError(error);
      
      if (showToasts) {
        toast.error('Error applying recommendation: ' + error.message);
      }
      
      return null;
    } finally {
      setSelectedRecommendation(null);
    }
  }, [analysisResult, analyzeLayout, showToasts]);
  
  /**
   * Clear the current analysis
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setSelectedRecommendation(null);
    setError(null);
  }, []);
  
  return {
    isAnalyzing,
    analysisResult,
    selectedRecommendation,
    error,
    analyzeLayout,
    analyzeSection,
    applyRecommendation,
    clearAnalysis
  };
}
