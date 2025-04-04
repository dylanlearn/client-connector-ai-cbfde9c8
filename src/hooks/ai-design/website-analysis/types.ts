
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';

export interface WebsiteAnalysisState {
  isAnalyzing: boolean;
  analysisResults: WebsiteAnalysisResult[];
  error: Error | null;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisResults: (results: WebsiteAnalysisResult[]) => void;
  setError: (error: Error | null) => void;
}

export interface WebsiteAnalysisHook extends Omit<WebsiteAnalysisState, 'setIsAnalyzing' | 'setAnalysisResults' | 'setError'> {
  analyzeWebsiteSection: (
    sectionType: string,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']>,
    contentStructure: Partial<WebsiteAnalysisResult['contentStructure']>,
    websiteSource: string,
    imageUrl?: string
  ) => Promise<WebsiteAnalysisResult | null>;
  
  analyzeWebsite: (
    websiteName: string,
    websiteUrl: string,
    sections: {
      type: string;
      description: string;
      visualElements?: Partial<WebsiteAnalysisResult['visualElements']>;
      contentStructure?: Partial<WebsiteAnalysisResult['contentStructure']>;
      imageUrl?: string;
    }[]
  ) => Promise<WebsiteAnalysisResult[]>;
}
