
import { useState, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  AccessibilityAnalyzerService, 
  AccessibilityAnalysisResult, 
  AccessibilityIssue 
} from '@/services/ai/design/accessibility/accessibility-analyzer-service';
import { toast } from 'sonner';

interface UseAccessibilityAnalysisOptions {
  showToasts?: boolean;
  autoAnalyze?: boolean;
}

/**
 * Hook for using the Accessibility Analyzer Service
 */
export function useAccessibilityAnalysis({
  showToasts = true,
  autoAnalyze = false
}: UseAccessibilityAnalysisOptions = {}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AccessibilityAnalysisResult | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<AccessibilityIssue | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Analyze a wireframe for accessibility issues
   */
  const analyzeAccessibility = useCallback(async (wireframe: WireframeData) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await AccessibilityAnalyzerService.analyzeWireframe(wireframe);
      setAnalysisResult(result);
      
      if (showToasts) {
        if (result.issues.length === 0) {
          toast.success('No accessibility issues found. Great job!');
        } else {
          toast.info(`Found ${result.issues.length} accessibility issues to address.`);
        }
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during accessibility analysis');
      setError(error);
      
      if (showToasts) {
        toast.error('Error analyzing accessibility: ' + error.message);
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [showToasts]);
  
  /**
   * Clear the current analysis
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setSelectedIssue(null);
    setError(null);
  }, []);
  
  return {
    isAnalyzing,
    analysisResult,
    selectedIssue,
    error,
    analyzeAccessibility,
    setSelectedIssue,
    clearAnalysis
  };
}
