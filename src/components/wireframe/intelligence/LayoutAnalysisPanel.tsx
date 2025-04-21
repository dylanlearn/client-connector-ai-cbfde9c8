
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { LayoutRecommendation } from '@/services/ai/design/layout-analysis/layout-analyzer-service';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowUpRight, AlertTriangle, ThumbsUp, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface LayoutAnalysisPanelProps {
  wireframe: WireframeData;
  recommendations: LayoutRecommendation[];
  score: number;
  insightSummary: string;
  onApplyRecommendation: (recommendationId: string) => void;
  onRefreshAnalysis: () => void;
  isAnalyzing: boolean;
}

export default function LayoutAnalysisPanel({
  wireframe,
  recommendations,
  score,
  insightSummary,
  onApplyRecommendation,
  onRefreshAnalysis,
  isAnalyzing
}: LayoutAnalysisPanelProps) {
  // Function to get appropriate color based on score
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Function to get appropriate color for the progress bar
  const getProgressColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Function to get severity badge for recommendations
  const getSeverityBadge = (severity: string) => {
    const badgeStyles: Record<string, any> = {
      high: { variant: 'destructive', icon: <AlertTriangle className="h-3 w-3 mr-1" /> },
      medium: { variant: 'outline', icon: null },
      low: { variant: 'secondary', icon: null },
      positive: { variant: 'default', icon: <ThumbsUp className="h-3 w-3 mr-1" /> },
    };
    
    const style = badgeStyles[severity.toLowerCase()] || badgeStyles.medium;
    
    return (
      <Badge variant={style.variant as any} className="ml-2 flex items-center">
        {style.icon}
        {severity}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Layout Score and Summary */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Layout Analysis</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefreshAnalysis} 
            disabled={isAnalyzing}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {isAnalyzing ? (
          <div className="h-[50px] flex items-center justify-center">
            <div className="animate-pulse flex gap-2 items-center">
              <div className="h-4 w-4 rounded-full bg-primary animate-bounce"></div>
              <span className="text-sm text-muted-foreground">Analyzing layout...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Progress value={score * 100} className={getProgressColor(score)} />
              </div>
              <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                {Math.round(score * 100)}%
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground">{insightSummary}</p>
          </>
        )}
      </div>
      
      <Separator />
      
      {/* Recommendations */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center">
          <Sparkles className="h-3 w-3 mr-1 text-primary" />
          Layout Recommendations 
          <span className="text-xs text-muted-foreground ml-2">
            ({recommendations.length})
          </span>
        </h3>
        
        {isAnalyzing ? (
          <div className="space-y-2">
            <div className="h-20 border rounded-md animate-pulse bg-muted/20"></div>
            <div className="h-20 border rounded-md animate-pulse bg-muted/20"></div>
          </div>
        ) : recommendations.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {recommendations.map((recommendation) => (
                <div 
                  key={recommendation.id}
                  className="border rounded-md p-3 hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium">{recommendation.title}</h4>
                        {getSeverityBadge(recommendation.severity)}
                      </div>
                      <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={() => onApplyRecommendation(recommendation.id)}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="sr-only">Apply</span>
                    </Button>
                  </div>
                  
                  {recommendation.affectedSections && recommendation.affectedSections.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {recommendation.affectedSections.map((sectionId) => {
                        const section = wireframe.sections.find(s => s.id === sectionId);
                        return section ? (
                          <Badge variant="outline" key={sectionId} className="text-xs">
                            {section.name || section.sectionType}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-[100px] border rounded-md flex items-center justify-center text-center p-4">
            <div className="text-sm text-muted-foreground">
              No recommendations found. Your layout looks good!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
