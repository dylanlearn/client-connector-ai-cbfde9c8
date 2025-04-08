
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Check, AlertTriangle, Info, PieChart, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutIntelligencePanelProps {
  analysis: any;
  onApplyPattern?: (pattern: string) => void;
  onApplySuggestion?: (suggestion: any) => void;
  className?: string;
}

const LayoutIntelligencePanel: React.FC<LayoutIntelligencePanelProps> = ({
  analysis,
  onApplyPattern,
  onApplySuggestion,
  className
}) => {
  if (!analysis) {
    return (
      <Card className={cn("bg-muted/40", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Layout Intelligence
          </CardTitle>
          <CardDescription>
            Generate a wireframe first to see layout intelligence insights
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { patterns, optimization } = analysis;

  const getConversionImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'medium': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card className={cn("bg-muted/40", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Layout Intelligence
        </CardTitle>
        <CardDescription>
          AI-powered insights to optimize your layout design
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="patterns">
          <div className="px-6 py-2 border-b">
            <TabsList className="w-full">
              <TabsTrigger value="patterns" className="flex-1">
                <LayoutGrid className="h-3.5 w-3.5 mr-1" />
                Patterns
              </TabsTrigger>
              <TabsTrigger value="optimization" className="flex-1">
                <PieChart className="h-3.5 w-3.5 mr-1" />
                Optimization
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="patterns" className="px-6 py-4 space-y-4">
            {patterns && (
              <>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Detected Patterns</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {patterns.detectedPatterns.map((pattern: string) => (
                      <Badge key={pattern} variant="outline" className="bg-blue-50">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                    <span>Pattern confidence: </span>
                    <span className={getScoreColor(patterns.patternConfidence)}>
                      {Math.round(patterns.patternConfidence * 100)}%
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Suggested Improvements</h4>
                  <ScrollArea className="h-52">
                    <div className="space-y-3 pr-3">
                      {patterns.suggestedImprovements.map((improvement: any, i: number) => (
                        <div key={i} className="border rounded-lg p-3 bg-card">
                          <div className="font-medium mb-1">{improvement.pattern}</div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {improvement.reasoning}
                          </p>
                          <div className="space-y-1">
                            {improvement.implementationTips.map((tip: string, j: number) => (
                              <div key={j} className="flex text-sm items-start gap-1.5">
                                <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                          {onApplyPattern && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-3 w-full bg-blue-50 hover:bg-blue-100"
                              onClick={() => onApplyPattern(improvement.pattern)}
                            >
                              <Sparkles className="h-3.5 w-3.5 mr-1" />
                              Apply Pattern
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="optimization" className="px-6 py-4 space-y-4">
            {optimization && (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Overall Layout Score</h4>
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "text-lg font-semibold",
                      getScoreColor(optimization.overallScore)
                    )}>
                      {Math.round(optimization.overallScore * 100)}%
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-2">Layout Flow Suggestions</h4>
                  <ScrollArea className="h-28">
                    <div className="space-y-2 pr-3">
                      {optimization.flowSuggestions.map((suggestion: string, i: number) => (
                        <div 
                          key={i} 
                          className="flex items-start gap-1.5 p-2.5 border rounded-md bg-card"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Section Suggestions</h4>
                  <ScrollArea className="h-52">
                    <div className="space-y-3 pr-3">
                      {Object.entries(optimization.sectionSuggestions).map(([section, suggestions]) => (
                        <div key={section} className="border rounded-lg overflow-hidden">
                          <div className="bg-muted px-3 py-2 font-medium capitalize">
                            {section} Section
                          </div>
                          <div className="p-3 space-y-2">
                            {(suggestions as string[]).map((suggestion, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                <span className="text-sm">{suggestion}</span>
                              </div>
                            ))}
                            {onApplySuggestion && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="mt-1 w-full bg-green-50 hover:bg-green-100"
                                onClick={() => onApplySuggestion({ section, suggestions })}
                              >
                                Apply Suggestions
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t py-3 px-6 text-xs text-muted-foreground">
        Powered by AI pattern recognition and layout optimization engines
      </CardFooter>
    </Card>
  );
};

export default LayoutIntelligencePanel;
