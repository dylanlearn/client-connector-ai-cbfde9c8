
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { LayoutRecommendation } from '@/services/ai/design/layout-analysis/layout-analyzer-service';

interface LayoutAnalysisPanelProps {
  wireframe: WireframeData;
  recommendations: LayoutRecommendation[];
  score: number;
  insightSummary: string;
  onApplyRecommendation: (recommendationId: string) => void;
  isAnalyzing?: boolean;
  onRefreshAnalysis: () => void;
}

export default function LayoutAnalysisPanel({
  wireframe,
  recommendations,
  score,
  insightSummary,
  onApplyRecommendation,
  isAnalyzing = false,
  onRefreshAnalysis
}: LayoutAnalysisPanelProps) {
  const recommendationsByType = {
    critical: recommendations.filter(r => r.type === 'critical'),
    improvement: recommendations.filter(r => r.type === 'improvement'),
    suggestion: recommendations.filter(r => r.type === 'suggestion')
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Layout Intelligence</CardTitle>
            <CardDescription>AI-powered layout analysis and recommendations</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getScoreVariant(score)} className="px-3 py-1">
              Score: {Math.round(score * 100)}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefreshAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">{insightSummary}</p>
        </div>
        
        {recommendations.length === 0 && !isAnalyzing && (
          <div className="text-center py-6">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">No recommendations found. Your layout looks great!</p>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="flex justify-center items-center py-6">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="h-4 w-32 mt-4 bg-muted rounded" />
              <div className="h-3 w-24 mt-2 bg-muted rounded" />
            </div>
          </div>
        )}
        
        {!isAnalyzing && recommendations.length > 0 && (
          <div className="space-y-6">
            {Object.entries(recommendationsByType).map(([type, recs]) => 
              recs.length > 0 && (
                <div key={type} className="space-y-3">
                  <h3 className="text-sm font-medium flex items-center">
                    {type === 'critical' && <AlertCircle className="w-4 h-4 mr-1 text-destructive" />}
                    {type === 'improvement' && <ArrowRight className="w-4 h-4 mr-1 text-amber-500" />}
                    {type === 'suggestion' && <Check className="w-4 h-4 mr-1 text-emerald-500" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)} ({recs.length})
                  </h3>
                  
                  {recs.map(recommendation => (
                    <RecommendationCard
                      key={recommendation.id}
                      recommendation={recommendation}
                      onApply={() => onApplyRecommendation(recommendation.id)}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-3">
        <p className="text-xs text-muted-foreground">
          Analyzing {wireframe.sections.length} sections for optimal layout
        </p>
        <p className="text-xs font-medium">
          AI Layout Intelligence v1.0
        </p>
      </CardFooter>
    </Card>
  );
}

interface RecommendationCardProps {
  recommendation: LayoutRecommendation;
  onApply: () => void;
}

function RecommendationCard({ recommendation, onApply }: RecommendationCardProps) {
  return (
    <div className="border rounded-md p-3 bg-card">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-medium">{recommendation.description}</h4>
          <p className="text-xs text-muted-foreground mt-1">{recommendation.rationale}</p>
        </div>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={onApply}
          className="whitespace-nowrap ml-2"
        >
          Apply
        </Button>
      </div>
      {recommendation.section && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            Section: {recommendation.section}
          </Badge>
        </div>
      )}
    </div>
  );
}

function getScoreVariant(score: number): 'default' | 'outline' | 'secondary' | 'destructive' {
  if (score < 0.4) return 'destructive';
  if (score < 0.7) return 'secondary';
  return 'default';
}
