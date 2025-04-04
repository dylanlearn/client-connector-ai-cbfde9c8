
import { useState } from 'react';
import { useWebsiteAnalysis } from '@/hooks/ai-design/useWebsiteAnalysis';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WebsiteAnalyzerHeader from './WebsiteAnalyzerHeader';
import WebsiteAnalyzerTabs from './WebsiteAnalyzerTabs';
import AnalysisResult from './AnalysisResult';

/**
 * Page for analyzing website design patterns and storing them in memory
 */
const WebsiteAnalyzer = () => {
  const { analyzeWebsiteSection, analyzeWebsite, isAnalyzing, analysisResults } = useWebsiteAnalysis();
  const [currentResult, setCurrentResult] = useState<WebsiteAnalysisResult | null>(null);

  // Try to get auth context, but don't throw if it doesn't exist
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user ?? null;
  } catch (e) {
    // Auth context not available, user remains null
    console.log('Auth context not available:', e);
  }

  const handleSingleSectionAnalysis = async (
    sectionType: string,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']>,
    contentStructure: Partial<WebsiteAnalysisResult['contentStructure']>,
    websiteSource: string,
    imageUrl: string
  ) => {
    const result = await analyzeWebsiteSection(
      sectionType,
      description,
      visualElements,
      contentStructure,
      websiteSource,
      imageUrl
    );
    
    if (result) {
      setCurrentResult(result);
    }
  };

  const handleFullWebsiteAnalysis = async (
    websiteName: string,
    websiteUrl: string,
    sections: {
      type: string;
      description: string;
      visualElements?: Partial<WebsiteAnalysisResult['visualElements']>;
      contentStructure?: Partial<WebsiteAnalysisResult['contentStructure']>;
      imageUrl?: string;
    }[]
  ) => {
    const results = await analyzeWebsite(websiteName, websiteUrl, sections);
    
    if (results.length > 0) {
      setCurrentResult(results[0]);
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-6xl py-8">
        <WebsiteAnalyzerHeader isLoggedIn={!!user} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <WebsiteAnalyzerTabs
              isAnalyzing={isAnalyzing}
              onAnalyzeSingleSection={handleSingleSectionAnalysis}
              onAnalyzeFullWebsite={handleFullWebsiteAnalysis}
            />
          </div>

          <div>
            <AnalysisResult
              currentResult={currentResult}
              analysisResults={analysisResults}
              onSelectResult={setCurrentResult}
              onClearResult={() => setCurrentResult(null)}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteAnalyzer;
