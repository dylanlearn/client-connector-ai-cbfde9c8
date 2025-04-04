
import { useAuth } from '@/hooks/use-auth';
import { WebsiteAnalysisHook } from './website-analysis/types';
import { useWebsiteAnalysisState } from './website-analysis/useWebsiteAnalysisState';
import { useToastHandler } from './website-analysis/useToastHandler';
import { useWebsiteSectionAnalysis } from './website-analysis/useWebsiteSectionAnalysis';
import { useFullWebsiteAnalysis } from './website-analysis/useFullWebsiteAnalysis';

/**
 * Hook for analyzing and storing website design patterns
 */
export function useWebsiteAnalysis(): WebsiteAnalysisHook {
  // Get state management
  const { isAnalyzing, analysisResults, error, ...stateActions } = useWebsiteAnalysisState();
  
  // Try to get auth context, but don't throw if it doesn't exist
  let user;
  try {
    const auth = useAuth?.();
    user = auth?.user;
  } catch (e) {
    // Auth context not available, user remains undefined
  }
  
  // Get toast handler
  const { toast: showToast } = useToastHandler();

  // Get section analysis
  const { analyzeWebsiteSection } = useWebsiteSectionAnalysis({
    isAnalyzing,
    analysisResults,
    error,
    ...stateActions
  }, user, showToast);

  // Get full website analysis
  const { analyzeWebsite } = useFullWebsiteAnalysis({
    isAnalyzing,
    analysisResults,
    error,
    ...stateActions
  }, user, showToast);

  return {
    isAnalyzing,
    analysisResults,
    error,
    analyzeWebsiteSection,
    analyzeWebsite
  };
}
