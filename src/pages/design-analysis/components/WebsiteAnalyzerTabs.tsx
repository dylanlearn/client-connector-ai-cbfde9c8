
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';
import SingleSectionForm from './SingleSectionForm';
import FullWebsiteForm from './FullWebsiteForm';
import { Section } from './types';

interface WebsiteAnalyzerTabsProps {
  isAnalyzing: boolean;
  onAnalyzeSingleSection: (
    sectionType: string,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']>,
    contentStructure: Partial<WebsiteAnalysisResult['contentStructure']>,
    websiteSource: string,
    imageUrl: string
  ) => Promise<void>;
  onAnalyzeFullWebsite: (
    websiteName: string,
    websiteUrl: string,
    sections: Section[]
  ) => Promise<void>;
}

const WebsiteAnalyzerTabs = ({ 
  isAnalyzing, 
  onAnalyzeSingleSection, 
  onAnalyzeFullWebsite 
}: WebsiteAnalyzerTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>('single-section');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 mb-8">
        <TabsTrigger value="single-section" className="text-sm">
          Single Section Analysis
        </TabsTrigger>
        <TabsTrigger value="full-website" className="text-sm">
          Full Website Analysis
        </TabsTrigger>
      </TabsList>

      <TabsContent value="single-section">
        <SingleSectionForm
          isAnalyzing={isAnalyzing}
          onSubmit={onAnalyzeSingleSection}
        />
      </TabsContent>

      <TabsContent value="full-website">
        <FullWebsiteForm
          isAnalyzing={isAnalyzing}
          onSubmit={onAnalyzeFullWebsite}
        />
      </TabsContent>
    </Tabs>
  );
};

export default WebsiteAnalyzerTabs;
