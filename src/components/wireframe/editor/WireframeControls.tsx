
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  WireframeData, 
  WireframeGenerationParams
} from '@/services/ai/wireframe/wireframe-types';

interface WireframeControlsProps {
  projectId?: string;
  onWireframeCreated?: (wireframe: WireframeData) => void;
  generateWireframe: (params: WireframeGenerationParams) => Promise<any>;
}

const WireframeControls: React.FC<WireframeControlsProps> = ({
  projectId,
  onWireframeCreated,
  generateWireframe
}) => {
  // State
  const [prompt, setPrompt] = useState('');
  const [creativityLevel, setCreativityLevel] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await generateWireframe({
        description: prompt,
        projectId,
        creativityLevel
      });
      
      if (result.wireframe && onWireframeCreated) {
        onWireframeCreated(result.wireframe);
      }
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="prompt">Describe your wireframe</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to create, e.g. 'A landing page for a fitness app with hero section, features, and testimonials'"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="creativity">Creativity</Label>
          <span className="text-sm text-muted-foreground">{creativityLevel}/10</span>
        </div>
        <Slider
          id="creativity"
          min={1}
          max={10}
          step={1}
          value={[creativityLevel]}
          onValueChange={(values) => setCreativityLevel(values[0])}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Conservative</span>
          <span>Creative</span>
        </div>
      </div>
      
      <Button 
        type="submit"
        className="w-full"
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? 'Generating...' : 'Generate Wireframe'}
      </Button>
    </form>
  );
};

export default WireframeControls;
