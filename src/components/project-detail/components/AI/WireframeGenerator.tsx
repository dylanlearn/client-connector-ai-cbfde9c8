import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast";
import { useWireframeGeneration } from "@/hooks/use-wireframe-generation";
import { WireframeVisualizer } from '@/components/wireframe';
import { AIWireframe, WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Loader2 } from 'lucide-react';

interface WireframeGeneratorProps {
  projectId: string;
  onWireframeGenerated?: (wireframe: AIWireframe) => void;
  onWireframeSaved?: (wireframe: AIWireframe) => void;
  darkMode?: boolean;
}

const AdvancedWireframeGenerator: React.FC<WireframeGeneratorProps> = ({ 
  projectId, 
  onWireframeGenerated, 
  onWireframeSaved,
  darkMode
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [pageType, setPageType] = useState<string>('landing');
  const [stylePreference, setStylePreference] = useState<string>('modern');
  const [complexity, setComplexity] = useState<'simple' | 'moderate' | 'complex'>('moderate');
  const [creativityLevel, setCreativityLevel] = useState<number>(5);
  const [isMultiPage, setIsMultiPage] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(1);
  const [isEnhancedCreativity, setIsEnhancedCreativity] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileOptimized, setIsMobileOptimized] = useState<boolean>(true);
  const [generatedWireframe, setGeneratedWireframe] = useState<WireframeData | null>(null);
  const [wireframeName, setWireframeName] = useState<string>('Untitled Wireframe');
  const [wireframeDescription, setWireframeDescription] = useState<string>('');
  const { toast } = useToast();
  const { 
    isGenerating, 
    generateWireframe,
    currentWireframe
  } = useWireframeGeneration();

  const handleGenerateWireframe = async () => {
    if (!prompt) {
      toast({
        title: "Please enter a prompt",
        description: "Describe the wireframe you want to generate.",
        variant: "destructive"
      });
      return;
    }

    const params = {
      projectId: projectId,
      description: prompt,
      prompt: prompt,
      pageType: pageType,
      stylePreferences: [stylePreference],
      complexity: complexity,
      creativityLevel: creativityLevel,
      enhancedCreativity: isEnhancedCreativity,
      darkMode: isDarkMode,
      multiPageLayout: isMultiPage,
      pages: numPages,
    };

    try {
      const result = await generateWireframe(params);
      if (result?.wireframe) {
        const wireframeWithId = {
          ...result.wireframe,
          id: result.wireframe.id || `generated-${Date.now()}`
        };
        setGeneratedWireframe(wireframeWithId);
        toast({
          title: "Wireframe generated",
          description: "Your wireframe is ready to preview."
        });
      } else {
        toast({
          title: "Wireframe generation failed",
          description: "Please try again with a different prompt.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error generating wireframe",
        description: error.message || "Failed to generate wireframe.",
        variant: "destructive"
      });
    }
  };

  const handleSaveWireframe = () => {
    if (!generatedWireframe) {
      toast({
        title: "No wireframe to save",
        description: "Please generate a wireframe first.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Wireframe saved",
      description: "Your wireframe has been saved successfully."
    });

    if (onWireframeSaved) {
      const mockAIWireframe: AIWireframe = {
        id: 'mock-id',
        project_id: projectId,
        projectId: projectId,
        title: wireframeName,
        description: wireframeDescription,
        prompt: prompt,
        sections: generatedWireframe.sections || [],
        data: generatedWireframe,
      };
      onWireframeSaved(mockAIWireframe);
    }
  };

  return (
    <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle>AI Wireframe Generator</CardTitle>
          <CardDescription>Generate wireframes using AI with advanced options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the wireframe you want to generate"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pageType">Page Type</Label>
              <Select onValueChange={setPageType}>
                <SelectTrigger className={darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}>
                  <SelectValue placeholder="Select a page type" defaultValue={pageType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stylePreference">Style Preference</Label>
              <Select onValueChange={setStylePreference}>
                <SelectTrigger className={darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}>
                  <SelectValue placeholder="Select a style" defaultValue={stylePreference} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="complexity">Complexity</Label>
              <Select onValueChange={(value: 'simple' | 'moderate' | 'complex') => setComplexity(value)}>
                <SelectTrigger className={darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}>
                  <SelectValue placeholder="Select complexity" defaultValue={complexity} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="creativityLevel">Creativity Level</Label>
              <Slider
                id="creativityLevel"
                defaultValue={[creativityLevel]}
                max={10}
                step={1}
                onValueChange={(value) => setCreativityLevel(value[0])}
              />
              <p className="text-sm text-muted-foreground">
                Adjust the creativity level of the AI (1-10)
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="enhancedCreativity" checked={isEnhancedCreativity} onCheckedChange={setIsEnhancedCreativity} />
              <Label htmlFor="enhancedCreativity">Enhanced Creativity</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="darkMode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              <Label htmlFor="darkMode">Dark Mode</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="mobileOptimized" checked={isMobileOptimized} onCheckedChange={setIsMobileOptimized} />
              <Label htmlFor="mobileOptimized">Mobile Optimized</Label>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="multiPage" checked={isMultiPage} onCheckedChange={setIsMultiPage} />
              <Label htmlFor="multiPage">Multi-Page Layout</Label>
            </div>
            
            {isMultiPage && (
              <div className="space-y-2">
                <Label htmlFor="numPages">Number of Pages</Label>
                <Input
                  id="numPages"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue={numPages}
                  onChange={(e) => setNumPages(parseInt(e.target.value))}
                  className={darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}
                />
              </div>
            )}
          </div>
        </CardContent>
        <div className="p-4 border-t">
          <Button onClick={handleGenerateWireframe} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Wireframe"
            )}
          </Button>
        </div>
      </Card>

      {generatedWireframe && (
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle>Generated Wireframe</CardTitle>
            <CardDescription>Preview and save your generated wireframe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wireframeName">Wireframe Name</Label>
              <Input
                id="wireframeName"
                placeholder="Enter wireframe name"
                value={wireframeName}
                onChange={(e) => setWireframeName(e.target.value)}
                className={darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wireframeDescription">Wireframe Description</Label>
              <Textarea
                id="wireframeDescription"
                placeholder="Enter wireframe description"
                value={wireframeDescription}
                onChange={(e) => setWireframeDescription(e.target.value)}
                className={darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}
              />
            </div>
            
            <WireframeVisualizer 
              wireframe={{
                ...generatedWireframe,
                id: generatedWireframe.id || `generated-${Date.now()}`
              }} 
              darkMode={darkMode} 
            />
          </CardContent>
          <div className="p-4 border-t">
            <Button onClick={handleSaveWireframe} className="w-full">
              Save Wireframe
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdvancedWireframeGenerator;
