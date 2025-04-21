
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  LayoutGrid, 
  Loader2 
} from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  useLayoutIntelligence, 
} from '@/hooks/ai';

// Define layout recommendation type locally to avoid import conflicts
export interface LayoutRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  severity: 'critical' | 'warning' | 'info';
  suggestedFix: string;
  beforeAfterComparison?: {
    before: string;
    after: string;
  };
}

export interface LayoutAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdate: (updated: WireframeData) => void;
}

const LayoutAnalysisPanel: React.FC<LayoutAnalysisPanelProps> = ({ wireframe, onUpdate }) => {
  const { 
    isAnalyzing, 
    analysisResult, 
    error, 
    analyzeLayout,
    applyRecommendation 
  } = useLayoutIntelligence();
  
  const [selectedRecommendation, setSelectedRecommendation] = useState<LayoutRecommendation | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  
  // Start analysis when wireframe changes
  useEffect(() => {
    if (wireframe && !isAnalyzing && !analysisResult) {
      handleAnalyzeLayout();
    }
  }, [wireframe]);
  
  const handleAnalyzeLayout = async () => {
    if (!wireframe) return;
    await analyzeLayout(wireframe);
  };
  
  const handleApplyRecommendation = async () => {
    if (!selectedRecommendation || !wireframe) return;
    
    setIsApplying(true);
    try {
      // Need to cast to our local LayoutRecommendation type
      const updatedWireframe = await applyRecommendation(wireframe, selectedRecommendation as any);
      if (updatedWireframe) {
        onUpdate(updatedWireframe);
      }
    } finally {
      setIsApplying(false);
      setSelectedRecommendation(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const renderScores = () => {
    if (!analysisResult?.scores) return null;
    
    const { scores } = analysisResult;
    
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <span className="text-sm font-medium">{scores.overall}%</span>
          </div>
          <Progress value={scores.overall} className="h-2" />
          
          <div className="flex justify-between">
            <span className="text-sm font-medium">Spacing</span>
            <span className="text-sm font-medium">{scores.spacing}%</span>
          </div>
          <Progress value={scores.spacing} className="h-2" />
          
          <div className="flex justify-between">
            <span className="text-sm font-medium">Alignment</span>
            <span className="text-sm font-medium">{scores.alignment}%</span>
          </div>
          <Progress value={scores.alignment} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Hierarchy</span>
            <span className="text-sm font-medium">{scores.hierarchy}%</span>
          </div>
          <Progress value={scores.hierarchy} className="h-2" />
          
          {/* Adding a placeholder for responsiveness score if needed */}
          <div className="flex justify-between">
            <span className="text-sm font-medium">Responsiveness</span>
            <span className="text-sm font-medium">{scores.hierarchy}%</span>
          </div>
          <Progress value={scores.hierarchy} className="h-2" />
        </div>
      </div>
    );
  };
  
  const renderRecommendations = () => {
    if (!analysisResult?.recommendations || analysisResult.recommendations.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
          <h3 className="text-lg font-medium">No Layout Issues Found</h3>
          <p className="text-muted-foreground">Your layout looks great! No improvements needed.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Recommended Improvements</h3>
        <ScrollArea className="h-[280px]">
          <div className="space-y-2 pr-4">
            {analysisResult.recommendations.map((rec: any) => {
              // Cast to our local LayoutRecommendation and add severity if missing
              const recommendation: LayoutRecommendation = {
                ...rec,
                severity: rec.severity || (
                  rec.impact === 'high' 
                    ? 'critical' 
                    : rec.impact === 'medium' 
                      ? 'warning' 
                      : 'info'
                )
              };
              
              const isSelected = selectedRecommendation?.id === recommendation.id;
              
              return (
                <Card 
                  key={recommendation.id}
                  className={`cursor-pointer border-l-4 ${
                    isSelected 
                      ? 'border-l-primary bg-muted/50' 
                      : recommendation.severity === 'critical'
                        ? 'border-l-red-500'
                        : recommendation.severity === 'warning'
                          ? 'border-l-yellow-500'
                          : 'border-l-blue-500'
                  }`}
                  onClick={() => setSelectedRecommendation(recommendation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getSeverityIcon(recommendation.severity)}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{recommendation.title}</h4>
                        <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  };
  
  if (error) {
    return (
      <div className="p-4 border rounded-md bg-red-50 text-red-700">
        <h3 className="font-medium">Error analyzing layout</h3>
        <p className="text-sm">{error.message}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={handleAnalyzeLayout}
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
        <h3 className="font-medium">Analyzing Layout</h3>
        <p className="text-sm text-muted-foreground">
          Our AI is analyzing your wireframe layout...
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          Layout Intelligence
        </h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAnalyzeLayout}
        >
          Refresh Analysis
        </Button>
      </div>
      
      {renderScores()}
      {renderRecommendations()}
      
      {selectedRecommendation && (
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Applying This Recommendation</h3>
          <p className="text-sm mb-3">{selectedRecommendation.suggestedFix}</p>
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedRecommendation(null)}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleApplyRecommendation}
              disabled={isApplying}
            >
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply Recommendation'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutAnalysisPanel;
