
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle,
  CheckCircle2, 
  ArrowRight,
  Layout, 
  Grid,
  AlignVerticalJustifyCenter,
  ArrowDownUp
} from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useLayoutIntelligence } from '@/hooks/ai/use-layout-intelligence';
import { LayoutRecommendation } from '@/components/wireframe/intelligence/LayoutAnalysisPanel';
import { cn } from '@/lib/utils';

export interface LayoutRecommendation {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
  impact: 'high' | 'medium' | 'low';
  category: 'spacing' | 'alignment' | 'hierarchy' | 'visual-balance' | 'responsiveness';
}

interface LayoutAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const LayoutAnalysisPanel: React.FC<LayoutAnalysisPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const { 
    isAnalyzing, 
    analysisResult, 
    analyzeLayout,
    applyRecommendation
  } = useLayoutIntelligence();
  
  const [selectedRecommendation, setSelectedRecommendation] = useState<LayoutRecommendation | null>(null);
  const [activeTab, setActiveTab] = useState('recommendations');
  
  useEffect(() => {
    if (!analysisResult && !isAnalyzing) {
      analyzeLayout(wireframe);
    }
  }, [analysisResult, isAnalyzing, analyzeLayout, wireframe]);
  
  const handleSelectRecommendation = (recommendation: LayoutRecommendation) => {
    setSelectedRecommendation(recommendation);
    setActiveTab('details');
  };
  
  const handleApplyRecommendation = async () => {
    if (!selectedRecommendation) return;
    
    const updated = await applyRecommendation(wireframe, selectedRecommendation);
    if (updated) {
      onUpdateWireframe(updated);
    }
  };
  
  // Calculate scores based on recommendations
  const calculateScores = () => {
    if (!analysisResult) return { overall: 0, spacing: 0, alignment: 0, hierarchy: 0 };
    
    // Calculate scores (0-100) - fewer issues = higher score
    const maxIssuesByCategory = 3; // Assuming 3 issues is the worst case per category
    
    const issuesByType = {
      spacing: analysisResult.recommendations.filter(r => r.category === 'spacing').length,
      alignment: analysisResult.recommendations.filter(r => r.category === 'alignment').length,
      hierarchy: analysisResult.recommendations.filter(r => r.category === 'hierarchy').length
    };
    
    const spacingScore = Math.max(0, 100 - (issuesByType.spacing / maxIssuesByCategory * 100));
    const alignmentScore = Math.max(0, 100 - (issuesByType.alignment / maxIssuesByCategory * 100));
    const hierarchyScore = Math.max(0, 100 - (issuesByType.hierarchy / maxIssuesByCategory * 100));
    
    // Overall score is weighted average
    const weights = { spacing: 0.3, alignment: 0.3, hierarchy: 0.4 };
    const overall = Math.round(
      (spacingScore * weights.spacing) + 
      (alignmentScore * weights.alignment) + 
      (hierarchyScore * weights.hierarchy)
    );
    
    return {
      overall,
      spacing: Math.round(spacingScore),
      alignment: Math.round(alignmentScore),
      hierarchy: Math.round(hierarchyScore)
    };
  };
  
  const scores = calculateScores();
  
  // Get icon for recommendation category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spacing':
        return <Grid className="h-4 w-4" />;
      case 'alignment':
        return <AlignVerticalJustifyCenter className="h-4 w-4" />;
      case 'hierarchy':
        return <ArrowDownUp className="h-4 w-4" />;
      case 'visual-balance':
        return <Layout className="h-4 w-4" />;
      default:
        return <Layout className="h-4 w-4" />;
    }
  };
  
  const renderRecommendationsList = () => {
    if (!analysisResult) return null;
    
    return (
      <div className="space-y-4">
        {analysisResult.recommendations.length === 0 ? (
          <div className="text-center p-4 border rounded-lg bg-green-50">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
            <h3 className="font-medium">Great Layout!</h3>
            <p className="text-muted-foreground mt-1">No layout improvements needed.</p>
          </div>
        ) : analysisResult.recommendations.map(recommendation => (
          <Card 
            key={recommendation.id}
            className={cn(
              "cursor-pointer hover:border-primary/50",
              selectedRecommendation?.id === recommendation.id && "border-primary"
            )}
            onClick={() => handleSelectRecommendation(recommendation)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className={cn(
                "p-1.5 rounded-full",
                recommendation.impact === 'high' ? "bg-red-100" :
                recommendation.impact === 'medium' ? "bg-amber-100" : "bg-blue-100"
              )}>
                {getCategoryIcon(recommendation.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{recommendation.title}</h4>
                  <Badge variant={
                    recommendation.impact === 'high' ? "destructive" :
                    recommendation.impact === 'medium' ? "default" : "outline"
                  }>
                    {recommendation.impact} impact
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  {recommendation.description.substring(0, 100)}...
                </p>
                <div className="flex text-xs text-muted-foreground mt-2">
                  <span className="bg-slate-100 px-2 py-0.5 rounded capitalize">
                    {recommendation.category.replace('-', ' ')}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderRecommendationDetail = () => {
    if (!selectedRecommendation) {
      return (
        <div className="text-center p-8">
          <Layout className="mx-auto h-12 w-12 text-slate-300 mb-2" />
          <p className="text-muted-foreground">Select a recommendation to see details</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg flex items-center">
          <span className={cn(
            "p-1 rounded-full mr-2",
            selectedRecommendation.impact === 'high' ? "bg-red-100" :
            selectedRecommendation.impact === 'medium' ? "bg-amber-100" : "bg-blue-100"
          )}>
            {getCategoryIcon(selectedRecommendation.category)}
          </span>
          {selectedRecommendation.title}
        </h3>
        
        <p>{selectedRecommendation.description}</p>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <h4 className="text-sm font-medium mb-2">Before</h4>
            <div className="aspect-video bg-slate-100 rounded-lg border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Before preview</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">After</h4>
            <div className="aspect-video bg-slate-100 rounded-lg border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">After preview</p>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={handleApplyRecommendation}
        >
          Apply This Recommendation
        </Button>
      </div>
    );
  };
  
  const renderScorecard = () => {
    return (
      <div className="space-y-4">
        <div className="text-center p-4">
          <div className="relative inline-block">
            <Progress value={scores.overall} className="h-2 w-40" />
            <span className="absolute top-3 left-0 right-0 text-center text-sm font-medium">
              {scores.overall}% Overall
            </span>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Spacing</span>
                <span className="text-sm text-muted-foreground">{scores.spacing}%</span>
              </div>
              <Progress value={scores.spacing} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Alignment</span>
                <span className="text-sm text-muted-foreground">{scores.alignment}%</span>
              </div>
              <Progress value={scores.alignment} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Hierarchy</span>
                <span className="text-sm text-muted-foreground">{scores.hierarchy}%</span>
              </div>
              <Progress value={scores.hierarchy} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Layout Analysis</h4>
          <p className="text-sm text-muted-foreground">
            {analysisResult?.summary || 
              "This wireframe has been analyzed for layout effectiveness, including spacing, alignment, and visual hierarchy."}
          </p>
        </div>
      </div>
    );
  };
  
  if (isAnalyzing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Layout Analysis</h3>
          <Skeleton className="h-8 w-24" />
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Layout Analysis</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => analyzeLayout(wireframe)}
          disabled={isAnalyzing}
        >
          Analyze Again
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="recommendations" className="flex-1">Recommendations</TabsTrigger>
          <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
          <TabsTrigger value="scorecard" className="flex-1">Scorecard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations">
          {renderRecommendationsList()}
        </TabsContent>
        
        <TabsContent value="details">
          {renderRecommendationDetail()}
        </TabsContent>
        
        <TabsContent value="scorecard">
          {renderScorecard()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LayoutAnalysisPanel;
