
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAccessibilityAnalysis, AccessibilityIssue } from '@/hooks/ai/use-accessibility-analysis';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { AlertTriangle, Check, Info } from 'lucide-react';

interface AccessibilityAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const AccessibilityAnalysisPanel: React.FC<AccessibilityAnalysisPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    isAnalyzing,
    accessibilityReport,
    analysisResult,
    selectedIssue,
    setSelectedIssue,
    error,
    analyzeAccessibility,
    fixAccessibilityIssue
  } = useAccessibilityAnalysis({ showToasts: true });

  useEffect(() => {
    if (!analysisResult && !isAnalyzing) {
      analyzeAccessibility(wireframe);
    }
  }, [wireframe, analyzeAccessibility, analysisResult, isAnalyzing]);

  const handleFixIssue = async (issue: AccessibilityIssue) => {
    const updatedWireframe = await fixAccessibilityIssue(wireframe, issue);
    onUpdateWireframe(updatedWireframe);
  };

  const renderSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <Info className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-4 p-4">
        <p className="text-center text-muted-foreground">Analyzing accessibility...</p>
        <Progress value={45} className="w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Error analyzing accessibility: {error.message}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => analyzeAccessibility(wireframe)}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!accessibilityReport) {
    return (
      <div className="p-4 text-center">
        <Button onClick={() => analyzeAccessibility(wireframe)}>
          Analyze Accessibility
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Accessibility Score</h3>
            <span className="text-2xl font-bold">{accessibilityReport.score}%</span>
          </div>
          <Progress value={accessibilityReport.score} className="w-full" />
          
          <h4 className="text-sm font-medium mt-4">WCAG Compliance</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Perceivable</span>
              <span className="text-sm font-medium">{accessibilityReport.wcagCompliance.perceivable}%</span>
            </div>
            <Progress value={accessibilityReport.wcagCompliance.perceivable} className="w-full h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Operable</span>
              <span className="text-sm font-medium">{accessibilityReport.wcagCompliance.operable}%</span>
            </div>
            <Progress value={accessibilityReport.wcagCompliance.operable} className="w-full h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Understandable</span>
              <span className="text-sm font-medium">{accessibilityReport.wcagCompliance.understandable}%</span>
            </div>
            <Progress value={accessibilityReport.wcagCompliance.understandable} className="w-full h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Robust</span>
              <span className="text-sm font-medium">{accessibilityReport.wcagCompliance.robust}%</span>
            </div>
            <Progress value={accessibilityReport.wcagCompliance.robust} className="w-full h-2" />
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4 pt-2">
          {accessibilityReport.issues.length === 0 ? (
            <div className="text-center p-4 bg-muted rounded-md">
              <Check className="h-10 w-10 text-primary mx-auto mb-2" />
              <p>No accessibility issues found!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {accessibilityReport.issues.map((issue) => (
                <Card 
                  key={issue.id} 
                  className={`cursor-pointer ${selectedIssue?.id === issue.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedIssue(issue)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      {renderSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{issue.type}</span>
                          <span className="text-xs text-muted-foreground capitalize">{issue.severity}</span>
                        </div>
                        <p className="text-sm mt-1">{issue.description}</p>
                        {issue.location && (
                          <p className="text-xs text-muted-foreground mt-1">Location: {issue.location}</p>
                        )}
                      </div>
                    </div>
                    {selectedIssue?.id === issue.id && (
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleFixIssue(issue)}
                      >
                        Fix Issue
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4 pt-2">
          <ul className="space-y-2">
            {accessibilityReport.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-1 shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
          
          {accessibilityReport.strengths && accessibilityReport.strengths.length > 0 && (
            <>
              <h4 className="text-sm font-medium mt-4">Strengths</h4>
              <ul className="space-y-2">
                {accessibilityReport.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => analyzeAccessibility(wireframe)}
          disabled={isAnalyzing}
        >
          Re-analyze
        </Button>
      </div>
    </div>
  );
};

export default AccessibilityAnalysisPanel;
