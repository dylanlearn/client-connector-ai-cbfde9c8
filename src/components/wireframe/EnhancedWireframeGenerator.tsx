
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, Save, FileDown, Upload, 
  ArrowRight, Code, Smartphone, Laptop, 
  Wand2, MessageSquare, Sparkles,
  LayoutTemplate, FileInput, Copy
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useEnhancedWireframe } from '@/hooks/use-enhanced-wireframe';
import { WireframeCanvasEnhanced } from './WireframeCanvasEnhanced';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';

export interface EnhancedWireframeGeneratorProps {
  projectId?: string;
  onWireframeGenerated?: (wireframe: WireframeData) => void;
  onWireframeSaved?: (wireframe: WireframeData) => void;
  viewMode?: 'editor' | 'preview';
  intakeData?: any;
}

const EnhancedWireframeGenerator: React.FC<EnhancedWireframeGeneratorProps> = ({
  projectId,
  onWireframeGenerated,
  onWireframeSaved,
  viewMode = 'editor',
  intakeData
}) => {
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [prompt, setPrompt] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [styleToken, setStyleToken] = useState<string>("modern");
  const [includeLayoutIntelligence, setIncludeLayoutIntelligence] = useState<boolean>(true);
  const [wireframeName, setWireframeName] = useState<string>("");
  const [wireframeDescription, setWireframeDescription] = useState<string>("");
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState<boolean>(false);
  const [variationDialogOpen, setVariationDialogOpen] = useState<boolean>(false);
  const [variationCount, setVariationCount] = useState<number>(2);
  const [variationType, setVariationType] = useState<'creative' | 'layout' | 'style' | 'component'>('creative');
  const { toast } = useToast();
  
  // Use the enhanced wireframe hook
  const { 
    isGenerating, 
    isApplyingFeedback,
    isGeneratingVariations,
    currentWireframe,
    variations,
    layoutAnalysis,
    error,
    generateWireframe,
    generateVariations,
    applyFeedback,
    generateFromIntakeData,
    analyzeLayout,
    saveWireframe,
    selectVariation
  } = useEnhancedWireframe();

  useEffect(() => {
    // Initialize project name if project ID is provided
    if (projectId) {
      setProjectName(`Project-${projectId.substring(0, 8)}`);
    }
    
    // If intake data is provided, generate wireframe from intake data
    if (intakeData && Object.keys(intakeData).length > 0) {
      handleGenerateFromIntake();
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

    const result = await generateWireframe({
      userInput: prompt,
      projectId: projectId || uuidv4(),
      styleToken,
      enableLayoutIntelligence: includeLayoutIntelligence,
      customParams: {
        darkMode: false,
        creativityLevel: 8
      }
    });
    
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
        title: "Missing intake data",
        description: "No intake data provided to generate wireframe from",
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
  
  const handleApplyFeedback = async () => {
    if (!feedbackText.trim()) {
      toast({
        title: "Feedback required",
        description: "Please provide feedback to apply to the wireframe",
        variant: "destructive"
      });
      return;
    }
    
    await applyFeedback(feedbackText);
    setFeedbackDialogOpen(false);
    setFeedbackText("");
  };
  
  const handleCreateVariations = async () => {
    await generateVariations(variationCount, variationType);
    setVariationDialogOpen(false);
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
  
  const handleAnalyzeLayout = async () => {
    await analyzeLayout();
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
  
  const renderVariations = () => {
    if (!variations || variations.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/50 rounded-md">
          <p className="text-muted-foreground mb-4">No variations generated yet</p>
          <Button onClick={() => setVariationDialogOpen(true)}>Generate Variations</Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {variations.map((variation, index) => (
          <Card key={variation.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{variation.title || `Variation ${index + 1}`}</CardTitle>
              <CardDescription className="text-xs truncate">{variation.description || 'No description'}</CardDescription>
            </CardHeader>
            <CardContent className="p-2 h-[200px] overflow-hidden">
              <div className="border rounded-md overflow-hidden h-full">
                <WireframeCanvasEnhanced 
                  sections={variation.sections}
                  width={400}
                  height={200}
                  editable={false}
                  showGrid={false}
                  snapToGrid={false}
                  deviceType="desktop"
                  scale={0.4}
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button size="sm" onClick={() => selectVariation(index)} className="w-full">
                Select This Variation
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderLayoutAnalysis = () => {
    if (!layoutAnalysis) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/50 rounded-md">
          <p className="text-muted-foreground mb-4">No layout analysis available</p>
          <Button onClick={handleAnalyzeLayout}>Analyze Layout</Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Layout Patterns</CardTitle>
            <CardDescription>Identified patterns in the wireframe layout</CardDescription>
          </CardHeader>
          <CardContent>
            {layoutAnalysis.patterns?.detectedPatterns?.map((pattern: any, index: number) => (
              <div key={index} className="mb-2 p-2 border rounded-md">
                <h4 className="font-medium">{pattern.name}</h4>
                <p className="text-sm text-muted-foreground">{pattern.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Optimization Suggestions</CardTitle>
            <CardDescription>Suggestions to improve the wireframe</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {layoutAnalysis.optimizations?.suggestions?.map((suggestion: any, index: number) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="enhanced-wireframe-generator">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Wireframe Generator</h2>
          <p className="text-muted-foreground">Create and customize wireframes with advanced AI features</p>
        </div>
        <div className="flex gap-2">
          {currentWireframe && (
            <>
              <Button 
                variant="outline" 
                onClick={() => setFeedbackDialogOpen(true)} 
                disabled={isGenerating || isApplyingFeedback}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Feedback
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setVariationDialogOpen(true)} 
                disabled={isGenerating || isGeneratingVariations}
              >
                <Copy className="w-4 h-4 mr-2" />
                Variations
              </Button>
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
            </>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="generator" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="editor" disabled={!currentWireframe}>Editor</TabsTrigger>
          <TabsTrigger value="variations" disabled={!currentWireframe}>Variations</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!currentWireframe}>Analysis</TabsTrigger>
          <TabsTrigger value="code" disabled={!currentWireframe}>Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle>Generate Wireframe</CardTitle>
              <CardDescription>
                Create a new wireframe from a text description or intake form
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
                <select
                  id="styleToken"
                  value={styleToken}
                  onChange={(e) => setStyleToken(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="modern">Modern</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="corporate">Corporate</option>
                  <option value="playful">Playful</option>
                  <option value="tech">Tech</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="layoutIntelligence"
                  checked={includeLayoutIntelligence}
                  onCheckedChange={setIncludeLayoutIntelligence}
                />
                <Label htmlFor="layoutIntelligence">Enable Layout Intelligence</Label>
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
              
              {intakeData && (
                <Alert>
                  <AlertTitle>Intake Data Available</AlertTitle>
                  <AlertDescription>
                    You have intake form data available for this project. 
                    You can generate a wireframe from this data.
                    <Button variant="outline" className="mt-2" onClick={handleGenerateFromIntake}>
                      <FileInput className="w-4 h-4 mr-2" />
                      Generate from Intake Data
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateWireframe} 
                disabled={isGenerating || !prompt.trim()}
                className="ml-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate
                    <Wand2 className="w-4 h-4 ml-2" />
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
                      <CardTitle>
                        <Input 
                          value={wireframeName} 
                          onChange={(e) => setWireframeName(e.target.value)}
                          className="h-7 p-0 text-lg font-bold bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Enter wireframe title"
                        />
                      </CardTitle>
                      <CardDescription>
                        <Input 
                          value={wireframeDescription} 
                          onChange={(e) => setWireframeDescription(e.target.value)}
                          className="h-6 p-0 text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Enter wireframe description"
                        />
                      </CardDescription>
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
                  <div className="relative border rounded-md overflow-hidden" style={{ 
                    height: '600px',
                    width: devicePreview === 'desktop' ? '100%' : devicePreview === 'tablet' ? '768px' : '375px',
                    margin: devicePreview !== 'desktop' ? '0 auto' : undefined
                  }}>
                    <WireframeCanvasEnhanced 
                      sections={currentWireframe.sections}
                      width={devicePreview === 'desktop' ? 1200 : devicePreview === 'tablet' ? 768 : 375}
                      height={2000}
                      editable={true}
                      showGrid={true}
                      snapToGrid={true}
                      deviceType={devicePreview}
                      responsiveMode={devicePreview !== 'desktop'}
                    />
                  </div>
                </CardContent>
              </Card>
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
              <CardTitle className="flex items-center">
                <Copy className="mr-2 h-5 w-5" />
                Wireframe Variations
              </CardTitle>
              <CardDescription>
                Generate and explore variations of your wireframe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderVariations()}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => setVariationDialogOpen(true)}
                disabled={!currentWireframe || isGeneratingVariations}
              >
                {isGeneratingVariations ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate New Variations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutTemplate className="mr-2 h-5 w-5" />
                Layout Analysis
              </CardTitle>
              <CardDescription>
                Analyze layout patterns and get optimization suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderLayoutAnalysis()}
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
      
      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogDescription>
              Describe changes you'd like to make to the wireframe
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="E.g., Make the hero section taller, change the button color to blue, add more spacing between sections..."
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleApplyFeedback} 
              disabled={isApplyingFeedback || !feedbackText.trim()}
            >
              {isApplyingFeedback ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply Feedback"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Variations Dialog */}
      <Dialog open={variationDialogOpen} onOpenChange={setVariationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Variations</DialogTitle>
            <DialogDescription>
              Create variations of your current wireframe
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Number of variations</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={variationCount}
                onChange={(e) => setVariationCount(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label>Variation type</Label>
              <RadioGroup 
                value={variationType} 
                onValueChange={(value) => setVariationType(value as any)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="creative" id="creative" />
                  <Label htmlFor="creative">Creative (overall variations)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="layout" id="layout" />
                  <Label htmlFor="layout">Layout (structural changes)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="style" id="style" />
                  <Label htmlFor="style">Style (visual appearance)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="component" id="component" />
                  <Label htmlFor="component">Component (different elements)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVariationDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateVariations} 
              disabled={isGeneratingVariations}
            >
              {isGeneratingVariations ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedWireframeGenerator;
