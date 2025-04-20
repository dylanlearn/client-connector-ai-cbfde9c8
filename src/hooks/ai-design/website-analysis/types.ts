
export type SectionType = 'hero' | 'features' | 'testimonial' | 'pricing' | 'contact' | 'footer';

export interface WebsiteAnalysisResult {
  url: string;
  timestamp: string;
  designPatterns: string;
  implementation?: string;
  colorScheme?: Record<string, string>;
  components?: string[];
  section?: SectionType;
  error?: string;
}

export interface WebsiteAnalysisHook {
  isAnalyzing: boolean;
  analysisResults: WebsiteAnalysisResult | null;
  error: string | null;
  analyzeWebsite: (url: string) => Promise<WebsiteAnalysisResult | null>;
  analyzeWebsiteSection: (section: SectionType, url: string) => Promise<WebsiteAnalysisResult | null>;
}

export interface WebsiteAnalysisState {
  isAnalyzing: boolean;
  analysisResults: WebsiteAnalysisResult | null;
  error: string | null;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisResults: (results: WebsiteAnalysisResult | null) => void;
  setError: (error: string | null) => void;
  clearResults: () => void;
}
