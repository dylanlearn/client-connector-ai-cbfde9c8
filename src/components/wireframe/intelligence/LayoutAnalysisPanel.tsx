
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, RefreshCw, Check, BarChart, AlertCircle } from 'lucide-react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { useLayoutIntelligence } from '@/hooks/ai/use-layout-intelligence';

// Define type for layout recommendations with required properties
export interface LayoutRecommendation {
  id: string;
  title: string; // Added to fix the error
  description: string;
  severity: 'low' | 'medium' | 'high'; // Added to fix the error
  category: string;
  affectedSections: string[]; // Added to fix the error
  suggestedFix?: string;
  beforeAfterComparison?: string;
}

export interface LayoutAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const LayoutAnalysisPanel: React.FC<LayoutAnalysisPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  
  const { 
    analyzeLayout,
    isAnalyzing,
    analysisResult,
    applyRecommendation,
    error,
    clearAnalysis
  } = useLayoutIntelligence();
  
  // Find the selected recommendation from the analysis results
  const activeRecommendation = analysisResult?.recommendations.find(
    rec => rec.id === selectedRecommendation
  );
  
  // Reset selected recommendation if recommendations change
  useEffect(() => {
    if (analysisResult?.recommendations.length && !selectedRecommendation) {
      setSelectedRecommendation(analysisResult.recommendations[0].id);
    } else if (analysisResult?.recommendations.length && 
              !analysisResult.recommendations.find(r => r.id === selectedRecommendation)) {
      setSelectedRecommendation(analysisResult.recommendations[0].id);
    }
  }, [analysisResult, selectedRecommendation]);
  
  // Calculate severity counts for the progress bars
  const severityCounts = analysisResult?.recommendations.reduce(
    (counts, rec) => {
      counts[rec.severity]++;
      return counts;
    },
    { high: 0, medium: 0, low: 0 }
  ) || { high: 0, medium: 0, low: 0 };
  
  // Calculate progress for each severity level
  const totalIssues = severityCounts.high + severityCounts.medium + severityCounts.low;
  const highProgress = totalIssues ? (severityCounts.high / totalIssues) * 100 : 0;
  const mediumProgress = totalIssues ? (severityCounts.medium / totalIssues) * 100 : 0;
  const lowProgress = totalIssues ? (severityCounts.low / totalIssues) * 100 : 0;
  
  // Analyze layout
  const handleAnalyzeLayout = useCallback(async () => {
    await analyzeLayout(wireframe);
  }, [wireframe, analyzeLayout]);
  
  // Apply layout recommendation
  const handleApplyRecommendation = useCallback(async () => {
    if (!activeRecommendation) return;
    
    const updatedWireframe = await applyRecommendation(wireframe, activeRecommendation);
    if (updatedWireframe) {
      onUpdateWireframe(updatedWireframe);
    }
  }, [wireframe, activeRecommendation, applyRecommendation, onUpdateWireframe]);
  
  return (
    <div className="layout-analysis-panel">
      {!analysisResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Layout Analysis</CardTitle>
            <CardDescription>
              Analyze your wireframe for layout issues and improvement opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleAnalyzeLayout} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart className="mr-2 h-4 w-4" />
                  Analyze Layout
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Layout Score: {analysisResult.overallScore}/100</h3>
              <Button variant="outline" size="sm" onClick={clearAnalysis}>
                Reset
              </Button>
            </div>
            <Progress value={analysisResult.overallScore} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-red-600">High</span>
                  <Badge variant="outline" className="text-red-600">{severityCounts.high}</Badge>
                </div>
                <Progress value={highProgress} className="h-1 bg-gray-100" indicatorClassName="bg-red-400" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-amber-600">Medium</span>
                  <Badge variant="outline" className="text-amber-600">{severityCounts.medium}</Badge>
                </div>
                <Progress value={mediumProgress} className="h-1 bg-gray-100" indicatorClassName="bg-amber-400" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-blue-600">Low</span>
                  <Badge variant="outline" className="text-blue-600">{severityCounts.low}</Badge>
                </div>
                <Progress value={lowProgress} className="h-1 bg-gray-100" indicatorClassName="bg-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {analysisResult.recommendations.map(recommendation => (
              <Card
                key={recommendation.id}
                className={`cursor-pointer transition-colors ${
                  recommendation.id === selectedRecommendation ? 'border-primary ring-1 ring-primary' : ''
                }`}
                onClick={() => setSelectedRecommendation(recommendation.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm">{recommendation.title}</CardTitle>
                    <Badge 
                      className={`
                        ${recommendation.severity === 'high' ? 'bg-red-100 text-red-800' : ''}
                        ${recommendation.severity === 'medium' ? 'bg-amber-100 text-amber-800' : ''}
                        ${recommendation.severity === 'low' ? 'bg-blue-100 text-blue-800' : ''}
                      `}
                    >
                      {recommendation.severity}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">
                    {recommendation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xs text-muted-foreground">
                    {recommendation.affectedSections.length > 0 ? (
                      `${recommendation.affectedSections.length} affected section${
                        recommendation.affectedSections.length > 1 ? 's' : ''
                      }`
                    ) : (
                      'Global improvement'
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {activeRecommendation && (
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Recommendation Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <h4 className="text-xs font-medium mb-1">Description</h4>
                  <p className="text-sm">{activeRecommendation.description}</p>
                </div>
                
                {activeRecommendation.suggestedFix && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium mb-1">Suggested Fix</h4>
                    <p className="text-sm">{activeRecommendation.suggestedFix}</p>
                  </div>
                )}
                
                <Button 
                  onClick={handleApplyRecommendation}
                  className="w-full"
                >
                  Apply Recommendation
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
      
      {error && (
        <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md flex items-center text-sm text-red-800">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Error: {error.message}</span>
        </div>
      )}
    </div>
  );
};

export default LayoutAnalysisPanel;
