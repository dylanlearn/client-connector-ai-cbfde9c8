
import React, { useState } from 'react';
import { useDesignPrincipleAnalysis } from '@/hooks/ai';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CompositionPrinciple, 
  PrincipleScore
} from '@/services/ai/design/principle-analysis/types';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface DesignPrincipleAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const DesignPrincipleAnalysisPanel: React.FC<DesignPrincipleAnalysisPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const { isAnalyzing, analysisResult, error, analyzeDesignPrinciples, applyPrincipleImprovement } = useDesignPrincipleAnalysis();
  const [selectedPrinciple, setSelectedPrinciple] = useState<CompositionPrinciple | null>(null);
  
  const handleAnalyze = async () => {
    await analyzeDesignPrinciples(wireframe);
  };
  
  const handleApplyImprovement = async (principle: CompositionPrinciple) => {
    setSelectedPrinciple(principle);
    const updatedWireframe = await applyPrincipleImprovement(wireframe, principle);
    if (updatedWireframe) {
      onUpdateWireframe(updatedWireframe);
    }
    setSelectedPrinciple(null);
  };
  
  const renderPrincipleScore = (principleScore: PrincipleScore) => {
    const { principle, score, feedback, suggestions } = principleScore;
    const displayName = principle.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    
    return (
      <Card key={principle} className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex justify-between items-center">
            {displayName}
            <span className="text-xs font-normal">
              Score: {score}/100
            </span>
          </CardTitle>
          <Progress value={score} className="h-2" />
        </CardHeader>
        <CardContent className="pt-0 text-sm">
          <p className="mb-2">{feedback}</p>
          {suggestions.length > 0 && (
            <div>
              <p className="font-medium mb-1">Suggestions:</p>
              <ul className="list-disc pl-5">
                {suggestions.map((suggestion, i) => (
                  <li key={i} className="text-xs">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          <Button 
            size="sm" 
            className="mt-2" 
            variant="outline"
            disabled={isAnalyzing || selectedPrinciple === principle}
            onClick={() => handleApplyImprovement(principle as CompositionPrinciple)}
          >
            {selectedPrinciple === principle ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Applying
              </>
            ) : (
              'Apply Improvement'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="design-principle-analysis">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      
      {!analysisResult && !isAnalyzing && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Analyze this design for adherence to composition principles like rule of thirds, visual balance, and more.
          </p>
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            Analyze Design Principles
          </Button>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Analyzing design principles...</p>
        </div>
      )}
      
      {analysisResult && !isAnalyzing && (
        <ScrollArea className="h-[500px] pr-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Overall Score</h3>
              <span className="font-medium">{analysisResult.overallScore}/100</span>
            </div>
            <Progress value={analysisResult.overallScore} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
          </div>
          
          {analysisResult.topStrengths.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Top Strengths
              </h3>
              <ul className="list-disc pl-5 mt-1">
                {analysisResult.topStrengths.map((strength, i) => (
                  <li key={i} className="text-sm">{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {analysisResult.topIssues.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium flex items-center">
                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="list-disc pl-5 mt-1">
                {analysisResult.topIssues.map((issue, i) => (
                  <li key={i} className="text-sm">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          <h3 className="font-medium mb-4">Principle Breakdown</h3>
          {analysisResult.principleScores.map(renderPrincipleScore)}
          
          <div className="flex justify-center mt-4">
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              Re-analyze Design
            </Button>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default DesignPrincipleAnalysisPanel;
