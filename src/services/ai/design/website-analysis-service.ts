
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
        color_scheme: {
          value: analysis.visualElements.colorScheme
        },
        typography: {
          value: analysis.visualElements.typography
        },
        layout_pattern: {
          value: analysis.visualElements.layout
        },
        tags: analysis.tags,
        source_url: analysis.source,
        image_url: analysis.imageUrl,
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
        colorScheme: 'High contrast for visibility',
        typography: 'Large, bold headings with readable body text',
        imagery: 'Hero image or product showcase'
      },
      userExperience: {
        userFlow: 'Entry point for user journey',
        interactions: 'Primary CTA button, visual indicators',
        accessibility: 'High contrast for readability'
      },
      contentAnalysis: {
        headline: 'Clear value proposition headline',
        subheadline: 'Supporting subheading text',
        callToAction: 'Strong CTA button',
        valueProposition: 'Clear value proposition is essential',
        testimonials: []
      },
      targetAudience: ['All users', 'First-time visitors'],
      tags: ['hero', 'value proposition', 'conversion']
    },
    'testimonials': {
      visualElements: {
        layout: 'Grid or carousel layout',
        spacing: 'Card-based with consistent spacing',
        colorScheme: 'Neutral background with accent colors',
        typography: 'Quote styling with attribution',
        imagery: 'Customer photos or company logos'
      },
      userExperience: {
        userFlow: 'Social proof to reinforce decision making',
        interactions: 'Scrollable or clickable testimonials',
        accessibility: 'Text testimonials with proper contrast'
      },
      contentAnalysis: {
        headline: 'Trust-building headline',
        subheadline: 'Supporting context',
        callToAction: 'Secondary CTA',
        valueProposition: 'Reinforces value through social proof',
        testimonials: ['Sample testimonial']
      },
      targetAudience: ['Considering users', 'Researchers'],
      tags: ['social proof', 'trust', 'credibility']
    },
    'features': {
      visualElements: {
        layout: 'Grid or column-based layout',
        spacing: 'Consistent spacing between feature blocks',
        colorScheme: 'Consistent color coding for features',
        typography: 'Clear feature headings with descriptive text',
        imagery: 'Feature icons or screenshots'
      },
      userExperience: {
        userFlow: 'Product explanation and benefits showcase',
        interactions: 'Visual indicators, possibly expandable sections',
        accessibility: 'Clear feature descriptions'
      },
      contentAnalysis: {
        headline: 'Feature-focused headline',
        subheadline: 'Feature overview text',
        callToAction: 'Learn more or trial CTA',
        valueProposition: 'Specific benefits of each feature',
        testimonials: []
      },
      targetAudience: ['Researchers', 'Comparison shoppers'],
      tags: ['features', 'benefits', 'product details']
    }
  };

  // Ensure we return a properly structured object even for undefined sections
  return defaults[section] || {
    visualElements: {
      layout: '',
      colorScheme: '',
      typography: '',
      spacing: '',
      imagery: ''
    },
    userExperience: {
      userFlow: '',
      interactions: '',
      accessibility: ''
    },
    contentAnalysis: {
      headline: '',
      subheadline: '',
      callToAction: '',
      valueProposition: '',
      testimonials: []
    },
    targetAudience: [],
    tags: []
  };
};
