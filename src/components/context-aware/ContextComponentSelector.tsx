
import React, { useState } from 'react';
import { useContextComponentSelection } from '@/hooks/use-context-component-selection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AlertMessage } from '@/components/ui/alert-message';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ContextComponentSelectorProps {
  context?: string;
  onSelectComponent?: (componentType: string) => void;
  className?: string;
}

const ContextComponentSelector: React.FC<ContextComponentSelectorProps> = ({ 
  context = 'header', 
  onSelectComponent,
  className
}) => {
  const [currentContext, setCurrentContext] = useState<string>(context);
  const { 
    recommendations, 
    guidelines, 
    isLoading, 
    error, 
    recordComponentUsage,
    refreshRecommendations
  } = useContextComponentSelection(currentContext);
  
  const predefinedContexts = [
    'header', 'footer', 'hero', 'features', 'pricing', 
    'testimonials', 'contact', 'blog', 'product', 'about'
  ];
  
  const handleSelectComponent = (componentType: string) => {
    recordComponentUsage(componentType, currentContext);
    if (onSelectComponent) {
      onSelectComponent(componentType);
    }
  };
  
  const handleContextChange = (newContext: string) => {
    setCurrentContext(newContext);
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.5) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  if (error) {
    return <AlertMessage type="error">Failed to load component recommendations: {error.message}</AlertMessage>;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Context-Aware Components</span>
          <Select 
            value={currentContext} 
            onValueChange={handleContextChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Context" />
            </SelectTrigger>
            <SelectContent>
              {predefinedContexts.map(ctx => (
                <SelectItem key={ctx} value={ctx}>{ctx}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-base font-medium mb-2">Recommended Components</h3>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No recommendations available for this context yet.
            </div>
          ) : (
            <div className="grid gap-2">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectComponent(rec.component_type)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium">{rec.component_type}</h4>
                    <Badge variant="outline">
                      {(rec.confidence * 100).toFixed(0)}% Match
                    </Badge>
                  </div>
                  <Progress 
                    value={rec.confidence * 100} 
                    className={`h-1 ${getConfidenceColor(rec.confidence)}`} 
                  />
                  <p className="text-xs text-muted-foreground mt-1">{rec.reasoning}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="text-base font-medium mb-2">Design Guidelines</h3>
          {guidelines.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No specific guidelines for this context.
            </div>
          ) : (
            <div className="grid gap-2">
              {guidelines.map((guideline, index) => (
                <div key={index} className="p-3 border rounded-md bg-blue-50">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium">{guideline.guideline_type}</h4>
                    <Badge variant="secondary">Priority {guideline.priority}</Badge>
                  </div>
                  <p className="text-sm">{guideline.recommendation}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {guideline.component_types.map(type => (
                      <Badge key={type} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="mt-4 w-full"
          onClick={() => refreshRecommendations()}
        >
          Refresh Recommendations
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContextComponentSelector;
