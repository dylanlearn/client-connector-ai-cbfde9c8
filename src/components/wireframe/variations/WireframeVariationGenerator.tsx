
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, RefreshCcw, Shuffle } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';

interface WireframeVariationGeneratorProps {
  wireframe: WireframeData | null;
  onGenerateVariation: (creativityLevel: number, enhancementFocus: string[]) => Promise<void>;
  isGenerating: boolean;
  className?: string;
}

const WireframeVariationGenerator: React.FC<WireframeVariationGeneratorProps> = ({
  wireframe,
  onGenerateVariation,
  isGenerating,
  className
}) => {
  const [creativityLevel, setCreativityLevel] = useState<number>(5);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  
  const focusOptions = [
    { id: 'layout', label: 'Layout' },
    { id: 'content', label: 'Content' },
    { id: 'style', label: 'Style' },
    { id: 'components', label: 'Components' }
  ];
  
  const handleToggleFocus = (focusId: string) => {
    setSelectedFocus(prev => 
      prev.includes(focusId)
        ? prev.filter(id => id !== focusId)
        : [...prev, focusId]
    );
  };
  
  const handleGenerateClick = async () => {
    await onGenerateVariation(creativityLevel, selectedFocus);
  };
  
  const getCreativityLabel = () => {
    if (creativityLevel <= 3) return "Conservative";
    if (creativityLevel <= 6) return "Balanced";
    if (creativityLevel <= 8) return "Creative";
    return "Experimental";
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Generate Variations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="creativity">Creativity Level</Label>
            <Badge variant="outline">{getCreativityLabel()}</Badge>
          </div>
          <Slider
            id="creativity"
            min={1}
            max={10}
            step={1}
            value={[creativityLevel]}
            onValueChange={(value) => setCreativityLevel(value[0])}
            disabled={isGenerating}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtle</span>
            <span>Balanced</span>
            <span>Radical</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Variation Focus</Label>
          <div className="flex flex-wrap gap-2">
            {focusOptions.map((option) => (
              <Badge
                key={option.id}
                variant={selectedFocus.includes(option.id) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer hover:bg-primary/10",
                  selectedFocus.includes(option.id) && "hover:bg-primary/90"
                )}
                onClick={() => handleToggleFocus(option.id)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateClick} 
          disabled={isGenerating || !wireframe}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Variation...
            </>
          ) : (
            <>
              <Shuffle className="mr-2 h-4 w-4" />
              Generate Variation
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WireframeVariationGenerator;
