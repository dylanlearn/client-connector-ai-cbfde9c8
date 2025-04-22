
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Check, 
  BookOpen, 
  AlertTriangle, 
  MousePointer, 
  SplitSquareVertical,
  BarChartHorizontal
} from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  useContentStructureAnalysis,
  ContentStructureAnalysis,
  SectionContentAnalysis
} from '@/hooks/ai/use-content-structure-analysis';

interface ContentStructureAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (wireframe: WireframeData) => void;
}

const ContentStructureAnalysisPanel: React.FC<ContentStructureAnalysisPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const { 
    isAnalyzing, 
    contentAnalysis, 
    error, 
    analyzeContentStructure,
    applyContentRecommendation
  } = useContentStructureAnalysis();
  
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  useEffect(() => {
    // Auto-analyze on component mount
    if (wireframe && !contentAnalysis && !isAnalyzing) {
      analyzeContentStructure(wireframe);
    }
  }, [wireframe, contentAnalysis, isAnalyzing, analyzeContentStructure]);
  
  useEffect(() => {
    // Set the first section as selected when analysis completes
    if (contentAnalysis?.sectionAnalyses?.length > 0 && !selectedSection) {
      setSelectedSection(contentAnalysis.sectionAnalyses[0].sectionId);
    }
  }, [contentAnalysis, selectedSection]);
  
  const handleApplyRecommendation = async (recommendationId: string, sectionId?: string) => {
    if (onUpdateWireframe) {
      const updatedWireframe = await applyContentRecommendation(
        wireframe, 
        recommendationId, 
        sectionId
      );
      onUpdateWireframe(updatedWireframe);
    }
  };
  
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Analyzing content structure...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          Error analyzing content structure: {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!contentAnalysis) {
    return (
      <div className="text-center p-8">
        <Button onClick={() => analyzeContentStructure(wireframe)}>
          Analyze Content Structure
        </Button>
      </div>
    );
  }
  
  const selectedSectionAnalysis = selectedSection 
    ? contentAnalysis.sectionAnalyses.find(sa => sa.sectionId === selectedSection) 
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Content Structure Analysis</h3>
          <p className="text-sm text-muted-foreground">
            AI analysis of content readability, scannability, and hierarchy
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => analyzeContentStructure(wireframe)}>
          Refresh Analysis
        </Button>
      </div>
      
      {/* Overall Metrics */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <h3 className="text-sm font-medium">Overall Content Quality</h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center mt-1">
            <div className="w-full mr-4">
              <Progress value={contentAnalysis.overallMetrics.overallScore} className="h-2" />
            </div>
            <span className="text-sm font-bold">{contentAnalysis.overallMetrics.overallScore}/100</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <MetricCard
              label="Readability"
              value={contentAnalysis.overallMetrics.readabilityScore}
              icon={<BookOpen className="h-4 w-4" />}
            />
            <MetricCard
              label="Scannability"
              value={contentAnalysis.overallMetrics.scannabilityScore}
              icon={<MousePointer className="h-4 w-4" />}
            />
            <MetricCard
              label="Hierarchy"
              value={contentAnalysis.overallMetrics.hierarchyScore}
              icon={<SplitSquareVertical className="h-4 w-4" />}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className={getBadgeClass(contentAnalysis.overallMetrics.contentDensity)}>
              Content density: {contentAnalysis.overallMetrics.contentDensity}
            </Badge>
            <Badge variant="outline" className={getHeadingBadgeClass(contentAnalysis.overallMetrics.headingStructure)}>
              Heading structure: {contentAnalysis.overallMetrics.headingStructure}
            </Badge>
            <Badge variant="outline" className="bg-blue-50">
              Improvement potential: {contentAnalysis.improvementPotential}%
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Section Analysis Tabs */}
      <Tabs defaultValue="sections">
        <TabsList>
          <TabsTrigger value="sections">Section Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Global Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sections" className="space-y-4 pt-4">
          <div className="flex flex-wrap gap-2">
            {contentAnalysis.sectionAnalyses.map(section => (
              <Badge 
                key={section.sectionId}
                variant={selectedSection === section.sectionId ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedSection(section.sectionId)}
              >
                {section.name}
              </Badge>
            ))}
          </div>
          
          {selectedSectionAnalysis && (
            <SectionAnalysisCard 
              sectionAnalysis={selectedSectionAnalysis}
              onApplyRecommendation={suggestionId => 
                handleApplyRecommendation(suggestionId, selectedSectionAnalysis.sectionId)
              }
            />
          )}
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            {contentAnalysis.globalSuggestions.map(suggestion => (
              <div 
                key={suggestion.id}
                className="border rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={suggestion.category} />
                      <h4 className="font-medium">{suggestion.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getPriorityBadgeClass(suggestion.priority)}>
                        {suggestion.priority} priority
                      </Badge>
                      <Badge variant="outline">
                        {suggestion.category}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleApplyRecommendation(suggestion.id)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1">
        <div className="flex items-center">
          <Progress value={value} className="h-1.5 flex-1" />
          <span className="text-xs font-medium ml-2">{value}</span>
        </div>
      </div>
    </div>
  );
};

interface SectionAnalysisCardProps {
  sectionAnalysis: SectionContentAnalysis;
  onApplyRecommendation: (suggestionId: string) => void;
}

const SectionAnalysisCard: React.FC<SectionAnalysisCardProps> = ({ 
  sectionAnalysis, 
  onApplyRecommendation 
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-medium">{sectionAnalysis.name}</h4>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <MetricCard
            label="Readability"
            value={sectionAnalysis.metrics.readabilityScore}
            icon={<BookOpen className="h-4 w-4" />}
          />
          <MetricCard
            label="Scannability"
            value={sectionAnalysis.metrics.scannabilityScore}
            icon={<MousePointer className="h-4 w-4" />}
          />
          <MetricCard
            label="Hierarchy"
            value={sectionAnalysis.metrics.hierarchyScore}
            icon={<SplitSquareVertical className="h-4 w-4" />}
          />
        </div>
        
        {/* Issues */}
        {sectionAnalysis.issues.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Issues</h5>
            <div className="space-y-2">
              {sectionAnalysis.issues.map(issue => (
                <div 
                  key={issue.id}
                  className={`flex items-start gap-2 p-2 rounded-md ${
                    issue.type === 'critical' ? 'bg-red-50' : 
                    issue.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
                  }`}
                >
                  {issue.type === 'critical' ? (
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                  ) : issue.type === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  ) : (
                    <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                  )}
                  <p className="text-xs">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Suggestions */}
        {sectionAnalysis.suggestions.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Content Suggestions</h5>
            <div className="space-y-4">
              {sectionAnalysis.suggestions.map(suggestion => (
                <div 
                  key={suggestion.id}
                  className="border rounded-md p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm">{suggestion.description}</p>
                      
                      {(suggestion.before || suggestion.after) && (
                        <div className="grid grid-cols-2 gap-4 bg-muted p-2 rounded text-xs">
                          {suggestion.before && (
                            <div>
                              <div className="font-medium mb-1">Before:</div>
                              <div className="text-muted-foreground">{suggestion.before}</div>
                            </div>
                          )}
                          {suggestion.after && (
                            <div>
                              <div className="font-medium mb-1">After:</div>
                              <div>{suggestion.after}</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <Badge variant="outline" className={getImpactBadgeClass(suggestion.impact)}>
                        {suggestion.impact} impact
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => onApplyRecommendation(suggestion.id)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper functions for styling
function getBadgeClass(density: string): string {
  switch (density) {
    case 'light': return 'bg-green-50';
    case 'optimal': return 'bg-blue-50';
    case 'dense': return 'bg-amber-50';
    default: return '';
  }
}

function getHeadingBadgeClass(structure: string): string {
  switch (structure) {
    case 'good': return 'bg-green-50';
    case 'needs-improvement': return 'bg-amber-50';
    case 'poor': return 'bg-red-50';
    default: return '';
  }
}

function getImpactBadgeClass(impact: string): string {
  switch (impact) {
    case 'high': return 'bg-green-50';
    case 'medium': return 'bg-blue-50';
    case 'low': return 'bg-gray-50';
    default: return '';
  }
}

function getPriorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'high': return 'bg-red-50';
    case 'medium': return 'bg-amber-50';
    case 'low': return 'bg-green-50';
    default: return '';
  }
}

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case 'readability':
      return <BookOpen className="h-4 w-4 text-blue-500" />;
    case 'scannability':
      return <MousePointer className="h-4 w-4 text-green-500" />;
    case 'hierarchy':
      return <SplitSquareVertical className="h-4 w-4 text-purple-500" />;
    case 'structure':
      return <BarChartHorizontal className="h-4 w-4 text-amber-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
}

export default ContentStructureAnalysisPanel;
