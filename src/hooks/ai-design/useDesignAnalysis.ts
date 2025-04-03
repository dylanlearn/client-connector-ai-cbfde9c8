
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  AIDesignAnalysisService, 
  DesignAnalysisRequest, 
  DesignAnalysisResponse 
} from '@/services/ai/design/ai-design-analysis-service';

export function useDesignAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DesignAnalysisResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Analyze a design concept or description
   */
  const analyzeDesign = useCallback(async (
    promptOrDescription: string,
    options: { 
      industry?: string; 
      category?: string; 
      context?: Record<string, any>;
      storeResult?: boolean;
      sourceUrl?: string;
      imageUrl?: string;
    } = {}
  ) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const request: DesignAnalysisRequest = {
        promptOrDescription,
        industry: options.industry,
        category: options.category,
        context: options.context
      };

      const result = await AIDesignAnalysisService.analyzeDesignPattern(request);
      setAnalysisResult(result);
      
      // Optionally store the result in the database
      if (options.storeResult) {
        const id = await AIDesignAnalysisService.storeAnalysisResult(
          result,
          options.sourceUrl,
          options.imageUrl
        );
        
        if (id) {
          toast.success("Design analysis stored in memory");
        }
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze design');
      setError(error);
      toast.error(error.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyzeDesign,
    isAnalyzing,
    analysisResult,
    error
  };
}
