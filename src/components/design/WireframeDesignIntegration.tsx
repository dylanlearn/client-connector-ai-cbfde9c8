
import React, { useState } from 'react';
import AIWireframeRenderer from '@/components/wireframe/AIWireframeRenderer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DesignWireframeBridge } from './DesignWireframeBridge';
import { EnhancedVisualPicker } from './EnhancedVisualPicker';
import { WireframeData, WireframeGenerationResult } from '@/services/ai/wireframe/wireframe-types';
import { DesignSuggestion } from '@/hooks/wireframe/use-wireframe-variations';
import { Paintbrush, Layout, Wand2, Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WireframeDesignIntegrationProps {
  projectId?: string;
  initialWireframe?: WireframeData;
  onWireframeGenerated?: (wireframe: WireframeGenerationResult) => void;
}

export const WireframeDesignIntegration: React.FC<WireframeDesignIntegrationProps> = ({
  projectId,
  initialWireframe,
  onWireframeGenerated
}) => {
  const [activeTab, setActiveTab] = useState<string>('design');
  const [currentDesign, setCurrentDesign] = useState<DesignSuggestion | null>(null);
  const [generatedWireframes, setGeneratedWireframes] = useState<WireframeGenerationResult[]>([]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const { toast } = useToast();
  
  const handleDesignApplied = (design: DesignSuggestion) => {
    setCurrentDesign(design);
    
    toast({
      title: "Design selected",
      description: "Your design preferences have been saved. Continue to generate a wireframe."
    });
    
    // Automatically move to the next step after a short delay
    setTimeout(() => {
      setActiveTab('bridge');
    }, 500);
  };
  
  const handleWireframeGenerated = (wireframe: WireframeGenerationResult) => {
    if (onWireframeGenerated) {
      onWireframeGenerated(wireframe);
    }
    
    setGeneratedWireframes(prev => [...prev, wireframe]);
    
    toast({
      title: "Wireframe generated",
      description: "Your wireframe has been generated based on your design preferences"
    });
    
    // Automatically move to preview tab
    setActiveTab('preview');
  };

  // Determine if each step is complete
  const isDesignComplete = !!currentDesign;
  const isWireframeComplete = generatedWireframes.length > 0;
  
  return (
    <div className="wireframe-design-integration">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 grid grid-cols-3">
          <TabsTrigger value="design" className="flex items-center gap-2 relative">
            <Paintbrush className="h-4 w-4" />
            Design Selection
            {isDesignComplete && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-500 text-white">
                <Check className="h-3 w-3" />
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="bridge" className="flex items-center gap-2 relative" disabled={!isDesignComplete}>
            <Wand2 className="h-4 w-4" />
            Generate Wireframe
            {isWireframeComplete && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-500 text-white">
                <Check className="h-3 w-3" />
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!isWireframeComplete}>
            <Layout className="h-4 w-4" />
            Preview Result
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="design" className="focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5" />
                Select Your Design Preferences
              </CardTitle>
              <CardDescription>
                Choose design elements that match your vision by swiping or selecting options below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedVisualPicker 
                onDesignSelected={handleDesignApplied}
              />
              
              <div className="flex justify-end mt-6">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button 
                          onClick={() => setActiveTab('bridge')} 
                          disabled={!isDesignComplete}
                          className="flex items-center gap-2"
                        >
                          Continue to Generate Wireframe
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {!isDesignComplete && (
                      <TooltipContent>
                        <p>Please complete the design selection first</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bridge" className="focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Generate Wireframe with Selected Design
              </CardTitle>
              <CardDescription>
                Apply your design choices to generate a wireframe that matches your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DesignWireframeBridge 
                projectId={projectId}
                designSuggestion={currentDesign}
                onWireframeGenerated={handleWireframeGenerated}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Wireframe Preview
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="px-3 py-1 h-8"
                >
                  Desktop
                </Button>
                <Button 
                  variant={previewMode === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                  className="px-3 py-1 h-8"
                >
                  Tablet
                </Button>
                <Button 
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="px-3 py-1 h-8"
                >
                  Mobile
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {generatedWireframes.length > 0 ? (
                <div className="space-y-4">
                  <AIWireframeRenderer 
                    wireframe={generatedWireframes[generatedWireframes.length - 1].wireframe}
                    deviceType={previewMode}
                    className="border rounded-md"
                  />
                  
                  <div className="bg-muted/50 p-4 rounded-md mt-4 text-sm">
                    <h4 className="font-medium mb-2">Applied Design Elements</h4>
                    {currentDesign && (
                      <div className="grid grid-cols-2 gap-2">
                        {currentDesign.colorScheme && (
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">Colors:</span>
                            <div className="flex gap-1">
                              {Object.entries(currentDesign.colorScheme).slice(0, 3).map(([key, color]) => (
                                <div 
                                  key={key}
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: color }}
                                  title={`${key}: ${color}`}
                                ></div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {currentDesign.typography && (
                          <div>
                            <span className="text-muted-foreground">Typography:</span>{' '}
                            {currentDesign.typography.headings}/{currentDesign.typography.body}
                          </div>
                        )}
                        
                        {currentDesign.layoutStyle && (
                          <div>
                            <span className="text-muted-foreground">Layout:</span>{' '}
                            {currentDesign.layoutStyle}
                          </div>
                        )}
                        
                        {currentDesign.toneDescriptor && (
                          <div>
                            <span className="text-muted-foreground">Tone:</span>{' '}
                            {currentDesign.toneDescriptor}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => setActiveTab('bridge')}
                        className="flex items-center gap-2"
                      >
                        Generate Another Variation
                        <Wand2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 border border-dashed rounded-md text-muted-foreground">
                  No wireframe generated yet. Select design preferences and generate a wireframe.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
