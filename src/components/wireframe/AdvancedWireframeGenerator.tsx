
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2, Lightbulb, Download, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedWireframe } from '@/hooks/use-advanced-wireframe';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { DeviceType, ViewMode } from './types';
import { v4 as uuidv4 } from 'uuid';
import WireframeVisualizer from './WireframeVisualizer';
import WireframePreviewSystem from './preview/WireframePreviewSystem';
import { useWireframeStore } from '@/stores/wireframe-store';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdvancedWireframeGeneratorProps {
  projectId?: string;
  viewMode?: ViewMode;
  onWireframeGenerated?: (wireframe: WireframeData) => void;
  initialPrompt?: string;
  enhancedCreativity?: boolean;
  intakeData?: any;
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId = uuidv4(),
  viewMode = 'preview',
  onWireframeGenerated,
  initialPrompt = '',
  enhancedCreativity = false,
  intakeData
}) => {
  const { toast } = useToast();
  const { 
    isGenerating, 
    currentWireframe, 
    generationResults, 
    intentData, 
    blueprint, 
    generateWireframe, 
    saveWireframe,
    error 
  } = useAdvancedWireframe();

  const setWireframe = useWireframeStore(state => state.setWireframe);
  const setWireframeData = useWireframeStore(state => state.setWireframeData);
  
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isEnhancedCreativity, setIsEnhancedCreativity] = useState<boolean>(enhancedCreativity);
  const [wireframeTitle, setWireframeTitle] = useState<string>('New Wireframe');
  const [wireframeDescription, setWireframeDescription] = useState<string>('');
  const [creativityLevel, setCreativityLevel] = useState<number>(7);
  const [colorScheme, setColorScheme] = useState<string>('modern');
  const [styleToken, setStyleToken] = useState<string>('professional');
  const [industry, setIndustry] = useState<string>('');
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Available style tokens and color schemes
  const styleTokens = [
    'professional', 'modern', 'creative', 'minimalist', 
    'elegant', 'bold', 'playful', 'luxury', 'technical'
  ];
  
  const colorSchemes = [
    'modern', 'minimal', 'vibrant', 'earthy', 
    'professional', 'dark', 'light', 'warm', 'cool'
  ];
  
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 
    'Retail', 'Manufacturing', 'Real Estate', 'Hospitality',
    'Entertainment', 'Nonprofit', 'Other'
  ];

  // Function to handle section click
  const handleSectionClick = useCallback((sectionId: string) => {
    // Set the selected section ID
    setSelectedSectionId(sectionId);
  }, []);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
    
    // Populate from intake data if available
    if (intakeData) {
      if (intakeData.industryType) {
        setIndustry(intakeData.industryType);
      }
      
      if (intakeData.designPreferences?.visualStyle) {
        setStyleToken(intakeData.designPreferences.visualStyle.toLowerCase());
      }
      
      if (intakeData.businessName) {
        const title = `${intakeData.businessName} Website`;
        setWireframeTitle(title);
      }
      
      if (intakeData.businessDescription) {
        setWireframeDescription(intakeData.businessDescription);
      }
    }
  }, [initialPrompt, intakeData]);

  // Update the wireframe store when currentWireframe changes
  useEffect(() => {
    if (currentWireframe) {
      setWireframe(currentWireframe);
      setWireframeData(currentWireframe);
    }
  }, [currentWireframe, setWireframe, setWireframeData]);

  const handleGenerateWireframe = async () => {
    if (!projectId) {
      toast({
        title: "Project ID is required",
        description: "Please provide a valid project ID.",
        variant: "destructive"
      });
      return;
    }
    
    if (!prompt && !lastGeneratedPrompt) {
      toast({
        title: "Prompt is required",
        description: "Please enter a description for your wireframe.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const currentPrompt = prompt || lastGeneratedPrompt;
      setLastGeneratedPrompt(currentPrompt);
      
      const params = {
        projectId: projectId,
        description: currentPrompt,
        enhancedCreativity: isEnhancedCreativity,
        creativityLevel: creativityLevel,
        styleToken: styleToken,
        colorScheme: colorScheme,
        industry: industry,
        intakeData: intakeData
      };

      const result = await generateWireframe(params);

      if (result && result.success && result.wireframe) {
        // Update wireframe title and description
        const updatedWireframe = {
          ...result.wireframe,
          title: wireframeTitle || result.wireframe.title || 'New Wireframe',
          description: wireframeDescription || result.wireframe.description || currentPrompt.substring(0, 100)
        };

        if (onWireframeGenerated) {
          onWireframeGenerated(updatedWireframe);
        }
        
        // Show success toast
        toast({
          title: "Wireframe Generated!",
          description: "Your wireframe has been created successfully.",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: result?.error || "Failed to generate wireframe. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating wireframe:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWireframe = async () => {
    if (!projectId) {
      toast({
        title: "Project ID is required",
        description: "Please provide a valid project ID.",
        variant: "destructive"
      });
      return;
    }

    if (!currentWireframe) {
      toast({
        title: "No wireframe to save",
        description: "Please generate a wireframe before saving.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await saveWireframe(projectId, wireframeDescription);
      
      toast({
        title: "Wireframe Saved",
        description: "Your wireframe has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving wireframe:", error);
      toast({
        title: "Error Saving",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="advanced-wireframe-generator space-y-6">
      <div className="prompt-input-area space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">Wireframe Title</Label>
            <Input
              id="title"
              placeholder="Enter wireframe title"
              value={wireframeTitle}
              onChange={(e) => setWireframeTitle(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind.toLowerCase()}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="prompt">Design Description</Label>
          <Textarea
            id="prompt"
            placeholder="Describe your wireframe in detail..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="style">Visual Style</Label>
            <Select value={styleToken} onValueChange={setStyleToken}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {styleTokens.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="colorScheme">Color Scheme</Label>
            <Select value={colorScheme} onValueChange={setColorScheme}>
              <SelectTrigger>
                <SelectValue placeholder="Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                {colorSchemes.map((scheme) => (
                  <SelectItem key={scheme} value={scheme}>
                    {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col justify-end space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="creativity"
                checked={isEnhancedCreativity}
                onCheckedChange={(checked) => setIsEnhancedCreativity(checked === true)}
              />
              <Label htmlFor="creativity" className="cursor-pointer">
                Enhanced Creativity
              </Label>
            </div>
            
            {isEnhancedCreativity && (
              <div className="flex items-center space-x-4">
                <span className="text-xs text-muted-foreground">Conservative</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={creativityLevel}
                  onChange={(e) => setCreativityLevel(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Creative</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleGenerateWireframe}
            disabled={isGenerating || isLoading}
            className="flex-1"
          >
            {isGenerating || isLoading ? (
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
          
          {currentWireframe && (
            <Button
              onClick={handleSaveWireframe}
              disabled={isGenerating || isLoading || !currentWireframe}
              variant="outline"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Save Wireframe
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h4 className="font-medium">Error</h4>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {currentWireframe && (
        <div className="wireframe-preview mt-6">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <WireframePreviewSystem 
                wireframe={currentWireframe} 
                onSectionClick={handleSectionClick}
                projectId={projectId}
              />
            </CardContent>
          </Card>
          
          {intentData && (
            <div className="mt-4">
              <details className="text-sm">
                <summary className="cursor-pointer font-medium flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Design Intent Analysis
                </summary>
                <div className="mt-2 p-4 bg-muted/50 rounded-md text-xs">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(intentData, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedWireframeGenerator;
