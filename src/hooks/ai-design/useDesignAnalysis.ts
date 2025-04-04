
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type DesignAnalysisResult = {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  visualElements: Record<string, any>;
  colorScheme: {
    palette: string[];
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontPairings: string[];
  };
  layoutPattern: {
    type: string;
    structure: string;
    spacing: string;
  };
  tags: string[];
  relevanceScore: number;
};

/**
 * Hook for analyzing design patterns and storing results in memory
 */
export function useDesignAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DesignAnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Analyze a design pattern or concept using AI
   */
  const analyzeDesignPattern = useCallback(async (
    promptOrDescription: string,
    context?: Record<string, any>,
    industry?: string,
    category?: string
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to use the design analysis feature.",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-design-patterns', {
        body: {
          promptOrDescription,
          context,
          industry,
          category
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.analysis);
      
      toast({
        title: "Analysis complete",
        description: "Design pattern has been analyzed successfully."
      });
      
      return data.analysis;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze design pattern');
      setError(error);
      
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  return {
    isLoading,
    result,
    error,
    analyzeDesignPattern
  };
}
