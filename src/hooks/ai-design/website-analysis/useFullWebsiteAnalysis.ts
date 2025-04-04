
import { useCallback } from 'react';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';
import { WebsiteAnalysisService } from '@/services/ai/design/website-analysis';
import { WebsiteAnalysisState } from './types';

/**
 * Hook for analyzing full websites with multiple sections
 */
export function useFullWebsiteAnalysis(
  state: WebsiteAnalysisState,
  user: any | undefined,
  showToast: (args: any) => void
) {
  const { setIsAnalyzing, setError, setAnalysisResults } = state;

  /**
   * Create a complete website analysis with multiple sections
   */
  const analyzeWebsite = useCallback(async (
    websiteName: string,
    websiteUrl: string,
    sections: {
      type: string;
      description: string;
      visualElements?: Partial<WebsiteAnalysisResult['visualElements']>;
      contentStructure?: Partial<WebsiteAnalysisResult['contentStructure']>;
      imageUrl?: string;
    }[]
  ) => {
    if (!user) {
      showToast({
        title: "Authentication required",
        description: "Please log in to analyze websites.",
        variant: "destructive"
      });
      return [];
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      const results: WebsiteAnalysisResult[] = [];
      
      // Process each section
      for (const section of sections) {
        const result = await WebsiteAnalysisService.analyzeWebsiteSection(
          section.type,
          section.description,
          section.visualElements || {},
          section.contentStructure || {},
          websiteUrl,
          section.imageUrl
        );
        
        // Store the analysis
        const stored = await WebsiteAnalysisService.storeWebsiteAnalysis(result);
        
        if (stored) {
          results.push(result);
        }
      }
      
      setAnalysisResults(prev => [...prev, ...results]);
      
      if (results.length > 0) {
        showToast({
          title: "Website analysis complete",
          description: `${results.length} sections from ${websiteName} have been analyzed and stored.`
        });
      } else {
        showToast({
          title: "Analysis completed with warnings",
          description: "No sections were successfully stored. Check for errors."
        });
      }
      
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze website');
      setError(error);
      showToast({
        title: "Analysis failed", 
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, showToast, setIsAnalyzing, setError, setAnalysisResults]);

  return { analyzeWebsite };
}
