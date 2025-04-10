
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, Download, Code, Eye, Brush, Settings, Loader2, Plus, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWireframeStore } from '@/stores/wireframe-store';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import LoadingStateWrapper from '../ui/LoadingStateWrapper';
import AIWireframeRenderer from './AIWireframeRenderer';
import { exportToHTML } from '@/utils/wireframe/export-utils';

export interface WireframeEditorProps {
  projectId?: string;
  wireframeData?: WireframeData | null;
  onUpdate?: (updatedWireframe: WireframeData) => void;
  onGenerateNew?: (params: any) => Promise<any>;
  onSave?: (wireframe: WireframeData) => Promise<any>;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ 
  projectId, 
  wireframeData, 
  onUpdate,
  onGenerateNew,
  onSave
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('preview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { wireframe: storeWireframe, setWireframe, activeSection } = useWireframeStore();
  
  // Form state for wireframe generation
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>(wireframeData?.title || 'Untitled Wireframe');
  const [styleToken, setStyleToken] = useState<string>(wireframeData?.styleToken || 'modern');
  const [creativityLevel, setCreativityLevel] = useState<number>(8);
  const [industry, setIndustry] = useState<string>('');
  
  // Get the wireframe from store or props
  const currentWireframe = storeWireframe || wireframeData;
  
  // Update store when wireframeData prop changes
  useEffect(() => {
    if (wireframeData && (!storeWireframe || wireframeData.id !== storeWireframe.id)) {
      setWireframe(wireframeData);
      setTitle(wireframeData.title);
      setStyleToken(wireframeData.styleToken || 'modern');
    }
  }, [wireframeData, storeWireframe, setWireframe]);
  
  const handleSave = () => {
    if (!currentWireframe) return;
    
    const updatedWireframe = {
      ...currentWireframe,
      title,
      styleToken
    };
    
    if (onUpdate) {
      onUpdate(updatedWireframe);
    }
    
    if (onSave) {
      try {
        setIsLoading(true);
        onSave(updatedWireframe)
          .then(() => {
            toast({
              title: "Wireframe saved",
              description: "Your wireframe has been saved successfully"
            });
          })
          .catch(err => {
            toast({
              title: "Save failed",
              description: err.message || "There was an error saving your wireframe",
              variant: "destructive"
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (err: any) {
        toast({
          title: "Save failed",
          description: err.message || "There was an error saving your wireframe",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }
  };
  
  const handleGenerate = async () => {
    if (!onGenerateNew || !description) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await onGenerateNew({
        description,
        styleToken,
        creativityLevel,
        industry: industry || undefined,
        projectId
      });
      
      if (result && result.wireframe) {
        setWireframe(result.wireframe);
        setTitle(result.wireframe.title || 'Generated Wireframe');
        setActiveTab('preview');
        
        toast({
          title: "Wireframe generated",
          description: "Your new wireframe has been created successfully"
        });
      } else {
        throw new Error(result?.error || 'Failed to generate wireframe');
      }
    } catch (err: any) {
      console.error("Wireframe generation error:", err);
      setError(err instanceof Error ? err : new Error(err?.message || 'An unknown error occurred'));
      
      toast({
        title: "Generation failed",
        description: err.message || "There was an error generating your wireframe",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExportHTML = async () => {
    if (!currentWireframe) return;
    
    try {
      const html = await exportToHTML(currentWireframe);
      
      // Create and download the file
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentWireframe.title || 'wireframe'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "HTML file has been downloaded"
      });
    } catch (err) {
      console.error("Export error:", err);
      toast({
        title: "Export failed",
        description: "Failed to export wireframe to HTML",
        variant: "destructive"
      });
    }
  };
  
  const handleCopyJSON = () => {
    if (!currentWireframe) return;
    
    try {
      const json = JSON.stringify(currentWireframe, null, 2);
      navigator.clipboard.writeText(json);
      
      toast({
        title: "JSON copied",
        description: "Wireframe JSON copied to clipboard"
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy wireframe JSON",
        variant: "destructive"
      });
    }
  };
  
  const handleSectionClick = (sectionId: string) => {
    toast({
      title: "Section selected",
      description: `Section ID: ${sectionId}`,
    });
  };
  
  return (
    <div className="wireframe-editor">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview" className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> Preview
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Generate
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center gap-1">
            <Brush className="w-4 h-4" /> Customize
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-1">
            <Code className="w-4 h-4" /> Export
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="p-0 border rounded-md mt-4">
          <LoadingStateWrapper 
            isLoading={isLoading}
            error={error}
            isEmpty={!currentWireframe}
            loadingMessage="Loading wireframe preview..."
            emptyState={
              <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">No wireframe to display</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('generate')}
                  >
                    Generate New Wireframe
                  </Button>
                </div>
              </div>
            }
          >
            {currentWireframe && (
              <>
                <div className="bg-muted p-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{currentWireframe.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {currentWireframe.sections?.length} sections | Style: {currentWireframe.styleToken || 'Default'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-1" /> Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportHTML}>
                      <Download className="w-4 h-4 mr-1" /> Export
                    </Button>
                  </div>
                </div>
                <div className="p-4 overflow-auto max-h-[800px]">
                  <AIWireframeRenderer 
                    wireframe={currentWireframe} 
                    onSectionClick={handleSectionClick}
                    activeSection={activeSection}
                  />
                </div>
              </>
            )}
          </LoadingStateWrapper>
        </TabsContent>
        
        <TabsContent value="generate" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Wireframe</CardTitle>
              <CardDescription>
                Create a new wireframe by describing what you need
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Wireframe Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the website or application you want to create..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Design Style</Label>
                  <Select 
                    value={styleToken}
                    onValueChange={setStyleToken}
                  >
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry (Optional)</Label>
                  <Input
                    id="industry"
                    placeholder="e.g. Healthcare, Education, etc."
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="creativity" className="flex justify-between">
                  <span>Creativity Level</span>
                  <span className="text-muted-foreground">{creativityLevel} / 10</span>
                </Label>
                <Slider
                  id="creativity"
                  min={1}
                  max={10}
                  step={1}
                  value={[creativityLevel]}
                  onValueChange={(values) => setCreativityLevel(values[0])}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Higher values produce more creative and experimental designs.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('preview')}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={!description || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate Wireframe</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="customize" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customize Wireframe</CardTitle>
              <CardDescription>
                Edit properties and settings for your wireframe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Wireframe Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="style-token">Style</Label>
                <Select 
                  value={styleToken}
                  onValueChange={setStyleToken}
                >
                  <SelectTrigger id="style-token">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="elegant">Elegant</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {currentWireframe?.sections && (
                <div className="space-y-2">
                  <Label>Sections ({currentWireframe.sections.length})</Label>
                  <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                    {currentWireframe.sections.map((section, index) => (
                      <div 
                        key={section.id || index} 
                        className="py-2 px-3 text-sm hover:bg-muted rounded cursor-pointer flex justify-between items-center"
                      >
                        <span>{section.name || section.sectionType || `Section ${index + 1}`}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Wireframe</CardTitle>
              <CardDescription>
                Export your wireframe to different formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={handleExportHTML}
                  disabled={!currentWireframe}
                >
                  <Download className="h-6 w-6" />
                  <span>Export as HTML</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={handleCopyJSON}
                  disabled={!currentWireframe}
                >
                  <Copy className="h-6 w-6" />
                  <span>Copy JSON</span>
                </Button>
              </div>
              
              {currentWireframe && (
                <div className="mt-6">
                  <Label>JSON Data</Label>
                  <div className="bg-muted p-3 rounded-md mt-2 overflow-auto max-h-[300px]">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(currentWireframe, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WireframeEditor;
