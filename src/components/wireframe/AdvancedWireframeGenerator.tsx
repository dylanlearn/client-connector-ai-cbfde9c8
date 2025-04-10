
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdvancedWireframe } from '@/hooks/use-advanced-wireframe';
import LoadingStateWrapper from '@/components/ui/LoadingStateWrapper';
import EnhancedWireframeStudio from './EnhancedWireframeStudio';
import { AlertTriangle, Loader2, Wand2, Palette } from 'lucide-react';

export interface AdvancedWireframeGeneratorProps {
  projectId: string;
  viewMode?: 'editor' | 'preview';
  className?: string;
}

/**
 * Advanced wireframe generator component with AI-powered generation
 * and comprehensive editing capabilities
 */
const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId,
  viewMode = 'editor',
  className
}) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [creativityLevel, setCreativityLevel] = useState(7);
  const [colorScheme, setColorScheme] = useState('');
  const [industry, setIndustry] = useState('');
  
  const {
    isGenerating,
    currentWireframe,
    error,
    generateWireframe,
    saveWireframe,
  } = useAdvancedWireframe();

  const handleGenerateWireframe = async () => {
    if (!prompt) return;
    
    await generateWireframe({
      description: prompt,
      style,
      creativityLevel,
      colorScheme: colorScheme || undefined,
      industry: industry || undefined,
      projectId
    });
    
    // Switch to preview tab after generation
    if (activeTab === 'generate') {
      setActiveTab('preview');
    }
  };

  const handleSaveWireframe = async () => {
    if (!currentWireframe) return;
    
    await saveWireframe(projectId, prompt);
  };

  const renderGenerationForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prompt">What would you like to create?</Label>
        <Textarea
          id="prompt"
          placeholder="E.g., A modern website for a tech startup with a hero section, features, pricing, and testimonials..."
          className="mt-1.5 min-h-[120px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="style">Design Style</Label>
          <Select
            value={style}
            onValueChange={setStyle}
          >
            <SelectTrigger id="style" className="mt-1.5">
              <SelectValue placeholder="Select design style" />
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
        
        <div>
          <Label htmlFor="industry">Industry (Optional)</Label>
          <Input
            id="industry"
            placeholder="E.g., Healthcare, Education, Finance"
            className="mt-1.5"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between">
          <Label htmlFor="creativityLevel">Creativity Level: {creativityLevel}</Label>
        </div>
        <Slider
          id="creativityLevel"
          min={1}
          max={10}
          step={1}
          value={[creativityLevel]}
          onValueChange={(values) => setCreativityLevel(values[0])}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Conservative</span>
          <span>Balanced</span>
          <span>Experimental</span>
        </div>
      </div>
      
      <div>
        <Label htmlFor="colorScheme">Color Scheme (Optional)</Label>
        <Input
          id="colorScheme"
          placeholder="E.g., blue and white, earth tones, vibrant colors"
          className="mt-1.5"
          value={colorScheme}
          onChange={(e) => setColorScheme(e.target.value)}
        />
      </div>
      
      <Button
        className="w-full mt-2"
        disabled={!prompt || isGenerating}
        onClick={handleGenerateWireframe}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Wireframe
          </>
        )}
      </Button>
    </div>
  );

  // If in preview mode, show a simplified interface
  if (viewMode === 'preview') {
    return (
      <div className={className}>
        <LoadingStateWrapper 
          isLoading={isGenerating}
          error={error}
          isEmpty={!currentWireframe}
          emptyState={
            <div className="text-center p-8">
              <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-medium">No wireframe generated yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Describe what you'd like to create and click Generate
              </p>
            </div>
          }
        >
          {currentWireframe && (
            <div className="overflow-hidden border rounded-md">
              <EnhancedWireframeStudio 
                projectId={projectId} 
                initialData={currentWireframe}
                standalone={false}
              />
            </div>
          )}
        </LoadingStateWrapper>
        
        <div className="mt-4">
          <Textarea
            placeholder="Describe what you'd like to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mb-2"
          />
          <Button
            className="w-full"
            disabled={!prompt || isGenerating}
            onClick={handleGenerateWireframe}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Wireframe
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }
  
  // Full editor mode
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>AI Wireframe Generator</CardTitle>
          <CardDescription>
            Generate wireframes using AI based on your description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="mt-0">
              {renderGenerationForm()}
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <LoadingStateWrapper 
                isLoading={isGenerating}
                error={error}
                isEmpty={!currentWireframe}
                emptyState={
                  <div className="text-center p-8 border rounded-md bg-muted/50">
                    <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 font-medium">No wireframe generated yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Go to the Generate tab to create a new wireframe
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('generate')}
                    >
                      Start Generation
                    </Button>
                  </div>
                }
              >
                {currentWireframe && (
                  <div className="overflow-hidden border rounded-md">
                    <EnhancedWireframeStudio 
                      projectId={projectId} 
                      initialData={currentWireframe}
                      standalone={false}
                    />
                  </div>
                )}
              </LoadingStateWrapper>
            </TabsContent>
          </Tabs>
        </CardContent>
        {currentWireframe && activeTab === 'preview' && (
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={handleSaveWireframe}
              disabled={isGenerating}
            >
              Save Wireframe
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AdvancedWireframeGenerator;
