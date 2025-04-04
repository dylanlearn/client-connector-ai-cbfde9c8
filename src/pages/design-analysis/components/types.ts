
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';

export interface Section {
  type: string;
  description: string;
  visualElements: Partial<WebsiteAnalysisResult['visualElements']>;
  contentStructure: Partial<WebsiteAnalysisResult['contentStructure']>;
  imageUrl?: string;
}

export interface AnalysisFormProps {
  isAnalyzing: boolean;
  onSubmit: (
    websiteName: string,
    websiteUrl: string,
    sections: Section[]
  ) => Promise<void>;
}

export interface SingleSectionFormProps {
  isAnalyzing: boolean;
  onSubmit: (
    sectionType: string,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']>,
    contentStructure: Partial<WebsiteAnalysisResult['contentStructure']>,
    websiteSource: string,
    imageUrl: string
  ) => Promise<void>;
}

export interface AnalysisResultProps {
  currentResult: WebsiteAnalysisResult | null;
  analysisResults: WebsiteAnalysisResult[];
  onSelectResult: (result: WebsiteAnalysisResult) => void;
  onClearResult: () => void;
}
