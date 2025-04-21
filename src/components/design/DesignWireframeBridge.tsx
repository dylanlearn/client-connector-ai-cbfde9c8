
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Lightbulb, Info, PaintBucket } from 'lucide-react';
import { DesignSuggestion } from '@/hooks/wireframe/use-wireframe-variations';
import { WireframeGenerationResult, WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useWireframeGenerator } from '@/hooks/wireframe/use-wireframe-generator';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface DesignWireframeBridgeProps {
  projectId?: string;
  designSuggestion: DesignSuggestion | null;
  onWireframeGenerated: (result: WireframeGenerationResult) => void;
}

export const DesignWireframeBridge: React.FC<DesignWireframeBridgeProps> = ({
  projectId,
  designSuggestion,
  onWireframeGenerated
}) => {
  const [description, setDescription] = useState('');
  const [creativityLevel, setCreativityLevel] = useState(7); // Medium-high creativity
  const [prompt, setPrompt] = useState('');
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const { generateWireframe, isGenerating } = useWireframeGenerator(
    creativityLevel,
    (result) => {
      if (result && result.wireframe) {
        onWireframeGenerated(result);
      }
    },
    toast
  );

  // Generate enhanced prompt whenever inputs change
  useEffect(() => {
    if (!description) return;
    
    let enhancedPrompt = `Create a wireframe for: ${description}`;
    
    if (designSuggestion) {
      enhancedPrompt += `\nDesign Parameters:`;
      
      if (designSuggestion.colorScheme) {
        enhancedPrompt += `\n- Color Scheme: Primary ${designSuggestion.colorScheme.primary}, Secondary ${designSuggestion.colorScheme.secondary}`;
      }
      
      if (designSuggestion.typography) {
        enhancedPrompt += `\n- Typography: Headings ${designSuggestion.typography.headings}, Body ${designSuggestion.typography.body}`;
      }
      
      if (designSuggestion.layoutStyle) {
        enhancedPrompt += `\n- Layout Style: ${designSuggestion.layoutStyle}`;
      }
      
      if (designSuggestion.toneDescriptor) {
        enhancedPrompt += `\n- Design Tone: ${designSuggestion.toneDescriptor}`;
      }
    }
    
    enhancedPrompt += `\nCreativity Level: ${creativityLevel}/10`;
    enhancedPrompt += `\nCreate a responsive, modern design with thoughtful UI components and intuitive user flow.`;
    
    setPrompt(enhancedPrompt);
  }, [description, designSuggestion, creativityLevel]);
  
  const handleGenerate = async () => {
    if (!designSuggestion) {
      toast({
        title: "Design selection required",
        description: "Please select design preferences before generating a wireframe",
        variant: "destructive"
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a description of what you want to create",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await generateWireframe({
        description,
        creativityLevel,
        enhancedCreativity: true,
        // Apply design suggestions to wireframe generation
        customParams: {
          colorScheme: designSuggestion.colorScheme,
          typography: designSuggestion.typography,
          layoutStyle: designSuggestion.layoutStyle,
          toneDescriptor: designSuggestion.toneDescriptor,
          projectId
        }
      });
      
      if (result && result.wireframe) {
        toast({
          title: "Wireframe generated",
          description: "Your wireframe has been created with the selected design preferences"
        });
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate wireframe",
        variant: "destructive"
      });
    }
  };

  // Generate a suggested description based on design parameters
  const generateSuggestion = () => {
    if (!designSuggestion) return;
    
    let suggestion = '';
    
    const tone = designSuggestion.toneDescriptor || 'modern';
    const layout = designSuggestion.layoutStyle || 'standard';
    
    const pageTypes = ['landing page', 'product page', 'about us page', 'contact page', 'services page'];
    const selectedPage = pageTypes[Math.floor(Math.random() * pageTypes.length)];
    
    suggestion = `A ${tone} ${selectedPage} with a ${layout} layout design that showcases content effectively`;
    
    setDescription(suggestion);
    toast({
      title: "Suggestion added",
      description: "A description has been generated based on your design preferences"
    });
  };
  
  return (
    <div className="design-wireframe-bridge space-y-6">
      {!designSuggestion ? (
        <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertDescription>
            Please select design preferences in the previous step before continuing.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription className="flex items-center gap-2">
            <PaintBucket className="h-4 w-4" />
            Design preferences selected and ready to be applied.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="description" className="flex items-center gap-2">
              Describe what you want to create
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Describe the purpose, content, and features of your design. The more specific you are, the better the result.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                placeholder="E.g., A landing page for a software product with hero section, features, and testimonials"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 pr-10"
              />
              {designSuggestion && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2"
                  onClick={generateSuggestion}
                  title="Get suggestion"
                >
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="creativity">Creativity Level: {creativityLevel}/10</Label>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-6 px-2 text-muted-foreground"
              onClick={() => setIsPromptVisible(!isPromptVisible)}
            >
              {isPromptVisible ? 'Hide Prompt' : 'View Prompt'}
            </Button>
          </div>
          
          <input
            id="creativity"
            type="range"
            min="1"
            max="10"
            value={creativityLevel}
            onChange={(e) => setCreativityLevel(Number(e.target.value))}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Conservative</span>
            <span>Balanced</span>
            <span>Creative</span>
          </div>
        </div>

        {isPromptVisible && prompt && (
          <div className="mt-2 p-3 bg-muted text-xs rounded-md font-mono overflow-x-auto">
            {prompt.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleGenerate}
        disabled={isGenerating || !designSuggestion}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Wireframe...
          </>
        ) : (
          'Generate Wireframe'
        )}
      </Button>
      
      {designSuggestion && (
        <div className="mt-4 p-4 bg-muted/50 rounded-md">
          <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
            <PaintBucket className="h-4 w-4" />
            Design Parameters
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {designSuggestion.colorScheme && (
              <div>
                <span className="text-muted-foreground">Primary Color:</span>{' '}
                <div className="inline-flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: designSuggestion.colorScheme.primary }}
                  />
                  <Badge variant="outline" className="text-[10px] h-5">
                    {designSuggestion.colorScheme.primary}
                  </Badge>
                </div>
              </div>
            )}
            
            {designSuggestion.typography && (
              <div>
                <span className="text-muted-foreground">Typography:</span>{' '}
                <Badge variant="outline" className="text-[10px] h-5">
                  {designSuggestion.typography.headings}
                </Badge>
              </div>
            )}
            
            {designSuggestion.layoutStyle && (
              <div>
                <span className="text-muted-foreground">Layout:</span>{' '}
                <Badge variant="outline" className="text-[10px] h-5">
                  {designSuggestion.layoutStyle}
                </Badge>
              </div>
            )}
            
            {designSuggestion.toneDescriptor && (
              <div>
                <span className="text-muted-foreground">Tone:</span>{' '}
                <Badge variant="outline" className="text-[10px] h-5">
                  {designSuggestion.toneDescriptor}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
