
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
  Info, 
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { AccessibilityIssue } from '@/services/ai/design/accessibility/accessibility-analyzer-service';
import { useAccessibilityAnalysis } from '@/hooks/ai/use-accessibility-analysis';
import { cn } from '@/lib/utils';

interface AccessibilityAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const AccessibilityAnalysisPanel: React.FC<AccessibilityAnalysisPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const { 
    isAnalyzing, 
    analysisResult, 
    selectedIssue, 
    analyzeAccessibility, 
    setSelectedIssue 
  } = useAccessibilityAnalysis();
  
  const [activeTab, setActiveTab] = useState('issues');
  
  useEffect(() => {
    if (!analysisResult && !isAnalyzing) {
      analyzeAccessibility(wireframe);
    }
  }, [analysisResult, isAnalyzing, analyzeAccessibility, wireframe]);
  
  const handleSelectIssue = (issue: AccessibilityIssue) => {
    setSelectedIssue(issue);
    setActiveTab('details');
  };
  
  const calculateScores = () => {
    if (!analysisResult) return { overall: 0, contrast: 0, semantic: 0, keyboard: 0 };
    
    const issuesByType = {
      contrast: analysisResult.issues.filter(i => i.category === 'contrast').length,
      semantic: analysisResult.issues.filter(i => i.category === 'semantic').length,
      keyboard: analysisResult.issues.filter(i => i.category === 'keyboard').length
    };
    
    // Calculate scores (lower issues = higher score)
    const maxIssuesByCategory = 5; // Assuming 5 is the max issues expected per category
    const contrastScore = Math.max(0, 100 - (issuesByType.contrast / maxIssuesByCategory * 100));
    const semanticScore = Math.max(0, 100 - (issuesByType.semantic / maxIssuesByCategory * 100));
    const keyboardScore = Math.max(0, 100 - (issuesByType.keyboard / maxIssuesByCategory * 100));
    
    // Overall is the average of the three categories
    const overall = Math.round((contrastScore + semanticScore + keyboardScore) / 3);
    
    return {
      overall,
      contrast: Math.round(contrastScore),
      semantic: Math.round(semanticScore),
      keyboard: Math.round(keyboardScore)
    };
  };
  
  const scores = calculateScores();
  
  const renderIssueList = () => {
    if (!analysisResult) return null;
    
    return (
      <div className="space-y-4 mt-4">
        {analysisResult.issues.length === 0 ? (
          <div className="text-center p-4 border rounded-lg bg-green-50">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
            <h3 className="font-medium text-lg">No Accessibility Issues!</h3>
            <p className="text-muted-foreground mt-1">
              Your wireframe passes all accessibility checks. Great work!
            </p>
          </div>
        ) : (
          analysisResult.issues.map(issue => (
            <Card 
              key={issue.id} 
              className={cn(
                "cursor-pointer hover:border-primary/50",
                selectedIssue?.id === issue.id && "border-primary"
              )}
              onClick={() => handleSelectIssue(issue)}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className={cn(
                  "p-1.5 rounded-full",
                  issue.severity === 'high' ? "bg-red-100" :
                  issue.severity === 'medium' ? "bg-amber-100" : "bg-blue-100"
                )}>
                  <AlertCircle className={cn(
                    "h-4 w-4",
                    issue.severity === 'high' ? "text-red-500" :
                    issue.severity === 'medium' ? "text-amber-500" : "text-blue-500"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{issue.title}</h4>
                    <Badge variant={
                      issue.severity === 'high' ? "destructive" :
                      issue.severity === 'medium' ? "default" : "outline"
                    }>
                      {issue.severity}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{issue.description.substring(0, 100)}...</p>
                  <div className="flex text-xs text-muted-foreground mt-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">{issue.category}</span>
                    {issue.wcag && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded ml-2">{issue.wcag}</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground self-center" />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };
  
  const renderIssueDetails = () => {
    if (!selectedIssue) {
      return (
        <div className="text-center p-8">
          <Info className="mx-auto h-12 w-12 text-slate-300 mb-2" />
          <p className="text-muted-foreground">Select an issue to see details</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg flex items-center">
          <span className={cn(
            "p-1 rounded-full mr-2",
            selectedIssue.severity === 'high' ? "bg-red-100" :
            selectedIssue.severity === 'medium' ? "bg-amber-100" : "bg-blue-100"
          )}>
            <AlertCircle className={cn(
              "h-4 w-4",
              selectedIssue.severity === 'high' ? "text-red-500" :
              selectedIssue.severity === 'medium' ? "text-amber-500" : "text-blue-500"
            )} />
          </span>
          {selectedIssue.title}
        </h3>
        
        <div className="space-y-4">
          <p>{selectedIssue.description}</p>
          
          <div>
            <h4 className="font-medium text-sm mb-2">How to Fix:</h4>
            <p className="text-muted-foreground">{selectedIssue.recommendation}</p>
          </div>
          
          <div className="p-3 bg-slate-50 border rounded-lg">
            <h4 className="font-medium text-sm mb-1">Location:</h4>
            <p className="text-xs font-mono bg-slate-100 p-2 rounded">
              {selectedIssue.location || 'Global issue'}
            </p>
          </div>
          
          {selectedIssue.wcag && (
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <a href={`https://www.w3.org/WAI/WCAG21/Understanding/${selectedIssue.wcag}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                WCAG {selectedIssue.wcag} Guidelines
              </a>
            </Button>
          )}
        </div>
        
        <div className="mt-6 flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setActiveTab('issues')}
            className="flex-1"
          >
            Back to Issues
          </Button>
          
          <Button className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            View in Wireframe
          </Button>
        </div>
      </div>
    );
  };
  
  const renderSummary = () => {
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
                <span className="text-sm font-medium">Color Contrast</span>
                <span className="text-sm text-muted-foreground">{scores.contrast}%</span>
              </div>
              <Progress value={scores.contrast} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Semantic Structure</span>
                <span className="text-sm text-muted-foreground">{scores.semantic}%</span>
              </div>
              <Progress value={scores.semantic} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Keyboard Accessibility</span>
                <span className="text-sm text-muted-foreground">{scores.keyboard}%</span>
              </div>
              <Progress value={scores.keyboard} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Accessibility Summary</h4>
          <p className="text-sm text-muted-foreground">
            {analysisResult?.summary || 
              "This wireframe has been analyzed for accessibility issues related to color contrast, semantic structure, and keyboard navigation."}
          </p>
        </div>
      </div>
    );
  };
  
  if (isAnalyzing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Accessibility Analysis</h3>
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
        <h3 className="font-medium">Accessibility Analysis</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => analyzeAccessibility(wireframe)}
          disabled={isAnalyzing}
        >
          Analyze Again
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="issues" className="flex-1">Issues</TabsTrigger>
          <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
          <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues">
          {renderIssueList()}
        </TabsContent>
        
        <TabsContent value="details">
          {renderIssueDetails()}
        </TabsContent>
        
        <TabsContent value="summary">
          {renderSummary()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessibilityAnalysisPanel;
