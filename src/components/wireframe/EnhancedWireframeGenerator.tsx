import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, FileDown, Wand2, ArrowRight, Code, Smartphone, Laptop, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useEnhancedWireframe } from '@/hooks/use-enhanced-wireframe';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { WireframeCanvasEnhanced } from './WireframeCanvasEnhanced';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface EnhancedWireframeGeneratorProps {
  projectId?: string;
  intakeData?: any;
  onWireframeGenerated?: (wireframe: WireframeData) => void;
  onWireframeSaved?: (wireframe: WireframeData) => void;
  viewMode?: 'editor' | 'preview';
}

const EnhancedWireframeGenerator: React.FC<EnhancedWireframeGeneratorProps> = ({
  projectId,
  intakeData,
  onWireframeGenerated,
  onWireframeSaved,
  viewMode = 'editor'
}) => {
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [prompt, setPrompt] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [styleToken, setStyleToken] = useState<string>("modern");
  const [wireframeName, setWireframeName] = useState<string>("");
  const [wireframeDescription, setWireframeDescription] = useState<string>("");
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [variationCount, setVariationCount] = useState<number>(2);
  const [variationType, setVariationType] = useState<'creative' | 'layout' | 'style' | 'component'>('creative');
  const [feedback, setFeedback] = useState<string>("");
  const { toast } = useToast();
  
  // Use the enhanced wireframe hook
  const { 
    isGenerating,
    isGeneratingVariations,
    isApplyingFeedback,
    currentWireframe,
    variations,
    layoutAnalysis,
    generateWireframe,
    generateVariations,
    applyFeedback,
    generateFromIntakeData,
    analyzeLayout,
    saveWireframe,
    selectVariation,
    error
  } = useEnhancedWireframe();

  useEffect(() => {
    // Initialize project name if project ID is provided
    if (projectId) {
      setProjectName(`Project-${projectId.substring(0, 8)}`);
    }
    
    // If intake data is provided, pre-populate some fields
    if (intakeData) {
      if (intakeData.businessName) {
        setPrompt(`Create a website for ${intakeData.businessName}`);
        if (intakeData.businessType) {
          setPrompt(`Create a ${intakeData.businessType} website for ${intakeData.businessName}`);
        }
      }
      if (intakeData.designPreferences?.visualStyle) {
        setStyleToken(intakeData.designPreferences.visualStyle);
      }
    }
  }, [projectId, intakeData]);

  // Set wireframe name from generated wireframe
  useEffect(() => {
    if (currentWireframe?.title) {
      setWireframeName(currentWireframe.title);
      setWireframeDescription(currentWireframe.description || prompt);
    }
  }, [currentWireframe, prompt]);

  const handleGenerateWireframe = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input required",
        description: "Please provide a description for the wireframe",
        variant: "destructive"
      });
      return;
    }

    const params = {
      userInput: prompt,
      projectId: projectId || uuidv4(),
      styleToken, // This is now properly typed in the interface
      enableLayoutIntelligence: true,
      customParams: {
        darkMode: false,
        creativityLevel: 8
      }
    };

    const result = await generateWireframe(params);
    
    if (result?.wireframe) {
      if (onWireframeGenerated) {
        onWireframeGenerated(result.wireframe);
      }
      
      // Switch to editor tab after successful generation
      setActiveTab('editor');
    }
  };
  
  const handleGenerateFromIntake = async () => {
    if (!intakeData) {
      toast({
        title: "No intake data",
        description: "Intake form data is required to generate wireframe",
        variant: "destructive"
      });
      return;
    }
    
    const result = await generateFromIntakeData(intakeData, projectId);
    
    if (result?.wireframe) {
      if (onWireframeGenerated) {
        onWireframeGenerated(result.wireframe);
      }
      
      // Switch to editor tab after successful generation
      setActiveTab('editor');
    }
  };
  
  const handleGenerateVariations = async () => {
    if (!currentWireframe) {
      toast({
        title: "No wireframe",
        description: "Please generate a wireframe first",
        variant: "destructive"
      });
      return;
    }
    
    const result = await generateVariations(variationCount, variationType);
    
    if (result && result.length > 0) {
      toast({
        title: "Variations generated",
        description: `Generated ${result.length} variations successfully`,
      });
    }
  };
  
  const handleApplyFeedback = async () => {
    if (!currentWireframe || !feedback.trim()) {
      toast({
        title: "Cannot apply feedback",
        description: "Please generate a wireframe and provide feedback",
        variant: "destructive"
      });
      return;
    }
    
    const result = await applyFeedback(feedback);
    
    if (result?.wireframe) {
      setFeedback("");
      toast({
        title: "Feedback applied",
        description: `Applied changes: ${result.changeDescription || 'Updates applied'}`,
      });
    }
  };
  
  const handleSaveWireframe = async () => {
    if (!currentWireframe) {
      toast({
        title: "No wireframe to save",
        description: "Please generate a wireframe first",
        variant: "destructive"
      });
      return;
    }
    
    const savedWireframe = await saveWireframe(
      projectId || uuidv4(),
      wireframeName,
      wireframeDescription
    );
    
    if (savedWireframe && onWireframeSaved) {
      onWireframeSaved(savedWireframe);
    }
  };
  
  const handleExport = () => {
    if (!currentWireframe) {
      toast({
        title: "Nothing to export",
        description: "Please generate a wireframe first",
        variant: "destructive"
      });
      return;
    }
    
    const wireframeJson = JSON.stringify(currentWireframe, null, 2);
    const blob = new Blob([wireframeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `wireframe-${wireframeName || 'untitled'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export completed",
      description: "Wireframe JSON has been exported successfully"
    });
  };
  
  const handleSelectVariation = (index: number) => {
    selectVariation(index);
  };

  const renderCodePreview = () => {
    if (!currentWireframe) {
      return (
        <div className="flex items-center justify-center h-64 bg-muted/50 rounded-md">
          <p className="text-muted-foreground">No wireframe data to show</p>
        </div>
      );
    }
    
    return (
      <pre className="p-4 bg-muted/50 rounded-md overflow-auto max-h-[500px]">
        <code className="text-xs font-mono">
          {JSON.stringify(currentWireframe, null, 2)}
        </code>
      </pre>
    );
  };
  
  const renderWireframeCanvas = (wireframe: WireframeData) => {
    return (
      <div className="relative border rounded-md overflow-hidden" style={{ 
        height: '600px',
        width: devicePreview === 'desktop' ? '100%' : devicePreview === 'tablet' ? '768px' : '375px',
        margin: devicePreview !== 'desktop' ? '0 auto' : undefined
      }}>
        <WireframeCanvasEnhanced 
          sections={wireframe.sections}
          width={devicePreview === 'desktop' ? 1200 : devicePreview === 'tablet' ? 768 : 375}
          height={2000}
          editable={false}
          showGrid={false}
          snapToGrid={false}
          deviceType={devicePreview}
          responsiveMode={devicePreview !== 'desktop'}
        />
      </div>
    );
  };
  
  const renderVariations = () => {
    if (variations.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 bg-muted/50 rounded-md">
          <p className="text-muted-foreground">No variations generated yet</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variations.map((variation, index) => (
          <Card key={variation.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{variation.title}</CardTitle>
              <CardDescription className="text-xs truncate">{variation.variationType} variation</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[300px] overflow-hidden">
              <WireframeCanvasEnhanced 
                sections={variation.sections}
                width={devicePreview === 'desktop' ? 600 : devicePreview === 'tablet' ? 380 : 187}
                height={1000}
                editable={false}
                showGrid={false}
                snapToGrid={false}
                deviceType={devicePreview}
                responsiveMode={devicePreview !== 'desktop'}
              />
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={() => handleSelectVariation(index)}>
                Select Variation
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="enhanced-wireframe-generator">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Wireframe Generator</h2>
          <p className="text-muted-foreground">Create and customize advanced wireframes for your project</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSaveWireframe} 
            disabled={!currentWireframe || isGenerating}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={!currentWireframe || isGenerating}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="generator" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="editor" disabled={!currentWireframe}>Editor</TabsTrigger>
          <TabsTrigger value="variations" disabled={!currentWireframe}>Variations</TabsTrigger>
          <TabsTrigger value="feedback" disabled={!currentWireframe}>Feedback</TabsTrigger>
          <TabsTrigger value="code" disabled={!currentWireframe}>Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle>Generate Wireframe</CardTitle>
              <CardDescription>
                Create a new wireframe from a text description or intake data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input 
                  id="projectName" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="styleToken">Style Preference</Label>
                <Select value={styleToken} onValueChange={setStyleToken}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prompt">Description</Label>
                <Textarea 
                  id="prompt" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the wireframe you want to generate..."
                  rows={6}
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
              {intakeData && (
                <Button 
                  variant="outline"
                  onClick={handleGenerateFromIntake} 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating from Intake...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate from Intake Data
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                onClick={handleGenerateWireframe} 
                disabled={isGenerating || !prompt.trim()}
                className={intakeData ? "" : "ml-auto"}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="editor" className="min-h-[500px]">
          {currentWireframe ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Input
                        value={wireframeName}
                        onChange={(e) => setWireframeName(e.target.value)}
                        className="font-bold text-lg border-0 px-0 h-auto"
                        placeholder="Wireframe Title"
                      />
                      <Textarea
                        value={wireframeDescription}
                        onChange={(e) => setWireframeDescription(e.target.value)}
                        className="text-muted-foreground text-sm resize-none border-0 px-0 mt-1"
                        placeholder="Wireframe description..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={devicePreview === 'desktop' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setDevicePreview('desktop')}
                      >
                        <Laptop className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={devicePreview === 'tablet' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setDevicePreview('tablet')}
                      >
                        <Smartphone className="h-4 w-4 rotate-90" />
                      </Button>
                      <Button 
                        variant={devicePreview === 'mobile' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setDevicePreview('mobile')}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {renderWireframeCanvas(currentWireframe)}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={analyzeLayout}
                    disabled={!currentWireframe}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Analyze Layout
                  </Button>
                  
                  <Button 
                    onClick={handleSaveWireframe} 
                    disabled={!currentWireframe}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Wireframe
                  </Button>
                </CardFooter>
              </Card>
              
              {layoutAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Analysis</CardTitle>
                    <CardDescription>AI-powered insights about your wireframe layout</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {layoutAnalysis.patterns?.detectedPatterns && (
                        <div>
                          <h3 className="font-medium mb-2">Detected Patterns</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {layoutAnalysis.patterns.detectedPatterns.map((pattern: string, idx: number) => (
                              <li key={idx} className="text-sm">{pattern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {layoutAnalysis.optimization?.suggestions && (
                        <div>
                          <h3 className="font-medium mb-2">Optimization Suggestions</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {layoutAnalysis.optimization.suggestions.map((suggestion: string, idx: number) => (
                              <li key={idx} className="text-sm">{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted rounded-md">
              <p className="text-muted-foreground">No wireframe to edit. Generate one first.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="variations">
          <Card>
            <CardHeader>
              <CardTitle>Wireframe Variations</CardTitle>
              <CardDescription>Generate and explore different variations of your wireframe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentWireframe ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="variationType">Variation Type</Label>
                      <Select value={variationType} onValueChange={(value: any) => setVariationType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select variation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="creative">Creative (Overall Changes)</SelectItem>
                          <SelectItem value="layout">Layout (Structure Changes)</SelectItem>
                          <SelectItem value="style">Style (Visual Changes)</SelectItem>
                          <SelectItem value="component">Component (Element Changes)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 w-32">
                      <Label htmlFor="variationCount">Count</Label>
                      <Input 
                        id="variationCount" 
                        type="number"
                        min={1}
                        max={5}
                        value={variationCount}
                        onChange={(e) => setVariationCount(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
                      />
                    </div>
                    <Button 
                      onClick={handleGenerateVariations} 
                      disabled={isGeneratingVariations}
                    >
                      {isGeneratingVariations ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Variations
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {renderVariations()}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-md">
                  <p className="text-muted-foreground">No wireframe to create variations from. Generate one first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Wireframe Feedback</CardTitle>
              <CardDescription>Provide feedback to automatically improve your wireframe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentWireframe ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Your Feedback</Label>
                    <Textarea 
                      id="feedback" 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Describe changes you'd like to make to the wireframe..."
                      rows={6}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleApplyFeedback} 
                      disabled={isApplyingFeedback || !feedback.trim()}
                    >
                      {isApplyingFeedback ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Applying Feedback...
                        </>
                      ) : (
                        "Apply Feedback"
                      )}
                    </Button>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Example Feedback</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>"Make the hero section taller and change the background to a light blue color"</li>
                      <li>"Add a testimonials section below the features"</li>
                      <li>"Use a more modern font for all headings"</li>
                      <li>"Change the layout of the features section to a 3-column grid"</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-md">
                  <p className="text-muted-foreground">No wireframe to provide feedback on. Generate one first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Generated Code
              </CardTitle>
              <CardDescription>
                View and copy the generated code for your wireframe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCodePreview()}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  if (!currentWireframe) return;
                  navigator.clipboard.writeText(JSON.stringify(currentWireframe, null, 2));
                  toast({
                    title: "Copied to clipboard",
                    description: "Code has been copied to clipboard"
                  });
                }}
                disabled={!currentWireframe}
              >
                Copy JSON
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedWireframeGenerator;
