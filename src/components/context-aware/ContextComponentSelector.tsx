
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertMessage } from '@/components/ui/alert-message';
import { Lightbulb, FileBarChart, PanelRight, Check } from 'lucide-react';
import { ComponentRecommendation, DesignGuideline } from '@/hooks/use-context-component-selection';

interface ContextOption {
  value: string;
  label: string;
}

interface ContextComponentSelectorProps {
  className?: string;
  context: string;
  onContextChange: (context: string) => void;
  contextOptions: ContextOption[];
  recommendations: ComponentRecommendation[];
  guidelines: DesignGuideline[];
  isLoading: boolean;
}

export function ContextComponentSelector({ 
  className, 
  context, 
  onContextChange, 
  contextOptions,
  recommendations,
  guidelines,
  isLoading
}: ContextComponentSelectorProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Context-Aware Component Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="context-selector">Select Page Context</Label>
          <Select 
            value={context} 
            onValueChange={onContextChange}
          >
            <SelectTrigger id="context-selector">
              <SelectValue placeholder="Select context" />
            </SelectTrigger>
            <SelectContent>
              {contextOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3>Recommended Components</h3>
              </div>
              
              {recommendations.length === 0 ? (
                <AlertMessage type="info">No recommendations available for this context</AlertMessage>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div 
                      key={index} 
                      className="border rounded-md p-3 bg-slate-50 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{rec.component_type}</div>
                        <div className="text-xs text-muted-foreground">
                          {rec.reasoning || `Confidence score: ${Math.floor(rec.confidence * 100)}%`}
                        </div>
                      </div>
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        rec.confidence > 0.7 ? "bg-green-100" : "bg-amber-100"
                      )}>
                        <Check className={cn(
                          "h-4 w-4",
                          rec.confidence > 0.7 ? "text-green-600" : "text-amber-600"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium">
                <FileBarChart className="h-5 w-5 text-blue-500" />
                <h3>Design Guidelines</h3>
              </div>
              
              {guidelines.length === 0 ? (
                <AlertMessage type="info">No design guidelines available for this context</AlertMessage>
              ) : (
                <div className="space-y-3">
                  {guidelines.map((guide, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="text-xs uppercase text-muted-foreground tracking-wider mb-1">
                        {guide.guideline_type}
                      </div>
                      <div className="text-sm">{guide.recommendation}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {guide.component_types.map((component, i) => (
                          <div 
                            key={i} 
                            className="text-xs bg-slate-100 px-2 py-1 rounded-md"
                          >
                            {component}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
