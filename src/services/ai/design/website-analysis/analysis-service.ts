
import { DesignMemoryService, DesignMemoryEntry } from '@/services/ai/design/design-memory-service';
import { toast } from 'sonner';
import { WebsiteAnalysisResult, SectionType } from '../website-analysis/types';
import { DefaultsService } from './defaults-service';

/**
 * Service for analyzing website design patterns and storing insights
 */
export const WebsiteAnalysisService = {
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
  },

  /**
   * Analyze a website design pattern based on provided information
   */
  analyzeWebsitePattern: async (
    title: string,
    description: string,
    category: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']>,
    userExperience: Partial<WebsiteAnalysisResult['userExperience']>,
    contentAnalysis: Partial<WebsiteAnalysisResult['contentAnalysis']>,
    targetAudience: string[],
    tags: string[],
    source: string,
    imageUrl?: string
  ): Promise<WebsiteAnalysisResult> => {
    // Construct a structured analysis result
    const analysisResult: WebsiteAnalysisResult = {
      title,
      description,
      category,
      subcategory: category.includes('-') ? category.split('-')[1].trim() : '',
      visualElements: {
        layout: visualElements.layout || '',
        colorScheme: visualElements.colorScheme || '',
        typography: visualElements.typography || '',
        spacing: visualElements.spacing || '',
        imagery: visualElements.imagery || ''
      },
      interactionPatterns: {
        userFlow: userExperience?.userFlow || '',
        interactions: userExperience?.interactions || '',
        accessibility: userExperience?.accessibility || ''
      },
      contentStructure: {
        headline: contentAnalysis?.headline || '',
        subheadline: contentAnalysis?.subheadline || '',
        callToAction: contentAnalysis?.callToAction || '',
        valueProposition: contentAnalysis?.valueProposition || '',
        testimonials: contentAnalysis?.testimonials || []
      },
      userExperience: {
        userFlow: userExperience?.userFlow || '',
        interactions: userExperience?.interactions || '',
        accessibility: userExperience?.accessibility || ''
      },
      contentAnalysis: {
        headline: contentAnalysis?.headline || '',
        subheadline: contentAnalysis?.subheadline || '',
        callToAction: contentAnalysis?.callToAction || '',
        valueProposition: contentAnalysis?.valueProposition || '',
        testimonials: contentAnalysis?.testimonials || []
      },
      targetAudience,
      effectivenessScore: 0.85, // Default high score for manually analyzed patterns
      tags,
      source,
      sourceUrl: source,
      screenshotUrl: imageUrl,
      imageUrl
    };

    return analysisResult;
  },

  /**
   * Analyze a specific section of a website
   */
  analyzeWebsiteSection: async (
    section: SectionType,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']>,
    contentStructure: Partial<WebsiteAnalysisResult['contentStructure']>,
    source: string,
    imageUrl?: string
  ): Promise<WebsiteAnalysisResult> => {
    // Map section to category
    const categoryMap = DefaultsService.getSectionCategoryMap();
    const category = categoryMap[section] || `section-${section}`;
    
    // Generate sensible default values based on the section type
    const sectionDefaults = DefaultsService.getDefaultsForSection(section);

    // Convert contentStructure to contentAnalysis for compatibility
    const contentAnalysis = contentStructure as unknown as Partial<WebsiteAnalysisResult['contentAnalysis']>;

    return WebsiteAnalysisService.analyzeWebsitePattern(
      `${section.charAt(0).toUpperCase() + section.slice(1)} Section Analysis - ${source}`,
      description,
      category,
      { ...sectionDefaults.visualElements, ...visualElements } as WebsiteAnalysisResult['visualElements'],
      sectionDefaults.userExperience as WebsiteAnalysisResult['userExperience'],
      { ...sectionDefaults.contentAnalysis, ...contentAnalysis } as WebsiteAnalysisResult['contentAnalysis'],
      sectionDefaults.targetAudience || [],
      [...(sectionDefaults.tags || []), section],
      source,
      imageUrl
    );
  }
};
