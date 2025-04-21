
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { useLayoutIntelligence } from '@/hooks/ai/use-layout-intelligence';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

// Define our local LayoutRecommendation interface that includes the severity property
interface LayoutRecommendation {
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

interface LayoutAnalysisPanelProps {
  wireframe: WireframeData;
  onApplyRecommendation: (updatedWireframe: WireframeData) => void;
}

const LayoutAnalysisPanel: React.FC<LayoutAnalysisPanelProps> = ({ wireframe, onApplyRecommendation }) => {
  const { analyzeLayout, applyRecommendation, isAnalyzing, analysisResult, error } = useLayoutIntelligence();
  const [selectedRecommendation, setSelectedRecommendation] = useState<LayoutRecommendation | null>(null);

  const handleAnalyzeLayout = async () => {
    await analyzeLayout(wireframe);
  };

  const handleApplyRecommendation = async () => {
    if (!selectedRecommendation) return;
    
    const result = await applyRecommendation(wireframe, selectedRecommendation);
    if (result) {
      onApplyRecommendation(result);
    }
  };

  // Function to map the service's LayoutRecommendation to our local interface
  const mapRecommendation = (recommendation: any): LayoutRecommendation => {
    return {
      ...recommendation,
      // Add a default severity based on impact if not present
      severity: recommendation.impact === 'high' ? 'critical' : 
               recommendation.impact === 'medium' ? 'warning' : 'info'
    };
  };

  // Map the recommendations to our local interface
  const recommendations = useMemo(() => {
    if (!analysisResult || !analysisResult.recommendations) return [];
    return analysisResult.recommendations.map(mapRecommendation);
  }, [analysisResult]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Layout Analysis</CardTitle>
        <CardDescription>Analyze your wireframe layout for better user experience</CardDescription>
      </CardHeader>

      <CardContent>
        {!analysisResult ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-muted-foreground">
              Analyze your wireframe layout to get recommendations on improving spacing, alignment, hierarchy, and balance.
            </p>
            <Button 
              onClick={handleAnalyzeLayout}
              disabled={isAnalyzing}
              className="w-full sm:w-auto"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : 'Analyze Layout'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
            
              <TabsContent value="overview">
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="text-sm font-medium mb-2">Overall Layout Score</h3>
                    <div className="flex items-center space-x-2">
                      <Progress value={analysisResult.scores.overall} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{analysisResult.scores.overall}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="text-sm font-medium mb-2">Spacing</h4>
                      <Progress value={analysisResult.scores.spacing} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {analysisResult.scores.spacing < 70 ? 
                          'Consider improving spacing between elements' : 
                          'Good spacing consistency'}
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="text-sm font-medium mb-2">Alignment</h4>
                      <Progress value={analysisResult.scores.alignment} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {analysisResult.scores.alignment < 70 ? 
                          'Elements could be better aligned' : 
                          'Good alignment throughout'}
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="text-sm font-medium mb-2">Hierarchy</h4>
                      <Progress value={analysisResult.scores.hierarchy} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {analysisResult.scores.hierarchy < 70 ? 
                          'Visual hierarchy needs attention' : 
                          'Clear visual hierarchy'}
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="text-sm font-medium mb-2">Visual Balance</h4>
                      <Progress 
                        value={analysisResult.scores.responsiveness || 0} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {(analysisResult.scores.responsiveness || 0) < 70 ? 
                          'Balance of elements could be improved' : 
                          'Good visual balance'}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations">
                <div className="space-y-4">
                  {recommendations.length === 0 ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription>No issues found. Your layout follows best practices!</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {recommendations.map((recommendation) => (
                        <Collapsible key={recommendation.id} className="border rounded-lg">
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                            <div className="flex items-center space-x-2">
                              <Badge variant={
                                recommendation.severity === 'critical' ? 'destructive' : 
                                recommendation.severity === 'warning' ? 'default' : 'secondary'
                              }>
                                {recommendation.severity}
                              </Badge>
                              <span className="font-medium">{recommendation.title}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="p-4 pt-0 border-t space-y-3">
                            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                            <div>
                              <h4 className="text-xs font-medium mb-1">Suggested Fix:</h4>
                              <p className="text-sm">{recommendation.suggestedFix}</p>
                            </div>
                            
                            <Button 
                              onClick={() => setSelectedRecommendation(recommendation)}
                              variant="outline" 
                              className="w-full mt-2"
                            >
                              Select This Recommendation
                            </Button>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {selectedRecommendation && (
              <div className="mt-6 space-y-4">
                <Alert className="bg-muted">
                  <div className="space-y-2">
                    <p className="font-medium">Selected recommendation: {selectedRecommendation.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedRecommendation.description}</p>
                  </div>
                </Alert>
                
                <Button 
                  onClick={handleApplyRecommendation}
                  className="w-full"
                >
                  Apply Selected Recommendation
                </Button>
              </div>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <p className="text-xs text-muted-foreground">
          The layout analyzer evaluates spacing, alignment, hierarchy, and balance to ensure your design follows best practices.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LayoutAnalysisPanel;
