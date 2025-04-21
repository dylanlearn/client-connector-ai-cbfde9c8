
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import useComponentRecommendation from '@/hooks/ai/use-component-recommendation';
import { ComponentRecommendation } from '@/services/ai/design/component-recommendation/types';
import { Puzzle, ThumbsUp, Code, Lightbulb, Sparkles } from 'lucide-react';

interface ComponentRecommendationPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const ComponentRecommendationPanel: React.FC<ComponentRecommendationPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const { 
    isLoading, 
    recommendations, 
    getRecommendations,
    getSectionRecommendations
  } = useComponentRecommendation();

  const [selectedSection, setSelectedSection] = useState<string>("");
  const [pageContext, setPageContext] = useState<string>("");
  const [contentType, setContentType] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");

  useEffect(() => {
    // Reset selected section when wireframe changes
    if (wireframe?.sections?.length > 0) {
      setSelectedSection(wireframe.sections[0].id);
    }
  }, [wireframe]);

  const handleGetRecommendations = () => {
    if (wireframe) {
      getRecommendations(wireframe, pageContext, contentType, undefined, industry);
    }
  };

  const handleGetSectionRecommendations = () => {
    if (wireframe && selectedSection) {
      getSectionRecommendations(wireframe, selectedSection, 5);
    }
  };

  const renderConfidenceBadge = (confidence: number) => {
    if (confidence >= 85) {
      return <Badge className="bg-green-500">High Confidence</Badge>;
    } else if (confidence >= 70) {
      return <Badge className="bg-amber-500">Medium Confidence</Badge>;
    } else {
      return <Badge className="bg-red-500">Low Confidence</Badge>;
    }
  };

  const renderRecommendationCard = (recommendation: ComponentRecommendation, index: number) => {
    return (
      <Card key={`${recommendation.componentType}-${index}`} className="mb-3">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{recommendation.componentName}</CardTitle>
            {renderConfidenceBadge(recommendation.confidence)}
          </div>
          <CardDescription className="text-xs">
            {recommendation.componentType}
            {recommendation.designPattern && (
              <span className="ml-2 text-primary">
                • {recommendation.designPattern}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p>{recommendation.reason}</p>
          
          {recommendation.exampleUsage && (
            <div className="mt-2">
              <div className="text-xs font-medium text-muted-foreground mb-1">Example Usage:</div>
              <div className="bg-muted p-2 rounded text-xs overflow-x-auto font-mono">
                {recommendation.exampleUsage}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="component-recommendation-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Component Recommendations</h3>
        <Button 
          size="sm" 
          onClick={handleGetRecommendations}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Get Recommendations'}
        </Button>
      </div>

      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="pageContext" className="text-xs">Page Context</Label>
            <Input
              id="pageContext"
              placeholder="e.g., Landing Page"
              className="text-sm"
              value={pageContext}
              onChange={(e) => setPageContext(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="contentType" className="text-xs">Content Type</Label>
            <Input
              id="contentType"
              placeholder="e.g., Marketing"
              className="text-sm"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="industry" className="text-xs">Industry</Label>
          <Input
            id="industry"
            placeholder="e.g., Healthcare, Technology"
            className="text-sm"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="animate-pulse mb-2">Generating recommendations...</div>
          <div className="flex justify-center">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          </div>
        </div>
      ) : recommendations ? (
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
              Design Patterns
            </h4>
            <div className="flex flex-wrap gap-1">
              {recommendations.designPatterns.map((pattern, idx) => (
                <Badge key={idx} variant="outline" className="bg-muted">
                  {pattern}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1 text-blue-500" />
                Global Recommendations
              </h4>
            </div>
            
            <div className="space-y-3">
              {recommendations.globalRecommendations.slice(0, 3).map((rec, idx) => (
                renderRecommendationCard(rec, idx)
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium flex items-center">
                <Puzzle className="h-4 w-4 mr-1 text-green-500" />
                Section Recommendations
              </h4>
              <div className="flex items-center space-x-2">
                <Select
                  value={selectedSection}
                  onValueChange={setSelectedSection}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[150px] h-8 text-xs">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {wireframe.sections.map(section => (
                      <SelectItem key={section.id} value={section.id} className="text-xs">
                        {section.name || section.sectionType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleGetSectionRecommendations}
                  disabled={!selectedSection || isLoading}
                >
                  Refresh
                </Button>
              </div>
            </div>
            
            {selectedSection && (
              <div className="space-y-3">
                {recommendations.recommendationsBySection
                  .find(s => s.sectionId === selectedSection)
                  ?.recommendations.slice(0, 3).map((rec, idx) => (
                    renderRecommendationCard(rec, idx)
                  )) || (
                    <div className="text-center py-4 text-muted-foreground">
                      No recommendations for this section yet.
                    </div>
                  )
                }
              </div>
            )}
          </div>
          
          {recommendations.recommendationsBySection.length > 0 && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="w-full" disabled={isLoading}>
                <Code className="h-4 w-4 mr-1" />
                Generate Component Code
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          Configure the options above and click "Get Recommendations" to analyze this wireframe
        </div>
      )}
    </div>
  );
};

export default ComponentRecommendationPanel;
