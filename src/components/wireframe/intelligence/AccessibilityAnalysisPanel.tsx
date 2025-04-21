
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, AccessibilityIcon, Check, AlertTriangle, AlertCircle } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useAccessibilityAnalysis } from '@/hooks/ai/use-accessibility-analysis';
import { AccessibilityIssue } from '@/services/ai/design/accessibility/accessibility-analyzer-service';

export interface AccessibilityAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const AccessibilityAnalysisPanel: React.FC<AccessibilityAnalysisPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const [selectedIssue, setSelectedIssue] = useState<AccessibilityIssue | null>(null);
  
  const { 
    analyzeAccessibility,
    isAnalyzing,
    analysisResult,
    selectedIssue: hookSelectedIssue,
    setSelectedIssue: setHookSelectedIssue,
    error,
    clearAnalysis
  } = useAccessibilityAnalysis();
  
  // Analyze accessibility
  const handleAnalyze = useCallback(async () => {
    await analyzeAccessibility(wireframe);
  }, [wireframe, analyzeAccessibility]);
  
  // Fix selected issue
  const handleFixIssue = useCallback(async () => {
    if (!selectedIssue) return;
    
    try {
      const updatedWireframe = await wireframe;
      if (updatedWireframe) {
        onUpdateWireframe(updatedWireframe);
      }
    } catch (err) {
      console.error('Error fixing accessibility issue:', err);
    }
  }, [wireframe, selectedIssue, onUpdateWireframe]);
  
  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'serious':
        return 'bg-amber-100 text-amber-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'minor':
        return 'bg-blue-100 text-blue-800';
      default:
        return '';
    }
  };
  
  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'serious':
        return <AlertTriangle className="h-4 w-4" />;
      case 'moderate':
        return <AlertCircle className="h-4 w-4" />;
      case 'minor':
        return <AccessibilityIcon className="h-4 w-4" />;
      default:
        return <AccessibilityIcon className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="accessibility-analysis-panel">
      {!analysisResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Accessibility Analysis</CardTitle>
            <CardDescription>
              Analyze your wireframe for accessibility issues and standards compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleAnalyze} 
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
                  <AccessibilityIcon className="mr-2 h-4 w-4" />
                  Analyze Accessibility
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">
                Accessibility Score: {analysisResult.overallScore}/100
              </h3>
              <Button variant="outline" size="sm" onClick={clearAnalysis}>
                Reset
              </Button>
            </div>
            
            <Progress 
              value={analysisResult.overallScore} 
              className="h-2"
              indicatorClassName={`${
                analysisResult.overallScore >= 90 ? 'bg-green-500' :
                analysisResult.overallScore >= 70 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
            />
            
            <div className="mt-4 text-sm">
              {analysisResult.overallScore >= 90 ? (
                <div className="flex items-center text-green-600">
                  <Check className="mr-2 h-4 w-4" />
                  Good accessibility compliance
                </div>
              ) : analysisResult.overallScore >= 70 ? (
                <div className="flex items-center text-yellow-600">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Moderate accessibility issues need attention
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Significant accessibility issues need fixing
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-4">
            {analysisResult.issues.length > 0 ? (
              analysisResult.issues.map(issue => (
                <Card
                  key={issue.id}
                  className={`cursor-pointer transition-colors ${
                    selectedIssue?.id === issue.id ? 'border-primary ring-1 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedIssue(issue)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm">{issue.title}</CardTitle>
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs">
                      {issue.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center text-xs text-muted-foreground">
                      {getSeverityIcon(issue.severity)}
                      <span className="ml-1">
                        {issue.wcagCriteria || 'Accessibility best practice'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center p-8 border rounded-lg bg-green-50 text-green-700">
                <Check className="mr-2 h-5 w-5" />
                <p>No accessibility issues found. Great job!</p>
              </div>
            )}
          </div>
          
          {selectedIssue && (
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <h4 className="text-xs font-medium mb-1">Description</h4>
                  <p className="text-sm">{selectedIssue.description}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-xs font-medium mb-1">Suggested Fix</h4>
                  <p className="text-sm">{selectedIssue.fixSuggestion}</p>
                </div>
                
                {selectedIssue.wcagCriteria && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium mb-1">WCAG Criteria</h4>
                    <p className="text-sm">{selectedIssue.wcagCriteria}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  onClick={handleFixIssue}
                  className="w-full"
                >
                  Apply Fix
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {analysisResult.passedChecks.length > 0 && (
            <Card className="mt-4">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Passed Checks</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {analysisResult.passedChecks.map((check, index) => (
                    <li key={index} className="flex items-center text-sm text-green-600">
                      <Check className="mr-2 h-4 w-4" />
                      {check}
                    </li>
                  ))}
                </ul>
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

export default AccessibilityAnalysisPanel;
