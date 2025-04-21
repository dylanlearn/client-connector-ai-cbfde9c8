
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WireframeControlsProps {
  projectId?: string;
  onWireframeCreated?: (wireframe: any) => void;
  generateWireframe: (params: any) => Promise<any>;
  isGenerating?: boolean;
}

const WireframeControls: React.FC<WireframeControlsProps> = ({
  projectId,
  onWireframeCreated,
  generateWireframe,
  isGenerating = false
}) => {
  const [prompt, setPrompt] = useState('');
  const [creativityLevel, setCreativityLevel] = useState(8);
  const [style, setStyle] = useState('modern');
  const [colorScheme, setColorScheme] = useState('auto');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      return;
    }
    
    try {
      const result = await generateWireframe({
        description: prompt,
        projectId,
        creativityLevel,
        style,
        colorScheme
      });
      
      if (result.wireframe && onWireframeCreated) {
        onWireframeCreated(result.wireframe);
      }
    } catch (error) {
      console.error("Generation error:", error);
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
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="style">Style</Label>
          <Select
            value={style}
            onValueChange={setStyle}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="colorScheme">Color Scheme</Label>
          <Select
            value={colorScheme}
            onValueChange={setColorScheme}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select color scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto Generate</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="brand">Brand Colors</SelectItem>
              <SelectItem value="monochrome">Monochrome</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="creativity">Creativity Level</Label>
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
