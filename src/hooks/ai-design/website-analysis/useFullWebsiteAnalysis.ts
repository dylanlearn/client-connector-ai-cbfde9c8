
import { useState } from 'react';
import { WebsiteAnalysisResult } from './types';
import { WebsiteAnalysisService } from '@/services/ai/design/website-analysis';

interface UseFullWebsiteAnalysisProps {
  isAnalyzing: boolean;
  analysisResults: WebsiteAnalysisResult[];
  error: string | null;
  startAnalysis: () => void;
  finishAnalysis: (success: boolean, message?: string | null) => void;
  addResult: (result: WebsiteAnalysisResult) => void;
  setError: (message: string | null) => void;
}

export function useFullWebsiteAnalysis(
  state: UseFullWebsiteAnalysisProps,
  user?: any,
  showToast?: (title: string, description: string, type?: string) => void
) {
  const analyzeWebsite = async (url: string): Promise<WebsiteAnalysisResult | null> => {
    if (state.isAnalyzing) return null;
    
    try {
      state.startAnalysis();

      // Call the service
      const data = await WebsiteAnalysisService.analyzeWebsitePattern(url);
      
      if (!data) {
        throw new Error("Failed to analyze website");
      }
      
      // Create result with all required fields
      const result: WebsiteAnalysisResult = {
        title: data.title,
        description: data.description,
        category: data.category,
        visualElements: {
          layout: data.visualElements.layout,
          colorScheme: data.visualElements.colorScheme,
          typography: data.visualElements.typography,
          spacing: data.visualElements.spacing || '',  // Provide default value
          imagery: data.visualElements.imagery || ''   // Provide default value
        },
        userExperience: data.userExperience,
        contentAnalysis: data.contentAnalysis,
        targetAudience: data.targetAudience,
        implementationNotes: data.implementationNotes || '', // Provide default value
        tags: data.tags,
        source: url,
        userId: user?.id
      };
      
      // Add to results
      state.addResult(result);
      
      // Store in database if we have a user
      if (user?.id) {
        try {
          await WebsiteAnalysisService.storeWebsiteAnalysis(result);
        } catch (storeError) {
          console.error("Error storing analysis:", storeError);
        }
      }
      
      state.finishAnalysis(true);
      
      if (showToast) {
        showToast("Analysis Complete", "Website analysis successfully completed", "success");
      }
      
      return result;
    } catch (error: any) {
      console.error("Error analyzing website:", error);
      state.setError(error.message || "Error analyzing website");
      state.finishAnalysis(false, error.message);
      
      if (showToast) {
        showToast("Analysis Failed", error.message || "Error analyzing website", "error");
      }
      
      return null;
    }
  };
  
  return { analyzeWebsite };
}
