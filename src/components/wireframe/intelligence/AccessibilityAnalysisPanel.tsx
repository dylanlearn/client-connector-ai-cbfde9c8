
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Accessibility
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  AccessibilityAnalyzerService, 
  AccessibilityAnalysisResult, 
  AccessibilityIssue 
} from '@/services/ai/design/accessibility/accessibility-analyzer-service';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AccessibilityAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
  onClose?: () => void;
}

const AccessibilityAnalysisPanel: React.FC<AccessibilityAnalysisPanelProps> = ({
  wireframe,
  onUpdateWireframe,
  onClose
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AccessibilityAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('issues');
  const [highlightedIssues, setHighlightedIssues] = useState<boolean>(true);
  
  useEffect(() => {
    // Auto-analyze when the component mounts
    analyzeAccessibility();
  }, [wireframe.id]);
  
  const analyzeAccessibility = async () => {
    setIsAnalyzing(true);
    try {
      const analysisResult = await AccessibilityAnalyzerService.analyzeWireframe(wireframe);
      setResult(analysisResult);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'serious': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'minor': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const toggleHighlightIssues = () => {
    setHighlightedIssues(!highlightedIssues);
  };
  
  const fixIssue = async (issue: AccessibilityIssue) => {
    // This would implement automatic fixes for certain issues
    // For now, we'll just show a placeholder implementation
    alert(`Automated fix for "${issue.description}" would be applied here.`);
  };
  
  return (
    <Card className="overflow-hidden border-t-4 border-t-primary">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <Accessibility className="mr-2 h-5 w-5" />
            Accessibility Analysis
          </h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
        
        {isAnalyzing ? (
          <div className="py-8 flex flex-col items-center">
            <div className="animate-spin mr-2 h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            <p className="mt-4 text-sm text-muted-foreground">Analyzing accessibility issues...</p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Accessibility Score</h4>
                <p className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}/100
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleHighlightIssues}
              >
                {highlightedIssues ? (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Hide Issues
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Issues
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-sm">{result.summary}</p>
            
            <Tabs defaultValue="issues" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="issues">
                  Issues ({result.issues.length})
                </TabsTrigger>
                <TabsTrigger value="passed">
                  Passed ({result.passedChecks.length})
                </TabsTrigger>
                <TabsTrigger value="visualize">
                  Visualize
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="issues" className="space-y-4">
                <ScrollArea className="h-[400px]">
                  {result.issues.length === 0 ? (
                    <div className="py-8 text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                      <p className="mt-2 text-sm">No accessibility issues detected!</p>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-2">
                      {result.issues.map((issue, i) => (
                        <AccordionItem key={issue.id} value={issue.id} className="border rounded-lg overflow-hidden">
                          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                            <div className="flex items-center text-left">
                              <Badge className={`mr-2 ${getSeverityColor(issue.severity)}`}>
                                {issue.severity}
                              </Badge>
                              <span className="text-sm">{issue.description}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-2">
                            <div className="space-y-2 text-sm">
                              <p><strong>Location:</strong> {issue.location}</p>
                              <p><strong>Recommendation:</strong> {issue.recommendation}</p>
                              {issue.wcagCriteria && (
                                <p><strong>WCAG:</strong> {issue.wcagCriteria}</p>
                              )}
                              <div className="mt-4 flex justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => fixIssue(issue)}
                                  className="mr-2"
                                >
                                  Fix Automatically
                                </Button>
                                <Button 
                                  variant="default"
                                  size="sm"
                                >
                                  Highlight Issue
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="passed">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {result.passedChecks.map((check, i) => (
                      <div key={i} className="flex items-center p-2 border rounded-lg">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                        <span className="text-sm">{check}</span>
                      </div>
                    ))}
                    {result.passedChecks.length === 0 && (
                      <div className="py-8 text-center">
                        <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500" />
                        <p className="mt-2 text-sm">No tests passed yet. Fix the issues to improve your score.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="visualize" className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/20">
                  <p className="text-sm text-center mb-4">
                    This view shows a visualization of accessibility issues on your wireframe.
                  </p>
                  <div className="border-2 border-dashed border-gray-300 h-[300px] rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Wireframe visualization would appear here</p>
                    {/* In a real implementation, this would show the wireframe with visual overlays */}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="flex items-center mr-4">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                      <span className="text-xs">Critical</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                      <span className="text-xs">Serious</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                      <span className="text-xs">Moderate</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                      <span className="text-xs">Minor</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={analyzeAccessibility}
                className="mr-2"
              >
                Re-analyze
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No accessibility analysis available</p>
            <Button onClick={analyzeAccessibility} className="mt-4">
              Analyze Accessibility
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AccessibilityAnalysisPanel;
