
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import WireframeEditor from './WireframeEditor';
import { Loader2, Save, FileDown, Upload, ArrowRight, Code } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Initialize project name if project ID is provided
    if (projectId) {
      setProjectName(`Project-${projectId.substring(0, 8)}`);
    }
  }, [projectId]);

  const handleGenerateWireframe = () => {
    if (!prompt.trim()) {
      toast({
        title: "Input required",
        description: "Please provide a description for the wireframe",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate wireframe generation (replace with actual API call)
    setTimeout(() => {
      const mockWireframe = {
        id: uuidv4(),
        title: projectName || "Generated Wireframe",
        description: prompt,
        sections: [
          {
            id: uuidv4(),
            name: "Hero Section",
            sectionType: "hero",
            description: "Main hero section"
          },
          {
            id: uuidv4(),
            name: "Features Section",
            sectionType: "features",
            description: "Features overview"
          }
        ],
        createdAt: new Date().toISOString()
      };
      
      setIsGenerating(false);
      toast({
        title: "Wireframe generated",
        description: "Your wireframe has been created successfully"
      });
      
      if (onWireframeGenerated) {
        onWireframeGenerated(mockWireframe);
      }
      
      // Switch to editor tab
      setActiveTab('editor');
    }, 1500);
  };
  
  const handleSaveWireframe = () => {
    toast({
      title: "Wireframe saved",
      description: "Your wireframe has been saved successfully"
    });
    
    if (onWireframeSaved) {
      onWireframeSaved({
        id: uuidv4(),
        title: projectName,
        description: prompt
      });
    }
  };
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export (replace with actual export logic)
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export completed",
        description: "Wireframe has been exported successfully"
      });
    }, 1000);
  };

  return (
    <div className="advanced-wireframe-generator">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Wireframe Generator</h2>
          <p className="text-muted-foreground">Create and customize wireframes for your project</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveWireframe}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4 mr-2" />
            )}
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
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
                <Label htmlFor="prompt">Description</Label>
                <Textarea 
                  id="prompt" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the wireframe you want to generate..."
                  rows={6}
                />
              </div>
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
          <WireframeEditor projectId={projectId} />
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
              <pre className="p-4 bg-muted/50 rounded-md overflow-auto max-h-[500px]">
                <code className="text-xs font-mono">
                  {`{
  "id": "${uuidv4()}",
  "title": "${projectName || 'Untitled Wireframe'}",
  "description": "${prompt || 'No description provided'}",
  "sections": [
    {
      "id": "${uuidv4()}",
      "name": "Hero Section",
      "sectionType": "hero",
      "description": "Main hero section"
    },
    {
      "id": "${uuidv4()}",
      "name": "Features Section",
      "sectionType": "features",
      "description": "Features overview"
    }
  ]
}`}
                </code>
              </pre>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`{
  "id": "${uuidv4()}",
  "title": "${projectName || 'Untitled Wireframe'}",
  "description": "${prompt || 'No description provided'}",
  "sections": []
}`);
                  toast({
                    title: "Copied to clipboard",
                    description: "Code has been copied to clipboard"
                  });
                }}
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
