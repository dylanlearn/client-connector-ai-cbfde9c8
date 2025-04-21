
import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useLayoutIntelligence } from '@/hooks/ai/use-layout-intelligence';
import { useContentGeneration } from '@/hooks/ai/use-content-generation';
import LayoutAnalysisPanel from './LayoutAnalysisPanel';
import ContentGenerationPanel from './ContentGenerationPanel';
import { Brain, X } from 'lucide-react';

interface DesignIntelligencePanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (wireframe: WireframeData) => void;
  onClose?: () => void;
  selectedSectionId?: string | null;
}

export default function DesignIntelligencePanel({
  wireframe,
  onUpdateWireframe,
  onClose,
  selectedSectionId = null
}: DesignIntelligencePanelProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('layout-analysis');
  
  const {
    isAnalyzing,
    analysisResult,
    analyzeLayout,
    applyRecommendation
  } = useLayoutIntelligence({ showToasts: true });
  
  const {
    isGenerating,
    generatedContent,
    generateWireframeContent,
    generateSectionContent,
    applyContentToWireframe
  } = useContentGeneration({ showToasts: true });
  
  // Run initial layout analysis when wireframe changes
  useEffect(() => {
    if (wireframe && wireframe.sections && wireframe.sections.length > 0) {
      analyzeLayout(wireframe);
    }
  }, [wireframe, analyzeLayout]);
  
  const handleApplyRecommendation = async (recommendationId: string) => {
    const updatedWireframe = await applyRecommendation(wireframe, recommendationId);
    if (updatedWireframe) {
      onUpdateWireframe(updatedWireframe);
    }
  };
  
  const handleGenerateContent = async () => {
    await generateWireframeContent({
      wireframeData: wireframe,
      industryContext: 'technology',
      brandVoice: 'formal',
      contentLength: 'medium'
    });
  };
  
  const handleGenerateSectionContent = async (sectionId: string) => {
    await generateSectionContent({
      wireframeData: wireframe,
      sectionId,
      industryContext: 'technology',
      brandVoice: 'formal'
    });
  };
  
  const handleApplyContent = () => {
    if (generatedContent.length > 0) {
      const updatedWireframe = applyContentToWireframe(wireframe, generatedContent);
      onUpdateWireframe(updatedWireframe);
    }
  };
  
  return (
    <div className="design-intelligence-panel bg-background border rounded-lg shadow-md w-full max-w-[450px]">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Brain className="w-5 h-5 mr-2 text-primary" />
          <h2 className="font-medium">Design Intelligence</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-4">
          AI-powered design recommendations and contextual content generation to enhance your wireframe.
        </p>
        
        <Accordion
          type="single"
          value={activeAccordion || undefined}
          onValueChange={setActiveAccordion as any}
          className="w-full"
          collapsible
        >
          <AccordionItem value="layout-analysis" className="border-0">
            <AccordionTrigger className="py-2">
              Layout Analysis & Recommendations
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                <LayoutAnalysisPanel
                  wireframe={wireframe}
                  recommendations={analysisResult?.recommendations || []}
                  score={analysisResult?.score || 0.5}
                  insightSummary={analysisResult?.insightSummary || 'Analyzing your wireframe layout...'}
                  onApplyRecommendation={handleApplyRecommendation}
                  isAnalyzing={isAnalyzing}
                  onRefreshAnalysis={() => analyzeLayout(wireframe)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="content-generation" className="border-0">
            <AccordionTrigger className="py-2">
              Contextual Content Generation
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                <ContentGenerationPanel
                  wireframe={wireframe}
                  generatedContent={generatedContent}
                  isGenerating={isGenerating}
                  onGenerateContent={handleGenerateContent}
                  onGenerateSectionContent={handleGenerateSectionContent}
                  onApplyContent={handleApplyContent}
                  selectedSectionId={selectedSectionId}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          AI Design Intelligence helps you create better wireframes through expert analysis and contextually relevant content.
        </p>
      </div>
    </div>
  );
}
