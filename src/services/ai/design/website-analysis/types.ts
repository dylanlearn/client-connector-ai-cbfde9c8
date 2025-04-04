
// Types for website analysis service
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
  userExperience: {
    userFlow: string;
    interactions: string;
    accessibility: string;
  };
  contentAnalysis?: {
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
  sourceUrl?: string;
  screenshotUrl?: string;
  imageUrl?: string;
}

export type SectionType = 'hero' | 'testimonials' | 'features' | 'pricing' | 'footer' | 'navigation' | string;
