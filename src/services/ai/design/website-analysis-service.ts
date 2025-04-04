
import { DesignMemoryService, DesignMemoryEntry } from '@/services/ai/design/design-memory-service';
import { toast } from 'sonner';

export interface WebsiteAnalysisResult {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  visualElements: {
    layout: string;
    colorScheme: string;
    typography: string;
    spacing: string;
    imagery: string;
  };
  userExperience: {
    userFlow: string;
    interactions: string;
    accessibility: string;
  };
  contentAnalysis: {
    headline: string;
    subheadline: string;
    callToAction: string;
    valueProposition: string;
    testimonials: string[];
  };
  targetAudience: string[];
  effectivenessScore: number;
  tags: string[];
  source: string;
  imageUrl?: string;
}

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
        subcategory: analysis.subcategory,
        description: analysis.description,
        visual_elements: {
          layout: analysis.visualElements.layout,
          color_scheme: analysis.visualElements.colorScheme,
          typography: analysis.visualElements.typography,
          spacing: analysis.visualElements.spacing,
          imagery: analysis.visualElements.imagery
        },
        color_scheme: analysis.visualElements.colorScheme,
        typography: analysis.visualElements.typography,
        layout_pattern: analysis.visualElements.layout,
        tags: analysis.tags,
        source_url: analysis.source,
        image_url: analysis.imageUrl,
        relevance_score: analysis.effectivenessScore || 0.8,
        metadata: {
          user_experience: analysis.userExperience,
          content_analysis: analysis.contentAnalysis,
          target_audience: analysis.targetAudience
        }
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
      userExperience: {
        userFlow: userExperience.userFlow || '',
        interactions: userExperience.interactions || '',
        accessibility: userExperience.accessibility || ''
      },
      contentAnalysis: {
        headline: contentAnalysis.headline || '',
        subheadline: contentAnalysis.subheadline || '',
        callToAction: contentAnalysis.callToAction || '',
        valueProposition: contentAnalysis.valueProposition || '',
        testimonials: contentAnalysis.testimonials || []
      },
      targetAudience,
      effectivenessScore: 0.85, // Default high score for manually analyzed patterns
      tags,
      source,
      imageUrl
    };

    return analysisResult;
  },

  /**
   * Analyze a specific section of a website
   */
  analyzeWebsiteSection: async (
    section: 'hero' | 'testimonials' | 'features' | 'pricing' | 'footer' | 'navigation' | string,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']>,
    contentAnalysis: Partial<WebsiteAnalysisResult['contentAnalysis']>,
    source: string,
    imageUrl?: string
  ): Promise<WebsiteAnalysisResult> => {
    // Map section to category
    const categoryMap: Record<string, string> = {
      'hero': 'layout-hero',
      'testimonials': 'content-testimonials',
      'features': 'content-features',
      'pricing': 'content-pricing',
      'footer': 'layout-footer',
      'navigation': 'layout-navigation'
    };

    const category = categoryMap[section] || `section-${section}`;
    
    // Generate sensible default values based on the section type
    const sectionDefaults = getDefaultsForSection(section);

    return WebsiteAnalysisService.analyzeWebsitePattern(
      `${section.charAt(0).toUpperCase() + section.slice(1)} Section Analysis - ${source}`,
      description,
      category,
      { ...sectionDefaults.visualElements, ...visualElements },
      sectionDefaults.userExperience,
      { ...sectionDefaults.contentAnalysis, ...contentAnalysis },
      sectionDefaults.targetAudience,
      [...sectionDefaults.tags, section],
      source,
      imageUrl
    );
  }
};

/**
 * Helper function to get default values for different section types
 */
const getDefaultsForSection = (section: string): Partial<WebsiteAnalysisResult> => {
  const defaults: Record<string, Partial<WebsiteAnalysisResult>> = {
    'hero': {
      visualElements: {
        layout: 'Center-aligned with prominent call-to-action',
        spacing: 'Generous white space to highlight key message',
      },
      userExperience: {
        userFlow: 'Entry point for user journey',
        interactions: 'Primary CTA button, visual indicators',
        accessibility: 'High contrast for readability'
      },
      contentAnalysis: {
        valueProposition: 'Clear value proposition is essential',
      },
      targetAudience: ['All users', 'First-time visitors'],
      tags: ['hero', 'value proposition', 'conversion']
    },
    'testimonials': {
      visualElements: {
        layout: 'Grid or carousel layout',
        spacing: 'Card-based with consistent spacing',
      },
      userExperience: {
        userFlow: 'Social proof to reinforce decision making',
        interactions: 'Scrollable or clickable testimonials',
        accessibility: 'Text testimonials with proper contrast'
      },
      contentAnalysis: {
        valueProposition: 'Reinforces value through social proof',
      },
      targetAudience: ['Considering users', 'Researchers'],
      tags: ['social proof', 'trust', 'credibility']
    },
    'features': {
      visualElements: {
        layout: 'Grid or column-based layout',
        spacing: 'Consistent spacing between feature blocks',
      },
      userExperience: {
        userFlow: 'Product explanation and benefits showcase',
        interactions: 'Visual indicators, possibly expandable sections',
        accessibility: 'Clear feature descriptions'
      },
      contentAnalysis: {
        valueProposition: 'Specific benefits of each feature',
      },
      targetAudience: ['Researchers', 'Comparison shoppers'],
      tags: ['features', 'benefits', 'product details']
    }
  };

  return defaults[section] || {
    visualElements: {},
    userExperience: {
      userFlow: '',
      interactions: '',
      accessibility: ''
    },
    contentAnalysis: {},
    targetAudience: [],
    tags: []
  };
};
