
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLayoutIntelligence } from '@/hooks/ai/use-layout-intelligence';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  LayoutPanelLeft 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// Define our own LayoutRecommendation type instead of importing
export interface LayoutRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'spacing' | 'alignment' | 'hierarchy' | 'visual-balance' | 'responsiveness' | string;
  severity: 'low' | 'medium' | 'high';
  impact: number;
  before?: string;
  after?: string;
}

interface LayoutAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updatedWireframe: WireframeData) => void;
}

const LayoutAnalysisPanel: React.FC<LayoutAnalysisPanelProps> = ({ 
  wireframe, 
  onUpdateWireframe 
}) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<LayoutRecommendation | null>(null);
  
  const {
    isAnalyzing,
    analysisResult,
    error,
    analyzeLayout,
    applyRecommendation
  } = useLayoutIntelligence();
  
  const handleAnalyze = async () => {
    await analyzeLayout(wireframe);
  };
  
  const handleApplyRecommendation = async (recommendation: LayoutRecommendation) => {
    const result = await applyRecommendation(wireframe, recommendation);
    if (result) {
      onUpdateWireframe(result);
    }
  };
  
  const getColorForScore = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <LayoutPanelLeft className="mr-2 h-5 w-5" />
          Layout Analysis
        </CardTitle>
        <CardDescription>
          Analyze layout for balance, alignment, and visual hierarchy
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysisResult && (
          <Button 
            onClick={handleAnalyze} 
            className="w-full mb-4"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Layout...
              </>
            ) : (
              <>Analyze Layout</>
            )}
          </Button>
        )}
        
        {isAnalyzing && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        )}
        
        {analysisResult && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Visual Balance</div>
                <Progress value={analysisResult.scores.visualBalance} className="h-2" />
                <div className={`text-xs font-semibold ${getColorForScore(analysisResult.scores.visualBalance)}`}>
                  {analysisResult.scores.visualBalance}/100
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Alignment</div>
                <Progress value={analysisResult.scores.alignment} className="h-2" />
                <div className={`text-xs font-semibold ${getColorForScore(analysisResult.scores.alignment)}`}>
                  {analysisResult.scores.alignment}/100
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Hierarchy</div>
                <Progress value={analysisResult.scores.hierarchy} className="h-2" />
                <div className={`text-xs font-semibold ${getColorForScore(analysisResult.scores.hierarchy)}`}>
                  {analysisResult.scores.hierarchy}/100
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Layout Recommendations</h3>
              {analysisResult.recommendations.length === 0 ? (
                <div className="p-4 bg-green-50 rounded-md flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <p>Great job! No layout improvements needed.</p>
                </div>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {analysisResult.recommendations.map((recommendation) => (
                      <Card 
                        key={recommendation.id}
                        className={`cursor-pointer border ${selectedRecommendation?.id === recommendation.id ? 'border-primary' : ''}`}
                        onClick={() => setSelectedRecommendation(recommendation)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{recommendation.title}</h4>
                              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                            </div>
                            <Badge 
                              variant={
                                recommendation.severity === 'high' ? 'destructive' : 
                                recommendation.severity === 'medium' ? 'default' : 'outline'
                              }
                            >
                              {recommendation.severity}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
            
            {selectedRecommendation && (
              <div className="space-y-3">
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Selected Recommendation</h3>
                  <div className="p-3 border rounded-md">
                    <h4 className="font-medium">{selectedRecommendation.title}</h4>
                    <p className="text-sm mb-3">{selectedRecommendation.description}</p>
                    <Button 
                      onClick={() => handleApplyRecommendation(selectedRecommendation)}
                      size="sm"
                    >
                      Apply This Recommendation
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleAnalyze} 
                size="sm"
                disabled={isAnalyzing}
              >
                Re-analyze
              </Button>
              
              {analysisResult.recommendations.length > 0 && (
                <Button 
                  variant="default"
                  onClick={() => {
                    // Apply all recommendations one by one
                    const applyAllSequentially = async () => {
                      let currentWireframe = wireframe;
                      
                      for (const recommendation of analysisResult.recommendations) {
                        const result = await applyRecommendation(currentWireframe, recommendation);
                        if (result) {
                          currentWireframe = result;
                        }
                      }
                      
                      onUpdateWireframe(currentWireframe);
                    };
                    
                    applyAllSequentially();
                  }}
                  size="sm"
                >
                  Apply All Recommendations
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LayoutAnalysisPanel;
