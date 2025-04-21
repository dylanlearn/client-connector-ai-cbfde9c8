
import React, { useState } from 'react';
import { useComponentRecommendation } from '@/hooks/ai';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Loader2, Sparkles, Info } from 'lucide-react';

interface ComponentRecommendationPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const ComponentRecommendationPanel: React.FC<ComponentRecommendationPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const { isLoading, recommendations, error, getRecommendations } = useComponentRecommendation();
  const [pageContext, setPageContext] = useState('');
  const [contentType, setContentType] = useState('');
  const [industry, setIndustry] = useState('');
  
  const handleGetRecommendations = async () => {
    await getRecommendations(wireframe, pageContext, contentType, undefined, industry);
  };
  
  return (
    <div className="component-recommendations">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      
      <div className="mb-6">
        <div className="grid gap-4 mb-4">
          <div>
            <Label htmlFor="pageContext">Page Context</Label>
            <Input 
              id="pageContext" 
              value={pageContext} 
              onChange={e => setPageContext(e.target.value)} 
              placeholder="e.g. Homepage, Contact Page" 
            />
          </div>
          <div>
            <Label htmlFor="contentType">Content Type</Label>
            <Input 
              id="contentType" 
              value={contentType} 
              onChange={e => setContentType(e.target.value)} 
              placeholder="e.g. E-commerce, Blog, Portfolio" 
            />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input 
              id="industry" 
              value={industry} 
              onChange={e => setIndustry(e.target.value)} 
              placeholder="e.g. Tech, Healthcare, Education" 
            />
          </div>
        </div>
        
        <Button onClick={handleGetRecommendations} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Getting Recommendations
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get Component Recommendations
            </>
          )}
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Generating component recommendations...</p>
        </div>
      )}
      
      {recommendations && !isLoading && (
        <ScrollArea className="h-[400px] pr-4">
          {recommendations.designPatterns && recommendations.designPatterns.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Recommended Design Patterns</h3>
              <div className="flex flex-wrap gap-2">
                {recommendations.designPatterns.map((pattern, i) => (
                  <Badge key={i} variant="outline">{pattern}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {recommendations.globalRecommendations && recommendations.globalRecommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">General Component Recommendations</h3>
              {recommendations.globalRecommendations.map((rec, idx) => (
                <Card key={idx} className="mb-3">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {rec.componentName}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {Math.round(rec.confidence)}% match
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 text-sm">
                    <p>{rec.reason}</p>
                    {rec.exampleUsage && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium">Example: </span>
                        {rec.exampleUsage}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {recommendations.recommendationsBySection && recommendations.recommendationsBySection.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Section-Specific Recommendations</h3>
              {recommendations.recommendationsBySection.map((section, sectionIdx) => (
                <div key={sectionIdx} className="mb-6">
                  <div className="flex items-center mb-2">
                    <h4 className="text-sm font-medium">
                      {section.sectionType}
                      {section.sectionId && <span className="text-xs text-muted-foreground ml-2">(ID: {section.sectionId})</span>}
                    </h4>
                  </div>
                  
                  {section.recommendations.map((rec, recIdx) => (
                    <Card key={recIdx} className="mb-3">
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          {rec.componentName}
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {Math.round(rec.confidence)}% match
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 text-sm">
                        <p>{rec.reason}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      )}
      
      {!recommendations && !isLoading && (
        <div className="text-center py-8 border rounded-lg">
          <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Enter page details and click "Get Component Recommendations" to receive AI-powered suggestions for your design.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComponentRecommendationPanel;
