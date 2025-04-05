
import { SectionType, WebsiteAnalysisResult } from './types';
import { WebsiteAnalysisService } from '@/services/ai/design/website-analysis';

/**
 * Hook for analyzing specific website sections
 */
export function useWebsiteSectionAnalysis(
  state: ReturnType<any>, 
  user: any, 
  showToast: any
) {
  const { startAnalysis, finishAnalysis, addResult, setError } = state;
  
  const analyzeWebsiteSection = async (section: SectionType, url: string): Promise<WebsiteAnalysisResult | null> => {
    if (!url) {
      setError("Please provide a valid URL");
      return null;
    }
    
    try {
      startAnalysis();
      
      // Call the analysis service
      const result = await WebsiteAnalysisService.analyzeWebsiteSection(
        section,
        `Section analysis from ${url}`,
        {},
        {},
        url,
        undefined
      );
      
      // Store the result if user is authenticated
      if (user?.id) {
        try {
          await WebsiteAnalysisService.storeWebsiteAnalysis(result, user.id);
        } catch (storageError) {
          console.error('Failed to store analysis result:', storageError);
        }
      }
      
      addResult(result);
      finishAnalysis(true);
      
      showToast({
        title: 'Analysis complete',
        description: `Successfully analyzed ${section} section`,
        variant: 'default'
      });
      
      return result;
    } catch (error) {
      console.error("Error analyzing website section:", error);
      const message = error instanceof Error ? error.message : "Failed to analyze website section";
      
      finishAnalysis(false, message);
      
      showToast({
        title: 'Analysis failed',
        description: message,
        variant: 'destructive'
      });
      
      return null;
    }
  };
  
  return { analyzeWebsiteSection };
}
