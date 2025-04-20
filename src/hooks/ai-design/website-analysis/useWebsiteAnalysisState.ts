
import { useState } from 'react';
import { WebsiteAnalysisResult, WebsiteAnalysisState } from './types';

export function useWebsiteAnalysisState(): WebsiteAnalysisState {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<WebsiteAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearResults = () => {
    setAnalysisResults(null);
    setError(null);
  };

  return {
    isAnalyzing,
    analysisResults,
    error,
    setIsAnalyzing,
    setAnalysisResults,
    setError,
    clearResults
  };
}
