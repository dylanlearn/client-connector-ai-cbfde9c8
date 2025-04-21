
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import useDesignPrincipleAnalysis from '@/hooks/ai/use-design-principle-analysis';
import { CompositionPrinciple, PrincipleScore } from '@/services/ai/design/principle-analysis/types';

interface DesignPrincipleAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const DesignPrincipleAnalysisPanel: React.FC<DesignPrincipleAnalysisPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const { 
    isAnalyzing, 
    analysisResult, 
    analyzeDesignPrinciples,
    applyPrincipleImprovement 
  } = useDesignPrincipleAnalysis();
  
  const [selectedPrinciples, setSelectedPrinciples] = useState<CompositionPrinciple[]>([
    'ruleOfThirds',
    'goldenRatio',
    'visualBalance',
    'contrast',
    'alignment'
  ]);

  useEffect(() => {
    // Run analysis when panel is first loaded
    if (!analysisResult && wireframe) {
      analyzeDesignPrinciples(wireframe, selectedPrinciples);
    }
  }, [wireframe, analyzeDesignPrinciples, analysisResult, selectedPrinciples]);

  const handleAnalyze = () => {
    analyzeDesignPrinciples(wireframe, selectedPrinciples);
  };

  const handleApplyImprovement = async (principle: CompositionPrinciple) => {
    const updatedWireframe = await applyPrincipleImprovement(wireframe, principle);
    if (updatedWireframe) {
      onUpdateWireframe(updatedWireframe);
    }
  };

  const renderScoreIndicator = (score: number) => {
    if (score >= 80) {
      return (
        <div className="flex items-center text-green-500">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          <span>Good</span>
        </div>
      );
    } else if (score >= 60) {
      return (
        <div className="flex items-center text-amber-500">
          <Info className="h-4 w-4 mr-1" />
          <span>Needs Improvement</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-500">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>Poor</span>
        </div>
      );
    }
  };

  const renderPrincipleItem = (principle: PrincipleScore) => {
    return (
      <AccordionItem key={principle.principle} value={principle.principle}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-2">
            <div className="font-medium">
              {formatPrincipleName(principle.principle)}
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={principle.score} className="w-20 h-2" />
              <span className="text-sm">{principle.score}/100</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm">
          <div className="space-y-3">
            <p>{principle.feedback}</p>
            
            <div>
              <strong className="block mb-1 text-xs text-muted-foreground">Suggestions:</strong>
              <ul className="list-disc pl-4 space-y-1">
                {principle.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
            
            <Button 
              size="sm" 
              onClick={() => handleApplyImprovement(principle.principle)}
              disabled={isAnalyzing}
            >
              Apply Improvements
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const formatPrincipleName = (principle: string): string => {
    switch (principle) {
      case 'ruleOfThirds': return 'Rule of Thirds';
      case 'goldenRatio': return 'Golden Ratio';
      case 'visualBalance': return 'Visual Balance';
      default:
        // Convert camelCase to Title Case
        return principle
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
    }
  };

  return (
    <div className="design-principle-analysis-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Design Principle Analysis</h3>
        <Button 
          size="sm" 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Design'}
        </Button>
      </div>

      {isAnalyzing ? (
        <div className="py-8 text-center">
          <div className="animate-pulse mb-2">Analyzing design principles...</div>
          <Progress value={undefined} className="w-full h-2" />
        </div>
      ) : analysisResult ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-muted rounded-md p-3">
            <div>
              <div className="text-sm font-medium">Overall Score</div>
              <div className="text-2xl font-bold">{analysisResult.overallScore}/100</div>
            </div>
            {renderScoreIndicator(analysisResult.overallScore)}
          </div>
          
          <div className="text-sm">{analysisResult.summary}</div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Top Issues</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {analysisResult.topIssues.map((issue, idx) => (
                <li key={idx} className="text-red-600">{issue}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Top Strengths</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {analysisResult.topStrengths.map((strength, idx) => (
                <li key={idx} className="text-green-600">{strength}</li>
              ))}
            </ul>
          </div>
          
          <Separator className="my-4" />
          
          <h4 className="text-sm font-medium">Principle Analysis</h4>
          <Accordion type="single" collapsible className="w-full">
            {analysisResult.principleScores.map(renderPrincipleItem)}
          </Accordion>
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          Click "Analyze Design" to evaluate this wireframe against design principles
        </div>
      )}
    </div>
  );
};

export default DesignPrincipleAnalysisPanel;
