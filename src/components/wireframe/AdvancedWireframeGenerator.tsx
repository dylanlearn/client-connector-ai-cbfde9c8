import React, { useState, useCallback, useEffect } from 'react';
import { useAdvancedWireframe } from '@/hooks/use-advanced-wireframe';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import WireframeVisualizer from './WireframeVisualizer';
import { DeviceType, ViewMode } from './types';
import { Input } from '@/components/ui/input';
import { createColorScheme } from '@/utils/copy-suggestions-helper';

interface AdvancedWireframeGeneratorProps {
  projectId: string;
  initialPrompt?: string;
  enhancedCreativity?: boolean;
  intakeData?: any;
  viewMode?: ViewMode;
  onWireframeGenerated?: (wireframe: any) => void;
  onError?: (error: Error) => void;
}

export const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId,
  initialPrompt = '',
  enhancedCreativity = true,
  intakeData,
  viewMode = 'edit',
  onWireframeGenerated,
  onError
}) => {
  // State for the generator
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [creativityLevel, setCreativityLevel] = useState<number>(8);
  const [selectedStyles, setSelectedStyles] = useState<string>('modern');
  const [colorScheme, setColorScheme] = useState<string>('default');
  const [displayDevice, setDisplayDevice] = useState<DeviceType>('desktop');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [industry, setIndustry] = useState<string>('');
  
  // Use the advanced wireframe hook
  const {
    isGenerating,
    currentWireframe,
    generateWireframe,
    error,
    intentData,
    blueprint
  } = useAdvancedWireframe();
  
  // Handle form submission
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      // Show a validation error
      return;
    }
    
    try {
      // Use our createColorScheme utility to ensure the color scheme has the right format
      const formattedColorScheme = createColorScheme(colorScheme);
      
      // Generate the wireframe
      const result = await generateWireframe({
        projectId,
        description: prompt,
        enhancedCreativity,
        creativityLevel,
        styleToken: selectedStyles,
        colorScheme: formattedColorScheme,
        industry,
        intakeData
      });
      
      // Call the callback if provided
      if (result.wireframe && onWireframeGenerated) {
        onWireframeGenerated(result.wireframe);
      }
      
      // Show success feedback
    } catch (err) {
      console.error('Error generating wireframe:', err);
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  }, [prompt, projectId, enhancedCreativity, creativityLevel, selectedStyles, colorScheme, industry, intakeData, generateWireframe, onWireframeGenerated, onError]);
  
  // Auto-generate wireframe when initialPrompt is provided
  useEffect(() => {
    if (initialPrompt && !currentWireframe && !isGenerating) {
      handleGenerate();
    }
  }, [initialPrompt, currentWireframe, isGenerating, handleGenerate]);
  
  
  return (
    <div className="wireframe-generator">
      {/* Form and controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Wireframe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                Describe your wireframe
              </label>
              <Textarea
                id="prompt"
                placeholder="E.g., A website for a coffee shop with a hero section, about us, menu, and contact form..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-20"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="style" className="block text-sm font-medium mb-1">
                  Style
                </label>
                <Input
                  id="style"
                  placeholder="E.g., modern, minimal, corporate..."
                  value={selectedStyles}
                  onChange={(e) => setSelectedStyles(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium mb-1">
                  Industry
                </label>
                <Input
                  id="industry"
                  placeholder="E.g., tech, healthcare, education..."
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="creativity" className="block text-sm font-medium mb-1">
                Creativity Level: {creativityLevel}
              </label>
              <Slider
                id="creativity"
                defaultValue={[creativityLevel]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setCreativityLevel(value[0])}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Wireframe'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Preview area */}
      {currentWireframe && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{currentWireframe.title}</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDisplayDevice('mobile')}
              >
                Mobile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDisplayDevice('tablet')}
              >
                Tablet
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDisplayDevice('desktop')}
              >
                Desktop
              </Button>
            </div>
          </div>
          
          <div className={`wireframe-preview-container ${displayDevice}`}>
            <WireframeVisualizer 
              wireframe={currentWireframe}
              deviceType={displayDevice}
              darkMode={isDarkMode}
              viewMode={viewMode}
            />
          </div>
        </div>
      )}
      
      {/* Error display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-red-800 font-medium">Error generating wireframe</h4>
          <p className="text-red-600">{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedWireframeGenerator;
