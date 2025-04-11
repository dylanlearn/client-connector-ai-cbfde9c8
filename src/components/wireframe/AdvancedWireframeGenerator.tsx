
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { ViewMode } from './types';
import WireframeVisualizer from './WireframeVisualizer';
import { Loader2 } from 'lucide-react';

interface AdvancedWireframeGeneratorProps {
  projectId: string;
  initialPrompt?: string;
  onWireframeGenerated?: (wireframeData: WireframeData) => void;
  enhancedCreativity?: boolean;
  intakeData?: any;
  viewMode?: ViewMode;
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId,
  initialPrompt = '',
  onWireframeGenerated,
  enhancedCreativity = true,
  intakeData,
  viewMode = 'editor'
}) => {
  const { toast } = useToast();
  const [description, setDescription] = useState(initialPrompt);
  const [creativityLevel, setCreativityLevel] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWireframe, setGeneratedWireframe] = useState<WireframeData | null>(null);
  const [styleToken, setStyleToken] = useState('modern');
  const [colorScheme, setColorScheme] = useState('blue');
  const [industry, setIndustry] = useState('');
  const [error, setError] = useState<Error | null>(null);
  
  // Sample industries list
  const industries = [
    'Technology',
    'Healthcare',
    'Education',
    'Finance',
    'E-commerce',
    'Travel',
    'Food & Beverage',
    'Entertainment',
    'Manufacturing',
    'Real Estate',
    'Professional Services'
  ];
  
  // Sample style tokens
  const styleTokens = [
    'modern',
    'minimalist',
    'corporate',
    'creative',
    'bold',
    'elegant',
    'playful',
    'retro',
    'futuristic',
    'handcrafted'
  ];
  
  // Sample color schemes
  const colorSchemes = [
    'blue',
    'green',
    'red',
    'purple',
    'orange',
    'gray',
    'teal',
    'pink',
    'indigo',
    'amber'
  ];
  
  // Function to generate wireframe
  const generateWireframe = async () => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a description for the wireframe",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Mock wireframe generation service call
      // In a real implementation, this would call your actual wireframe generation service
      
      // Create color scheme object from the string selection
      const colorSchemeObject: Record<string, string> = {};
      switch (colorScheme) {
        case 'blue':
          colorSchemeObject.primary = '#3b82f6';
          colorSchemeObject.secondary = '#93c5fd';
          colorSchemeObject.accent = '#1d4ed8';
          colorSchemeObject.background = '#f8fafc';
          break;
        case 'green':
          colorSchemeObject.primary = '#10b981';
          colorSchemeObject.secondary = '#6ee7b7';
          colorSchemeObject.accent = '#059669';
          colorSchemeObject.background = '#f8fafc';
          break;
        default:
          colorSchemeObject.primary = '#3b82f6';
          colorSchemeObject.secondary = '#93c5fd';
          colorSchemeObject.accent = '#1d4ed8';
          colorSchemeObject.background = '#f8fafc';
          break;
      }
      
      // In a real implementation, call the API with proper params
      const generationParams = {
        projectId,
        description,
        enhancedCreativity,
        creativityLevel,
        styleToken,
        colorScheme: colorSchemeObject,
        industry,
        intakeData
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response with empty sections
      const mockWireframeData: WireframeData = {
        id: `wireframe-${Date.now()}`,
        title: "Generated Wireframe",
        description: description.substring(0, 100),
        sections: [
          {
            id: `section-hero-${Date.now()}`,
            name: "Hero Section",
            sectionType: "hero",
            componentVariant: "centered",
            copySuggestions: {
              heading: "Welcome to our Platform",
              subheading: "The best solution for your needs",
              ctaText: "Get Started"
            }
          },
          {
            id: `section-features-${Date.now()}`,
            name: "Features Section",
            sectionType: "features",
            componentVariant: "grid",
            copySuggestions: {
              heading: "Our Features",
              subheading: "Discover what makes us special"
            }
          }
        ],
        colorScheme: colorSchemeObject,
        typography: {
          headings: "sans-serif",
          body: "sans-serif"
        }
      };
      
      setGeneratedWireframe(mockWireframeData);
      
      if (onWireframeGenerated) {
        onWireframeGenerated(mockWireframeData);
      }
      
      toast({
        title: "Wireframe generated",
        description: "Your wireframe has been successfully created"
      });
      
    } catch (err) {
      console.error("Error generating wireframe:", err);
      setError(err instanceof Error ? err : new Error("Failed to generate wireframe"));
      
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="advanced-wireframe-generator">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <Card className="h-full">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  placeholder="Describe the wireframe you want to generate..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full"
                  rows={4}
                  disabled={isGenerating}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={isGenerating}
                >
                  <option value="">Select an industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind.toLowerCase()}>{ind}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Style</label>
                  <select
                    value={styleToken}
                    onChange={(e) => setStyleToken(e.target.value)}
                    className="w-full p-2 border rounded"
                    disabled={isGenerating}
                  >
                    {styleTokens.map((style) => (
                      <option key={style} value={style}>{style.charAt(0).toUpperCase() + style.slice(1)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Color Scheme</label>
                  <select
                    value={colorScheme}
                    onChange={(e) => setColorScheme(e.target.value)}
                    className="w-full p-2 border rounded"
                    disabled={isGenerating}
                  >
                    {colorSchemes.map((color) => (
                      <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Creativity Level</span>
                  <span>{creativityLevel}</span>
                </div>
                <Slider
                  value={[creativityLevel]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(values) => setCreativityLevel(values[0])}
                  disabled={isGenerating}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Conventional</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <Button 
                onClick={generateWireframe}
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Wireframe'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Preview Panel */}
        <Card className="h-full overflow-hidden">
          <CardContent className="p-0 h-full">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Generating wireframe...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full p-4">
                <div className="text-center max-w-md">
                  <p className="text-red-500 font-medium mb-2">Error</p>
                  <p className="text-muted-foreground">{error.message}</p>
                </div>
              </div>
            ) : generatedWireframe ? (
              <div className="h-full overflow-auto p-4">
                <WireframeVisualizer 
                  wireframe={generatedWireframe}
                  viewMode="preview"
                  deviceType="desktop"
                  darkMode={false}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">No wireframe generated yet</p>
                  <p className="text-sm text-muted-foreground">Fill in the form and click Generate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedWireframeGenerator;
