
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLayoutIntelligence } from '@/hooks/ai/use-layout-intelligence';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { BarChart3, Check, LayoutGrid, Lightbulb } from 'lucide-react';

interface LayoutAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdate: (updated: WireframeData) => void;
}

const LayoutAnalysisPanel: React.FC<LayoutAnalysisPanelProps> = ({
  wireframe,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  
  const {
    isAnalyzing,
    layoutAnalysis,
    analysisResult,
    error,
    analyzeLayout,
    applyRecommendation
  } = useLayoutIntelligence({ showToasts: true });

  useEffect(() => {
    // Run analysis when component mounts if not already analyzed
    if (!analysisResult && !isAnalyzing) {
      analyzeLayout(wireframe);
    }
  }, [wireframe, analyzeLayout, analysisResult, isAnalyzing]);

  const handleApplyRecommendation = async (recommendationId: string) => {
    const updatedWireframe = await applyRecommendation(wireframe, recommendationId);
    onUpdate(updatedWireframe);
    setSelectedRecommendation(null);
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-4 p-4">
        <p className="text-center text-muted-foreground">Analyzing layout...</p>
        <Progress value={65} className="w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Error analyzing layout: {error.message}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => analyzeLayout(wireframe)}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!layoutAnalysis) {
    return (
      <div className="p-4 text-center">
        <Button onClick={() => analyzeLayout(wireframe)}>
          Analyze Layout
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Layout Score</h3>
            <span className="text-2xl font-bold">{layoutAnalysis.overallScore}%</span>
          </div>
          <Progress value={layoutAnalysis.overallScore} className="w-full" />
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Spacing</span>
                <span className="text-sm font-medium">{layoutAnalysis.spacingScore}%</span>
              </div>
              <Progress value={layoutAnalysis.spacingScore} className="w-full h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Hierarchy</span>
                <span className="text-sm font-medium">{layoutAnalysis.hierarchyScore}%</span>
              </div>
              <Progress value={layoutAnalysis.hierarchyScore} className="w-full h-2" />
            </div>
          </div>
          
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Consistency</span>
              <span className="text-sm font-medium">{layoutAnalysis.consistencyScore}%</span>
            </div>
            <Progress value={layoutAnalysis.consistencyScore} className="w-full h-2" />
          </div>
          
          <div className="bg-muted rounded-md p-3 mt-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-medium">Layout Balance: </span>
              <span>{layoutAnalysis.layoutBalance}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4 pt-2">
          {layoutAnalysis.sections.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{section.name}</h4>
                  <span className="font-semibold">{section.score}%</span>
                </div>
                <Progress value={section.score} className="w-full h-2 my-2" />
                
                {section.issues.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-muted-foreground">Issues</h5>
                    <ul className="text-sm">
                      {section.issues.map((issue, i) => (
                        <li key={i} className="mt-1">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {section.strengths.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-muted-foreground">Strengths</h5>
                    <ul className="text-sm">
                      {section.strengths.map((strength, i) => (
                        <li key={i} className="mt-1 flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4 pt-2">
          {layoutAnalysis.recommendations && layoutAnalysis.recommendations.length > 0 ? (
            <div className="space-y-2">
              {layoutAnalysis.recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className={`cursor-pointer ${selectedRecommendation === rec.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedRecommendation(rec.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{rec.title}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{rec.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Impact: {rec.impact}</p>
                      </div>
                    </div>
                    {selectedRecommendation === rec.id && (
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => handleApplyRecommendation(rec.id)}
                      >
                        Apply Recommendation
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-muted rounded-md">
              <LayoutGrid className="h-10 w-10 text-primary mx-auto mb-2" />
              <p>No layout recommendations available.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => analyzeLayout(wireframe)}
          disabled={isAnalyzing}
        >
          Re-analyze
        </Button>
      </div>
    </div>
  );
};

export default LayoutAnalysisPanel;
