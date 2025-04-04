
import { useState } from 'react';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';
import { WebsiteAnalysisState } from './types';

/**
 * Hook for managing website analysis state
 */
export function useWebsiteAnalysisState(): WebsiteAnalysisState {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<WebsiteAnalysisResult[]>([]);
  const [error, setError] = useState<Error | null>(null);

  return {
    isAnalyzing,
    analysisResults,
    error,
    setIsAnalyzing,
    setAnalysisResults,
    setError
  };
}

export type WebsiteAnalysisStateHook = ReturnType<typeof useWebsiteAnalysisState>;
