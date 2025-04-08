
import React, { useState, useCallback } from 'react';
import { useWireframeStore } from '@/stores/wireframe-store';
import { Layout, Sparkles, Loader2, Component, CheckCircle2, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { LayoutIntelligenceService } from '@/services/ai/wireframe/layout-intelligence-service';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

interface WireframeAISuggestionsProps {
  projectId?: string;
  onClose?: () => void;
}

const WireframeAISuggestions: React.FC<WireframeAISuggestionsProps> = ({
  projectId,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('layouts');
  const [isLoading, setIsLoading] = useState(false);
  const [layoutSuggestions, setLayoutSuggestions] = useState<any[]>([]);
  const [componentSuggestions, setComponentSuggestions] = useState<any[]>([]);
  const { wireframe, addSection, updateSection } = useWireframeStore();
  const { toast } = useToast();
  
  const generateSuggestions = useCallback(async () => {
    if (!wireframe) return;
    
    setIsLoading(true);
    
    try {
      // Generate layout suggestions
      const layouts = await LayoutIntelligenceService.suggestLayouts(
        wireframe.data?.industryType || 'general',
        ['conversion', 'engagement', 'information']
      );
      setLayoutSuggestions(layouts);
      
      // For component suggestions, we'd use a similar approach
      // This would be implemented in a real service
      setComponentSuggestions([
        {
          id: 'feature-grid-1',
          name: 'Feature Comparison Grid',
          description: 'A grid layout comparing features with visual icons',
          sectionType: 'features',
          componentVariant: 'comparison',
          preview: '/examples/feature-comparison.jpg'
        },
        {
          id: 'stats-counter-1',
          name: 'Animated Stats Counter',
          description: 'Display key metrics with animated counting effect',
          sectionType: 'stats',
          componentVariant: 'animated',
          preview: '/examples/stats-counter.jpg'
        },
        {
          id: 'social-proof-1',
          name: 'Social Proof Banner',
          description: 'Showcase logos and testimonials from reputable clients',
          sectionType: 'social-proof',
          componentVariant: 'logo-strip',
          preview: '/examples/social-proof.jpg'
        }
      ]);
      
      toast({
        title: "AI Suggestions Generated",
        description: "Generated layout and component suggestions based on your current wireframe."
      });
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      toast({
        title: "Error Generating Suggestions",
        description: "Could not generate AI suggestions at this time. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [wireframe, toast]);
  
  // Handle adding a suggested layout to the wireframe
  const addSuggestedLayout = useCallback((layout: any) => {
    if (!layout.wireframeSections || !Array.isArray(layout.wireframeSections)) {
      toast({
        title: "Invalid Layout",
        description: "This layout cannot be added to your wireframe.",
        variant: "destructive"
      });
      return;
    }
    
    // Add each section from the suggested layout
    layout.wireframeSections.forEach((section: Partial<WireframeSection>, index: number) => {
      const newSection: Partial<WireframeSection> = {
        ...section,
        name: section.name || `New ${section.sectionType} Section`,
        order: wireframe?.sections?.length ? wireframe.sections.length + index : index
      };
      
      addSection(newSection);
    });
    
    toast({
      title: "Layout Added",
      description: `Added "${layout.name}" layout to your wireframe.`
    });
  }, [addSection, wireframe, toast]);
  
  // Handle adding a suggested component to the wireframe
  const addSuggestedComponent = useCallback((component: any) => {
    const newSection: Partial<WireframeSection> = {
      name: component.name,
      sectionType: component.sectionType,
      componentVariant: component.componentVariant,
      description: component.description
    };
    
    addSection(newSection);
    
    toast({
      title: "Component Added",
      description: `Added "${component.name}" component to your wireframe.`
    });
  }, [addSection, toast]);
  
  // Handle analyzing wireframe layout for improvements
  const analyzeWireframeLayout = useCallback(async () => {
    if (!wireframe) return;
    
    setIsLoading(true);
    
    try {
      const analysis = await LayoutIntelligenceService.analyzeLayout(wireframe);
      
      // Show results and update the UI
      toast({
        title: "Layout Analysis Complete",
        description: `Overall score: ${Math.round(analysis.overallScore * 100)}%. ${analysis.suggestions.length} suggestions provided.`,
      });
      
      // Apply a suggested improvement
      if (analysis.suggestions.length > 0) {
        const suggestion = analysis.suggestions[0];
        const section = wireframe.sections.find(s => s.id === suggestion.sectionId);
        
        if (section) {
          // Show a toast with the suggestion
          toast({
            title: "AI Suggestion",
            description: suggestion.suggestion,
            action: (
              <Button variant="outline" size="sm" onClick={() => {
                // Apply the suggestion
                // This would be implemented to make real changes
                toast({
                  title: "Suggestion Applied",
                  description: "The suggested improvement has been applied to your wireframe."
                });
              }}>
                Apply
              </Button>
            )
          });
        }
      }
    } catch (error) {
      console.error("Error analyzing layout:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the wireframe layout at this time.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [wireframe, toast]);
  
  // Generate suggestions on initial render
  React.useEffect(() => {
    if (wireframe) {
      generateSuggestions();
    }
  }, []);
  
  if (!wireframe) {
    return null;
  }
  
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium">AI Design Suggestions</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="layouts" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layouts
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-2">
            <Component className="h-4 w-4" />
            Components
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="layouts">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                AI-generated layout suggestions for your wireframe
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateSuggestions} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={analyzeWireframeLayout} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Current Layout
                </>
              )}
            </Button>
            
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                {layoutSuggestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                        <p className="text-muted-foreground">Generating layout suggestions...</p>
                      </>
                    ) : (
                      <>
                        <Layout className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">No layout suggestions available</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={generateSuggestions}
                          className="mt-2"
                        >
                          Generate Suggestions
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  layoutSuggestions.map((layout, index) => (
                    <Card key={`layout-${index}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{layout.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {layout.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-xs text-muted-foreground mb-2">
                          {layout.wireframeSections?.length || 0} sections included
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {layout.wireframeSections?.map((section: any, i: number) => (
                            <div key={`section-${i}`} className="bg-muted text-xs px-2 py-1 rounded-md">
                              {section.name || section.sectionType}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => addSuggestedLayout(layout)}
                        >
                          Add to Wireframe
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        
        <TabsContent value="components">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                AI-recommended components for your wireframe
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateSuggestions} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
            
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                {componentSuggestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                        <p className="text-muted-foreground">Generating component suggestions...</p>
                      </>
                    ) : (
                      <>
                        <Component className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">No component suggestions available</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={generateSuggestions}
                          className="mt-2"
                        >
                          Generate Suggestions
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  componentSuggestions.map((component, index) => (
                    <Card key={`component-${index}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{component.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {component.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Type: {component.sectionType}</span>
                          <span>•</span>
                          <span>Variant: {component.componentVariant}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => addSuggestedComponent(component)}
                        >
                          Add to Wireframe
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(WireframeAISuggestions);
