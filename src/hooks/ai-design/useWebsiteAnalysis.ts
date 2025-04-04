
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  WebsiteAnalysisService, 
  WebsiteAnalysisResult 
} from '@/services/ai/design/website-analysis-service';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

/**
 * Hook for analyzing and storing website design patterns
 */
export function useWebsiteAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<WebsiteAnalysisResult[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  // Use optional chaining to handle cases where AuthContext isn't available
  const authContext = useAuth?.();
  const user = authContext?.user;
  
  // Use toast from sonner if useToast hook fails (fallback)
  let toastHandler;
  try {
    toastHandler = useToast();
  } catch (e) {
    // If useToast fails, we'll use sonner's toast directly
    toastHandler = { 
      toast: (args: any) => {
        toast[args.variant === 'destructive' ? 'error' : 'success'](args.title, {
          description: args.description
        });
      }
    };
  }
  const { toast: showToast } = toastHandler;

  /**
   * Analyze and store a website section
   */
  const analyzeWebsiteSection = useCallback(async (
    section: 'hero' | 'testimonials' | 'features' | 'pricing' | 'footer' | 'navigation' | string,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']> = {},
    contentAnalysis: Partial<WebsiteAnalysisResult['contentAnalysis']> = {},
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
        contentAnalysis,
        source,
        imageUrl
      );

      // Store the analysis
      const stored = await WebsiteAnalysisService.storeWebsiteAnalysis(result);
      
      if (stored) {
        setAnalysisResults(prevResults => [...prevResults, result]);
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
  }, [user, showToast]);

  /**
   * Create a complete website analysis with multiple sections
   */
  const analyzeWebsite = useCallback(async (
    websiteName: string,
    websiteUrl: string,
    sections: {
      type: 'hero' | 'testimonials' | 'features' | 'pricing' | 'footer' | 'navigation' | string;
      description: string;
      visualElements?: Partial<WebsiteAnalysisResult['visualElements']>;
      contentAnalysis?: Partial<WebsiteAnalysisResult['contentAnalysis']>;
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
          section.contentAnalysis || {},
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
  }, [user, showToast]);

  return {
    isAnalyzing,
    analysisResults,
    error,
    analyzeWebsiteSection,
    analyzeWebsite
  };
}
