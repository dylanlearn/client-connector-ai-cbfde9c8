
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import WireframeEditor from './WireframeEditor';
import { Loader2, Save, FileDown, Upload, ArrowRight, Code, Smartphone, Laptop } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAdvancedWireframe } from '@/hooks/use-advanced-wireframe';
import { WireframeCanvasEnhanced } from './WireframeCanvasEnhanced';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export interface AdvancedWireframeGeneratorProps {
  projectId?: string;
  onWireframeGenerated?: (wireframe: any) => void;
  onWireframeSaved?: (wireframe: any) => void;
  viewMode?: 'editor' | 'preview';
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId,
  onWireframeGenerated,
  onWireframeSaved,
  viewMode = 'editor'
}) => {
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [prompt, setPrompt] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [styleToken, setStyleToken] = useState<string>("modern");
  const [includeDesignMemory, setIncludeDesignMemory] = useState<boolean>(true);
  const [wireframeName, setWireframeName] = useState<string>("");
  const [wireframeDescription, setWireframeDescription] = useState<string>("");
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const { toast } = useToast();
  
  // Use the actual advanced wireframe hook
  const { 
    isGenerating, 
    currentWireframe, 
    intentData, 
    blueprint,
    generateWireframe,
    saveWireframe,
    error
  } = useAdvancedWireframe();

  useEffect(() => {
    // Initialize project name if project ID is provided
    if (projectId) {
      setProjectName(`Project-${projectId.substring(0, 8)}`);
    }
  }, [projectId]);

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
      styleToken,
      includeDesignMemory,
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
  
  const handleSaveWireframe = async () => {
    if (!currentWireframe) {
      toast({
        title: "No wireframe to save",
        description: "Please generate a wireframe first",
        variant: "destructive"
      });
      return;
    }
    
    // Use the actual save function from the hook
    const savedWireframe = await saveWireframe(
      projectId || uuidv4(),
      prompt
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

  return (
    <div className="advanced-wireframe-generator">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Wireframe Generator</h2>
          <p className="text-muted-foreground">Create and customize wireframes for your project</p>
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
          <TabsTrigger value="code" disabled={!currentWireframe}>Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle>Generate Wireframe</CardTitle>
              <CardDescription>
                Create a new wireframe from a text description
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
                      <CardTitle>{wireframeName || "New Wireframe"}</CardTitle>
                      <CardDescription>{wireframeDescription}</CardDescription>
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
                      editable={false}
                      showGrid={true}
                      snapToGrid={true}
                      deviceType={devicePreview}
                      responsiveMode={devicePreview !== 'desktop'}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <WireframeEditor projectId={projectId} wireframeData={currentWireframe} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted rounded-md">
              <p className="text-muted-foreground">No wireframe to edit. Generate one first.</p>
            </div>
          )}
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

export default AdvancedWireframeGenerator;
