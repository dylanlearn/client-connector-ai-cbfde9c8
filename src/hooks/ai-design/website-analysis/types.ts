
export interface WebsiteAnalysisResult {
  id?: string;
  title: string;
  description: string;
  category: string;
  visualElements: {
    layout: string;
    colorScheme: string;
    typography: string;
    spacing?: string;
    imagery?: string;
  };
  userExperience: {
    navigation: string;
    interactivity: string;
    responsiveness: string;
    accessibility: string;
  };
  contentAnalysis: {
    tone: string;
    messaging: string;
    callToAction: string;
  };
  targetAudience: string[];
  implementationNotes: string;
  tags: string[];
  source: string;
  imageUrl?: string;
  createdAt?: string | Date;
  userId?: string;
}

export type SectionType = 'hero' | 'features' | 'testimonial' | 'pricing' | 'contact' | 'footer' | 'about' | 'nav';

export interface WebsiteAnalysisHook {
  isAnalyzing: boolean;
  analysisResults: WebsiteAnalysisResult[];
  error: string | null;
  analyzeWebsite: (url: string) => Promise<WebsiteAnalysisResult | null>;
  analyzeWebsiteSection: (section: SectionType, url: string) => Promise<WebsiteAnalysisResult | null>;
}
