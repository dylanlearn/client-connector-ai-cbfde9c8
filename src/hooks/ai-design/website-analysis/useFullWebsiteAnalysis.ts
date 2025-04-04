import { useCallback } from 'react';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';
import { WebsiteAnalysisService } from '@/services/ai/design/website-analysis';
import { WebsiteAnalysisState } from './types';
import { useToneAdaptation } from '../useToneAdaptation';
import { useConversationalMemory } from '../useConversationalMemory';
import { ProgressiveDisclosureService } from '@/services/ai/design/progressive-disclosure-service';

/**
 * Hook for analyzing full websites with multiple sections using progressive disclosure
 */
export function useFullWebsiteAnalysis(
  state: WebsiteAnalysisState,
  user: any | undefined,
  showToast: (args: any) => void
) {
  const { setIsAnalyzing, setError, setAnalysisResults } = state;
  const { adaptMessageTone } = useToneAdaptation();
  const { storeConversationEntry } = useConversationalMemory();

  /**
   * Create a complete website analysis with multiple sections using progressive disclosure
   */
  const analyzeWebsite = useCallback(async (
    websiteName: string,
    websiteUrl: string,
    sections: {
      type: string;
      description: string;
      visualElements?: Partial<WebsiteAnalysisResult['visualElements']>;
      contentStructure?: Partial<WebsiteAnalysisResult['contentStructure']>;
      imageUrl?: string;
    }[]
  ) => {
    if (!user) {
      const message = adaptMessageTone("Please log in to analyze websites.");
      showToast({
        title: "Authentication required",
        description: message,
        variant: "destructive"
      });
      return [];
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Store in conversational memory that user is analyzing a full website
      await storeConversationEntry(
        `User is analyzing a complete website: ${websiteName} (${websiteUrl})`,
        'assistant',
        { 
          designActivity: 'full-website-analysis',
          websiteName: websiteName,
          websiteUrl: websiteUrl,
          sectionCount: sections.length
        }
      );
      
      const results: WebsiteAnalysisResult[] = [];
      
      // Process each section progressively to avoid overwhelming the user
      const totalSections = sections.length;
      
      // Show initial progress message
      showToast({
        title: "Analysis started",
        description: adaptMessageTone(`Beginning analysis of ${totalSections} sections from ${websiteName}. This will be processed in stages.`)
      });
      
      // Process sections in batches of 2 for better user experience
      const batchSize = 2;
      for (let i = 0; i < sections.length; i += batchSize) {
        const currentBatch = sections.slice(i, i + batchSize);
        const batchResults = await Promise.all(currentBatch.map(async section => {
          try {
            const result = await WebsiteAnalysisService.analyzeWebsiteSection(
              section.type,
              section.description,
              section.visualElements || {},
              section.contentStructure || {},
              websiteUrl,
              section.imageUrl
            );
            
            // Store the analysis
            const stored = await WebsiteAnalysisService.storeWebsiteAnalysis(result);
            
            if (stored) {
              return result;
            }
            return null;
          } catch (error) {
            console.error(`Error analyzing section ${section.type}:`, error);
            return null;
          }
        }));
        
        // Filter out any failed analyses
        const validResults = batchResults.filter(Boolean) as WebsiteAnalysisResult[];
        results.push(...validResults);
        
        // Update results state progressively
        const currentResults = state.analysisResults;
        setAnalysisResults([...currentResults, ...validResults]);
        
        // Show progress update if not the final batch
        if (i + batchSize < sections.length) {
          const progress = Math.min(i + batchSize, sections.length);
          const progressMessage = adaptMessageTone(`Analyzed ${progress} of ${totalSections} sections. Continuing with next batch...`);
          
          showToast({
            title: `Analysis in progress (${progress}/${totalSections})`,
            description: progressMessage
          });
          
          // Briefly pause between batches to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      // Determine success message based on results
      if (results.length > 0) {
        // Generate a progressive disclosure message about the analysis
        const resultSummary = `Analysis of ${websiteName} completed with ${results.length} sections analyzed.`;
        const insightsContent = results.map(r => {
          // Use category or section type fallback from the source URL
          const sectionType = r.category.split('-')[1] || 'Unknown';
          return `${sectionType} section: ${r.description || 'No description available'}`;
        }).join('\n\n');
        
        const segments = ProgressiveDisclosureService.segmentContent(
          insightsContent,
          Math.min(3, Math.ceil(results.length / 2))
        );
        
        // Store this segmented content for later use
        await storeConversationEntry(
          `Analysis complete: ${resultSummary}\n\n${segments[0]}`,
          'assistant',
          { 
            designActivity: 'analysis-complete',
            websiteName: websiteName,
            segmentedContent: segments,
            currentSegment: 0,
            totalSegments: segments.length
          }
        );
        
        const completionMessage = adaptMessageTone(`All ${results.length} sections from ${websiteName} have been analyzed and stored. I've prepared insights you can explore.`);
        
        showToast({
          title: "Website analysis complete",
          description: completionMessage
        });
      } else {
        const errorMessage = adaptMessageTone("No sections were successfully analyzed. Please check your inputs and try again.");
        
        showToast({
          title: "Analysis completed with errors",
          description: errorMessage,
          variant: "destructive"
        });
      }
      
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze website');
      setError(error);
      showToast({
        title: "Analysis failed", 
        description: adaptMessageTone(error.message),
        variant: "destructive"
      });
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, showToast, setIsAnalyzing, setError, setAnalysisResults, state.analysisResults, adaptMessageTone, storeConversationEntry]);

  return { analyzeWebsite };
}
