
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

      // Call the service with all required parameters
      const data = await WebsiteAnalysisService.analyzeWebsitePattern(
        `Website Analysis - ${url}`,
        `Analysis of design patterns for ${url}`,
        'website',
        {
          layout: 'Standard website layout',
          colorScheme: 'Site color scheme',
          typography: 'Site typography',
          spacing: 'Standard spacing', // Ensure spacing is provided as required
          imagery: 'Site imagery'
        },
        {
          userFlow: 'Standard user flow',
          interactions: 'Standard interactions',
          accessibility: 'Standard accessibility'
        },
        {
          headline: 'Main headline',
          subheadline: 'Supporting subheadline',
          callToAction: 'Primary CTA',
          valueProposition: 'Key value proposition',
          testimonials: []
        },
        // Fixed: Passing an array of target audience strings instead of a single string
        ['website users', 'general audience'],
        ['website', 'analysis'], // Fixed: Passing an array of tags instead of a string
        url,
        undefined // Added undefined for the optional imageUrl parameter
      );
      
      if (!data) {
        throw new Error("Failed to analyze website");
      }
      
      // Convert service result to hook result format
      const result: WebsiteAnalysisResult = {
        title: data.title,
        description: data.description,
        category: data.category,
        visualElements: {
          layout: data.visualElements.layout,
          colorScheme: data.visualElements.colorScheme,
          typography: data.visualElements.typography,
          spacing: data.visualElements.spacing || 'Standard spacing', // Ensure spacing is always defined
          imagery: data.visualElements.imagery || 'Standard imagery' // Ensure imagery is always defined
        },
        userExperience: {
          navigation: data.interactionPatterns?.userFlow || data.userExperience?.userFlow || '',
          interactivity: data.interactionPatterns?.interactions || data.userExperience?.interactions || '',
          responsiveness: 'Responsive design',
          accessibility: data.interactionPatterns?.accessibility || data.userExperience?.accessibility || ''
        },
        contentAnalysis: {
          tone: data.contentStructure?.valueProposition || data.contentAnalysis?.valueProposition || '',
          messaging: data.contentStructure?.headline || data.contentAnalysis?.headline || '',
          callToAction: data.contentStructure?.callToAction || data.contentAnalysis?.callToAction || ''
        },
        targetAudience: data.targetAudience,
        implementationNotes: 'Implementation details based on analysis',
        tags: data.tags,
        source: url,
        userId: user?.id
      };
      
      // Add to results
      state.addResult(result);
      
      // Store in database if we have a user
      if (user?.id) {
        try {
          // Pass only the fields expected by the storage service
          const serviceResult = {
            title: result.title,
            description: result.description,
            category: result.category,
            subcategory: '',
            visualElements: {
              layout: result.visualElements.layout,
              colorScheme: result.visualElements.colorScheme,
              typography: result.visualElements.typography,
              spacing: result.visualElements.spacing,
              imagery: result.visualElements.imagery
            },
            interactionPatterns: {
              userFlow: result.userExperience.navigation,
              interactions: result.userExperience.interactivity,
              accessibility: result.userExperience.accessibility
            },
            contentStructure: {
              headline: result.contentAnalysis.messaging,
              subheadline: '',
              callToAction: result.contentAnalysis.callToAction,
              valueProposition: result.contentAnalysis.tone,
              testimonials: []
            },
            targetAudience: result.targetAudience,
            effectivenessScore: 0.8,
            tags: result.tags,
            source: result.source,
            userExperience: {
              userFlow: result.userExperience.navigation,
              interactions: result.userExperience.interactivity,
              accessibility: result.userExperience.accessibility
            },
            contentAnalysis: {
              headline: result.contentAnalysis.messaging,
              subheadline: '',
              callToAction: result.contentAnalysis.callToAction,
              valueProposition: result.contentAnalysis.tone,
              testimonials: []
            }
          };
          
          await WebsiteAnalysisService.storeWebsiteAnalysis(serviceResult);
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
