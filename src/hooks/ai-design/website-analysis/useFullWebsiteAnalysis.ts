
import { WebsiteAnalysisResult } from './types';
import { WebsiteAnalysisService } from '@/services/ai/design/website-analysis';

/**
 * Hook for analyzing full website design
 */
export function useFullWebsiteAnalysis(
  state: ReturnType<any>, 
  user: any, 
  showToast: any
) {
  const { startAnalysis, finishAnalysis, addResult, setError } = state;
  
  const analyzeWebsite = async (url: string): Promise<WebsiteAnalysisResult | null> => {
    if (!url) {
      setError("Please provide a valid URL");
      return null;
    }
    
    try {
      startAnalysis();
      
      // Extract domain from URL for title
      const domain = new URL(url).hostname;
      
      // Call the analysis service
      const result = await WebsiteAnalysisService.analyzeWebsitePattern(
        `Website Analysis - ${domain}`,
        `Complete design analysis of ${url}`,
        'website',
        {
          layout: '',
          colorScheme: '',
          typography: '',
          imagery: ''
        },
        {
          navigation: '',
          interactivity: '',
          responsiveness: '',
          accessibility: ''
        },
        {
          tone: '',
          messaging: '',
          callToAction: ''
        },
        [],
        ['website-analysis'],
        url
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
        description: `Successfully analyzed ${domain}`,
        variant: 'default'
      });
      
      return result;
    } catch (error) {
      console.error("Error analyzing website:", error);
      const message = error instanceof Error ? error.message : "Failed to analyze website";
      
      finishAnalysis(false, message);
      
      showToast({
        title: 'Analysis failed',
        description: message,
        variant: 'destructive'
      });
      
      return null;
    }
  };
  
  return { analyzeWebsite };
}
