
import { useState } from 'react';
import { WebsiteAnalysisResult } from './types';

/**
 * Hook for managing website analysis state
 */
export function useWebsiteAnalysisState() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<WebsiteAnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const startAnalysis = () => {
    setIsAnalyzing(true);
    setError(null);
  };
  
  const finishAnalysis = (success: boolean, message: string | null = null) => {
    setIsAnalyzing(false);
    if (!success && message) {
      setError(message);
    }
  };
  
  const addResult = (result: WebsiteAnalysisResult) => {
    setAnalysisResults((prev) => [...prev, result]);
  };
  
  const clearResults = () => {
    setAnalysisResults([]);
  };
  
  return {
    isAnalyzing,
    analysisResults,
    error,
    startAnalysis,
    finishAnalysis,
    addResult,
    clearResults,
    setError
  };
}
