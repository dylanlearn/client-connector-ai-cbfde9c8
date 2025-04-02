
import { useState } from "react";
import { AIAnalysis } from "@/types/ai";
import { AIAnalyzerService } from "@/services/ai";
import { parseFallbackAnalysis } from "../utils";

export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const analyzeResponses = async (questionnaireData: Record<string, any>): Promise<AIAnalysis> => {
    setIsProcessing(true);
    
    try {
      const analysisResult = await AIAnalyzerService.analyzeResponses(questionnaireData);
      setAnalysis(analysisResult);
      return analysisResult;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      const fallbackAnalysis = parseFallbackAnalysis();
      setAnalysis(fallbackAnalysis);
      return fallbackAnalysis;
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
  };

  return {
    analysis,
    isProcessing,
    analyzeResponses,
    resetAnalysis
  };
};
