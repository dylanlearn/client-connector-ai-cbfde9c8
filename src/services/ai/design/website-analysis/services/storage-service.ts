
import { WebsiteAnalysisResult } from '../types';
import { DesignMemoryService, DesignMemoryEntry } from '@/services/ai/design/design-memory-service';
import { toast } from 'sonner';

/**
 * Service for storing website analysis results
 */
export const StorageService = {
  /**
   * Store a website analysis as a design memory entry
   */
  storeWebsiteAnalysis: async (
    analysis: WebsiteAnalysisResult
  ): Promise<boolean> => {
    try {
      // Map the analysis to a design memory entry
      const designMemoryEntry: DesignMemoryEntry = {
        title: analysis.title,
        category: analysis.category,
        subcategory: analysis.subcategory || '',
        description: analysis.description,
        visual_elements: {
          layout: analysis.visualElements.layout,
          color_scheme: analysis.visualElements.colorScheme,
          typography: analysis.visualElements.typography,
          spacing: analysis.visualElements.spacing,
          imagery: analysis.visualElements.imagery
        },
        color_scheme: {
          primary: analysis.visualElements.colorScheme,
          secondary: '',
          accent: '',
          background: '',
          text: ''
        },
        typography: {
          headings: analysis.visualElements.typography,
          body: '',
          accent: '',
          size_scale: ''
        },
        layout_pattern: {
          type: analysis.visualElements.layout,
          grid: '',
          responsive: true,
          components: []
        },
        tags: analysis.tags,
        source_url: analysis.sourceUrl || analysis.source || '',
        image_url: analysis.imageUrl || analysis.screenshotUrl || '',
        relevance_score: analysis.effectivenessScore || 0.8
      };

      // Store the design memory entry
      const result = await DesignMemoryService.storeDesignMemory(designMemoryEntry);
      
      if (result) {
        console.log('Successfully stored website analysis:', analysis.title);
        return true;
      } else {
        console.error('Failed to store website analysis');
        return false;
      }
    } catch (error) {
      console.error('Error storing website analysis:', error);
      toast.error('Failed to store website analysis');
      return false;
    }
  }
};
