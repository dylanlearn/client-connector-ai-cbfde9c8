
/**
 * Service for analyzing website patterns
 */
export interface WebsiteAnalysisResult {
  title: string;
  description: string;
  category: string;
  visualElements: {
    layout: string;
    colorScheme: string;
    typography: string;
    spacing: string;
    imagery: string;
  };
  interactionPatterns: {
    userFlow: string;
    interactions: string;
    accessibility: string;
  };
  contentStructure: {
    headline: string;
    subheadline: string;
    callToAction: string;
    valueProposition: string;
    testimonials: string[];
  };
  tags: string[];
  sourceUrl?: string;
  screenshotUrl?: string;
  // Additional properties used in other components
  subcategory?: string;
  contentAnalysis?: {
    headline: string;
    subheadline: string;
    callToAction: string;
    valueProposition: string;
    testimonials: string[];
  };
  userExperience?: {
    userFlow: string;
    interactions: string;
    accessibility: string;
  };
  targetAudience?: string[];
  effectivenessScore?: number;
  source?: string;
  imageUrl?: string;
}

// Export SectionType from this file to match imports
export type SectionType = 'hero' | 'testimonials' | 'features' | 'pricing' | 'footer' | 'navigation' | string;

export const WebsiteAnalysisService = {
  /**
   * Analyze a website pattern and structure the data
   */
  analyzeWebsitePattern: async (
    title: string,
    description: string,
    category: string,
    visualElements: {
      layout: string;
      colorScheme: string;
      typography: string;
      spacing: string;
      imagery: string;
    },
    interactionPatterns: {
      userFlow: string;
      interactions: string;
      accessibility: string;
    },
    contentStructure: {
      headline: string;
      subheadline: string;
      callToAction: string;
      valueProposition: string;
      testimonials: string[];
    },
    tags: string[],
    sourceUrl?: string,
    screenshotUrl?: string
  ): Promise<WebsiteAnalysisResult> => {
    // This is a simple implementation that just organizes the parameters
    // In a real-world scenario, you might want to add validation or processing logic
    return {
      title,
      description,
      category,
      visualElements,
      interactionPatterns,
      contentStructure,
      tags,
      sourceUrl,
      screenshotUrl,
      // Map to additional properties for compatibility
      contentAnalysis: contentStructure,
      userExperience: interactionPatterns,
      source: sourceUrl,
      imageUrl: screenshotUrl
    };
  },

  /**
   * Analyze a specific section of a website
   */
  analyzeWebsiteSection: async (
    section: SectionType,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']> = {},
    contentAnalysis: Partial<WebsiteAnalysisResult['contentAnalysis']> = {},
    source: string,
    imageUrl?: string
  ): Promise<WebsiteAnalysisResult> => {
    // Create default values for interaction patterns
    const interactionPatterns = {
      userFlow: "Standard user flow",
      interactions: "Basic interactions",
      accessibility: "Standard accessibility"
    };

    // Convert contentAnalysis to contentStructure format
    const contentStructure = {
      headline: contentAnalysis.headline || "",
      subheadline: contentAnalysis.subheadline || "",
      callToAction: contentAnalysis.callToAction || "",
      valueProposition: contentAnalysis.valueProposition || "",
      testimonials: contentAnalysis.testimonials || []
    };

    // Fill in any missing visual elements
    const fullVisualElements = {
      layout: visualElements.layout || "",
      colorScheme: visualElements.colorScheme || "",
      typography: visualElements.typography || "",
      spacing: visualElements.spacing || "",
      imagery: visualElements.imagery || ""
    };

    // Generate a category based on section type
    const category = `section-${section}`;

    return WebsiteAnalysisService.analyzeWebsitePattern(
      `${section.charAt(0).toUpperCase() + section.slice(1)} Section Analysis`,
      description,
      category,
      fullVisualElements,
      interactionPatterns,
      contentStructure,
      [`${section}`, "analysis", "website-section"],
      source,
      imageUrl
    );
  },

  /**
   * Store a website analysis result
   */
  storeWebsiteAnalysis: async (analysis: WebsiteAnalysisResult): Promise<boolean> => {
    // This is a placeholder implementation
    console.log("Storing website analysis:", analysis.title);
    return true;
  }
};
