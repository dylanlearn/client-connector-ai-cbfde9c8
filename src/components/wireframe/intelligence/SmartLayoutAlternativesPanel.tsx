import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { CreativityGauge } from '@/components/ui/creativity-gauge';
import { useSmartLayoutAlternatives } from '@/hooks/ai/use-smart-layout-alternatives';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Wand2, Sparkles } from 'lucide-react';

interface SmartLayoutAlternativesPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const SmartLayoutAlternativesPanel: React.FC<SmartLayoutAlternativesPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const [creativity, setCreativity] = useState(5);
  const [count, setCount] = useState(3);
  
  const {
    isGenerating,
    alternatives,
    generationResult,
    selectedAlternative,
    error,
    generateAlternatives,
    applyAlternative,
    setSelectedAlternative
  } = useSmartLayoutAlternatives({ showToasts: true });

  const handleGenerateAlternatives = async () => {
    await generateAlternatives(wireframe, count, creativity);
  };

  const handleApplyAlternative = () => {
    if (selectedAlternative) {
      const updated = applyAlternative(selectedAlternative);
      onUpdateWireframe(updated);
    }
  };

  if (isGenerating) {
    return (
      <div className="space-y-4 p-4">
        <p className="text-center text-muted-foreground">Generating layout alternatives...</p>
        <Progress value={45} className="w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Error generating alternatives: {error.message}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={handleGenerateAlternatives}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!generationResult || alternatives.length === 0 ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium block">Creativity Level</label>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Slider
                  value={[creativity]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={([value]) => setCreativity(value)}
                />
              </div>
              <CreativityGauge value={creativity} max={10} size={60} />
            </div>
            <p className="text-sm text-muted-foreground">
              {creativity < 4 ? 'Conservative redesigns with minimal changes' : 
               creativity < 8 ? 'Balanced creative exploration' : 
               'Highly creative alternatives'}
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium block">Number of Alternatives</label>
            <Slider
              value={[count]}
              min={1}
              max={5}
              step={1}
              onValueChange={([value]) => setCount(value)}
            />
            <p className="text-right text-sm">{count}</p>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleGenerateAlternatives}
            disabled={isGenerating}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Layout Alternatives
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Generated Alternatives</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => generateAlternatives(wireframe, count, creativity)}
              disabled={isGenerating}
            >
              <Sparkles className="mr-2 h-3 w-3" />
              Regenerate
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mt-2">
            {alternatives.map((alt, index) => (
              <Card 
                key={alt.id} 
                className={`cursor-pointer ${selectedAlternative?.id === alt.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedAlternative(alt)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{alt.title}</h4>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Alternative {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alt.description}</p>
                  
                  <div className="mt-6 bg-muted/50 p-4 rounded-md text-center">
                    [Layout Preview Placeholder]
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleApplyAlternative} 
              disabled={!selectedAlternative}
            >
              Apply Selected Alternative
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SmartLayoutAlternativesPanel;
