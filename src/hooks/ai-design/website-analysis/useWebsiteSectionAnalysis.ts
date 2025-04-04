
import { useCallback } from 'react';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';
import { WebsiteAnalysisService } from '@/services/ai/design/website-analysis';
import { WebsiteAnalysisState } from './types';

/**
 * Hook for analyzing single website sections
 */
export function useWebsiteSectionAnalysis(
  state: WebsiteAnalysisState,
  user: any | undefined,
  showToast: (args: any) => void
) {
  const { setIsAnalyzing, setError, setAnalysisResults } = state;

  /**
   * Analyze and store a website section
   */
  const analyzeWebsiteSection = useCallback(async (
    section: string,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']> = {},
    contentStructure: Partial<WebsiteAnalysisResult['contentStructure']> = {},
    source: string,
    imageUrl?: string
  ) => {
    if (!user) {
      showToast({
        title: "Authentication required",
        description: "Please log in to analyze and store website designs.",
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Analyze the website section
      const result = await WebsiteAnalysisService.analyzeWebsiteSection(
        section,
        description,
        visualElements,
        contentStructure,
        source,
        imageUrl
      );

      // Store the analysis
      const stored = await WebsiteAnalysisService.storeWebsiteAnalysis(result);
      
      if (stored) {
        // First get current results, then update with the new result
        const currentResults = state.analysisResults;
        setAnalysisResults([...currentResults, result]);
        
        showToast({
          title: "Analysis stored",
          description: `The ${section} section analysis has been stored successfully.`
        });
        return result;
      } else {
        throw new Error("Failed to store analysis");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze website section');
      setError(error);
      showToast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, showToast, setIsAnalyzing, setError, setAnalysisResults, state.analysisResults]);

  return { analyzeWebsiteSection };
}
