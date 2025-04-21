
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { DesignSuggestion } from '@/hooks/wireframe/use-wireframe-variations';
import { WireframeGenerationResult, WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useWireframeGenerator } from '@/hooks/wireframe/use-wireframe-generator';
import { toast } from '@/hooks/use-toast';

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
  const { generateWireframe, isGenerating } = useWireframeGenerator(
    creativityLevel,
    (result) => {
      if (result && result.wireframe) {
        onWireframeGenerated(result);
      }
    },
    toast
  );
  
  const handleGenerate = async () => {
    if (!designSuggestion) {
      toast({
        title: "Design selection required",
        description: "Please select design preferences before generating a wireframe",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await generateWireframe({
        description: description || "A modern website wireframe",
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
        // Success is handled by the callback in useWireframeGenerator
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate wireframe",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="design-wireframe-bridge space-y-6">
      {!designSuggestion ? (
        <div className="p-4 bg-amber-50 text-amber-800 rounded-md">
          Please select design preferences in the previous step before continuing.
        </div>
      ) : (
        <div className="p-4 bg-green-50 text-green-800 rounded-md">
          Design preferences selected and ready to be applied.
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Describe what you want to create</Label>
          <Textarea
            id="description"
            placeholder="E.g., A landing page for a software product with hero section, features, and testimonials"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="creativity">Creativity Level: {creativityLevel}/10</Label>
          <input
            id="creativity"
            type="range"
            min="1"
            max="10"
            value={creativityLevel}
            onChange={(e) => setCreativityLevel(Number(e.target.value))}
            className="w-full mt-1"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Conservative</span>
            <span>Balanced</span>
            <span>Creative</span>
          </div>
        </div>
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
        <div className="mt-4 p-4 bg-muted/50 rounded-md text-sm">
          <h4 className="font-medium mb-2">Design Parameters</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">Primary Color:</span>{' '}
              <div className="inline-flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: designSuggestion.colorScheme?.primary }}
                />
                {designSuggestion.colorScheme?.primary}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Typography:</span>{' '}
              {designSuggestion.typography?.headings}
            </div>
            <div>
              <span className="text-muted-foreground">Layout:</span>{' '}
              {designSuggestion.layoutStyle}
            </div>
            <div>
              <span className="text-muted-foreground">Tone:</span>{' '}
              {designSuggestion.toneDescriptor}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
