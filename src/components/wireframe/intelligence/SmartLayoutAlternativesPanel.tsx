
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CreativityGauge } from '@/components/ui/creativity-gauge';
import {
  Layout,
  LayoutGrid,
  Shuffle,
  Check,
  LayoutDashboard,
  ArrowRightCircle,
  Sparkles
} from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useSmartLayoutAlternatives } from '@/hooks/ai/use-smart-layout-alternatives';
import { cn } from '@/lib/utils';

interface SmartLayoutAlternativesPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const SmartLayoutAlternativesPanel: React.FC<SmartLayoutAlternativesPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const { 
    isGenerating, 
    generationResult, 
    selectedAlternative,
    generateAlternatives,
    applyAlternative,
    setSelectedAlternative
  } = useSmartLayoutAlternatives();
  
  const [activeTab, setActiveTab] = useState('variations');
  const [creativityLevel, setCreativityLevel] = useState<number>(5);
  
  useEffect(() => {
    if (!generationResult && !isGenerating) {
      generateAlternatives(wireframe, { creativityLevel: 5 });
    }
  }, [generationResult, isGenerating, generateAlternatives, wireframe]);
  
  const handleGenerateAlternatives = () => {
    generateAlternatives(wireframe, { creativityLevel });
  };
  
  const handleSelectAlternative = (alternativeId: string) => {
    setSelectedAlternative(alternativeId);
  };
  
  const handleApplyAlternative = () => {
    if (!selectedAlternative || !generationResult?.alternatives) return;
    
    const updatedWireframe = applyAlternative(
      wireframe, 
      selectedAlternative,
      generationResult.alternatives
    );
    
    if (updatedWireframe) {
      onUpdateWireframe(updatedWireframe);
    }
  };
  
  const renderAlternativesList = () => {
    if (!generationResult?.alternatives || generationResult.alternatives.length === 0) return null;
    
    return (
      <div className="space-y-4">
        {generationResult.alternatives.map(alternative => (
          <Card 
            key={alternative.id}
            className={cn(
              "cursor-pointer hover:border-primary/50",
              selectedAlternative === alternative.id && "border-primary"
            )}
            onClick={() => handleSelectAlternative(alternative.id)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <LayoutGrid className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{alternative.name}</h4>
                  {selectedAlternative === alternative.id && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      Selected
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  {alternative.description.substring(0, 100)}...
                </p>
                <div className="flex text-xs text-muted-foreground mt-2">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">
                    {alternative.approach}
                  </span>
                  {alternative.emphasizes && (
                    <span className="bg-slate-100 px-2 py-0.5 rounded ml-2">
                      Emphasizes: {alternative.emphasizes}
                    </span>
                  )}
                </div>
              </div>
              <ArrowRightCircle className="h-4 w-4 text-muted-foreground self-center" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderPreviewTab = () => {
    if (!selectedAlternative || !generationResult?.alternatives) {
      return (
        <div className="text-center p-8">
          <Layout className="mx-auto h-12 w-12 text-slate-300 mb-2" />
          <p className="text-muted-foreground">Select a layout alternative to preview</p>
        </div>
      );
    }
    
    const alternative = generationResult.alternatives.find(alt => alt.id === selectedAlternative);
    if (!alternative) return null;
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-50 border rounded-lg p-4">
          <h3 className="font-medium text-lg">{alternative.name}</h3>
          <p className="text-muted-foreground mt-1">{alternative.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="bg-primary/5">
              {alternative.approach}
            </Badge>
            {alternative.emphasizes && (
              <Badge variant="outline" className="bg-primary/5">
                Emphasizes: {alternative.emphasizes}
              </Badge>
            )}
            {alternative.designPrinciple && (
              <Badge variant="outline" className="bg-primary/5">
                {alternative.designPrinciple}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="aspect-video bg-slate-100 rounded-lg border flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Layout preview visualization</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Current Layout</h4>
            <div className="aspect-video bg-slate-100 rounded-lg border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Current layout</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">{alternative.name}</h4>
            <div className="aspect-video bg-slate-100 rounded-lg border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">{alternative.name}</p>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleApplyAlternative}
          disabled={!selectedAlternative}
        >
          <Check className="h-4 w-4 mr-1" />
          Apply This Layout
        </Button>
      </div>
    );
  };
  
  const renderGeneratorTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Creativity Level</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adjust how creative the AI should be with layout alternatives. Higher values produce more innovative but potentially unconventional layouts.
            </p>
            
            <div className="flex items-center justify-center">
              <CreativityGauge
                value={creativityLevel}
                max={10}
                onChange={setCreativityLevel}
                size={120}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-slate-50 border rounded-lg p-4">
          <h4 className="font-medium mb-2 text-sm flex items-center">
            <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
            Smart Layout Generation
          </h4>
          <p className="text-sm text-muted-foreground">
            The AI will analyze your wireframe content and generate layout alternatives based on your content structure, hierarchy, and design goals.
          </p>
          
          <div className="mt-4 pt-4 border-t">
            <h5 className="text-sm font-medium mb-1">Layout Approaches</h5>
            <div className="flex flex-wrap gap-1 mb-4">
              <Badge variant="outline" className="bg-slate-50">
                <LayoutDashboard className="h-3 w-3 mr-1" />
                Grid-based
              </Badge>
              <Badge variant="outline" className="bg-slate-50">
                <LayoutGrid className="h-3 w-3 mr-1" />
                Asymmetric
              </Badge>
              <Badge variant="outline" className="bg-slate-50">
                <Layout className="h-3 w-3 mr-1" />
                Card-focused
              </Badge>
            </div>
            
            <Button 
              onClick={handleGenerateAlternatives} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <Shuffle className="mr-2 h-4 w-4" />
                  Generate Layout Alternatives
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  if (isGenerating && !generationResult) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Smart Layout Alternatives</h3>
          <Skeleton className="h-8 w-24" />
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Smart Layout Alternatives</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setActiveTab('generator')}
        >
          Generate New
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="variations" className="flex-1">Variations</TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
          <TabsTrigger value="generator" className="flex-1">Generator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="variations">
          {renderAlternativesList()}
        </TabsContent>
        
        <TabsContent value="preview">
          {renderPreviewTab()}
        </TabsContent>
        
        <TabsContent value="generator">
          {renderGeneratorTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartLayoutAlternativesPanel;
