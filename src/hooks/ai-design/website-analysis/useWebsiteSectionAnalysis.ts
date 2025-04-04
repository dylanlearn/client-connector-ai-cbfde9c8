
import { useCallback } from 'react';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';
import { WebsiteAnalysisService } from '@/services/ai/design/website-analysis';
import { WebsiteAnalysisState } from './types';
import { useToneAdaptation } from '../useToneAdaptation';
import { useConversationalMemory } from '../useConversationalMemory';

/**
 * Hook for analyzing single website sections with personalized messaging
 */
export function useWebsiteSectionAnalysis(
  state: WebsiteAnalysisState,
  user: any | undefined,
  showToast: (args: any) => void
) {
  const { setIsAnalyzing, setError, setAnalysisResults } = state;
  const { adaptMessageTone } = useToneAdaptation();
  const { storeConversationEntry } = useConversationalMemory();

  /**
   * Analyze and store a website section with personalized feedback
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
      const message = adaptMessageTone("Please log in to analyze and store website designs.");
      showToast({
        title: "Authentication required",
        description: message,
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Store in conversational memory that user is analyzing a website section
      await storeConversationEntry(
        `User is analyzing a ${section} section with description: ${description}`,
        'assistant',
        { 
          designActivity: 'website-analysis',
          section: section
        }
      );

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
          description: adaptMessageTone(`The ${section} section analysis has been stored successfully.`)
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
        description: adaptMessageTone(error.message),
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, showToast, setIsAnalyzing, setError, setAnalysisResults, state.analysisResults, adaptMessageTone, storeConversationEntry]);

  return { analyzeWebsiteSection };
}
