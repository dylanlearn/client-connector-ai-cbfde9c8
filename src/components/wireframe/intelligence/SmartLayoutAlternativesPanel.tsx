
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, LayoutGrid, Check, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useSmartLayoutAlternatives } from '@/hooks/ai/use-smart-layout-alternatives';
import { LayoutAlternative } from '@/services/ai/design/layout/smart-layout-generator-service';

export interface SmartLayoutAlternativesPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const SmartLayoutAlternativesPanel: React.FC<SmartLayoutAlternativesPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const [creativeLevel, setCreativeLevel] = useState<string>('5');
  const [preserveContent, setPreserveContent] = useState<boolean>(true);
  
  const { 
    isGenerating,
    generationResult,
    selectedAlternative,
    error,
    generateAlternatives,
    applyAlternative,
    setSelectedAlternative,
    reset
  } = useSmartLayoutAlternatives();
  
  // Generate layout alternatives
  const handleGenerateAlternatives = useCallback(async () => {
    await generateAlternatives(wireframe, {
      creativeLevel: parseInt(creativeLevel),
      preserveContent
    });
  }, [wireframe, creativeLevel, preserveContent, generateAlternatives]);
  
  // Apply selected layout alternative
  const handleApplyAlternative = useCallback(() => {
    if (!selectedAlternative || !generationResult) return;
    
    const updatedWireframe = applyAlternative(wireframe, selectedAlternative, generationResult.alternatives);
    if (updatedWireframe) {
      onUpdateWireframe(updatedWireframe);
    }
  }, [wireframe, selectedAlternative, generationResult, applyAlternative, onUpdateWireframe]);
  
  // Find the currently selected alternative
  const currentAlternative = generationResult?.alternatives.find(
    alt => alt.id === selectedAlternative
  );
  
  return (
    <div className="smart-layout-alternatives-panel">
      {!generationResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Smart Layout Alternatives</CardTitle>
            <CardDescription>
              Generate AI-powered layout variations based on your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Creativity Level</label>
                <Select value={creativeLevel} onValueChange={setCreativeLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select creativity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Conservative</SelectItem>
                    <SelectItem value="3">Balanced</SelectItem>
                    <SelectItem value="5">Standard</SelectItem>
                    <SelectItem value="7">Creative</SelectItem>
                    <SelectItem value="10">Experimental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="preserveContent"
                  checked={preserveContent}
                  onChange={(e) => setPreserveContent(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="preserveContent" className="text-sm">
                  Preserve existing content
                </label>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerateAlternatives} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Generate Layout Alternatives
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">
              {generationResult.alternatives.length} Layout Alternatives
            </h3>
            <Button variant="outline" size="sm" onClick={reset}>
              Start Over
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {generationResult.alternatives.map((alternative) => (
              <Card
                key={alternative.id}
                className={`cursor-pointer transition-colors ${
                  alternative.id === selectedAlternative ? 'border-primary ring-1 ring-primary' : ''
                }`}
                onClick={() => setSelectedAlternative(alternative.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm">{alternative.name}</CardTitle>
                    <Badge variant="outline">
                      {alternative.layoutType}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">
                    {alternative.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pb-2 pt-0">
                  <div className="bg-muted h-24 rounded-md flex items-center justify-center mb-2">
                    <div className="text-xs text-muted-foreground">Layout preview</div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  {alternative.id === selectedAlternative && (
                    <Badge className="bg-primary-50 text-primary border-primary">
                      <Check className="mr-1 h-3 w-3" />
                      Selected
                    </Badge>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {currentAlternative && (
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">{currentAlternative.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm mb-4">{currentAlternative.description}</p>
                
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Layout type: <strong>{currentAlternative.layoutType}</strong></p>
                  <p>Sections: <strong>{currentAlternative.sections.length}</strong></p>
                </div>
                
                <Button
                  onClick={handleApplyAlternative}
                  className="w-full"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Apply This Layout
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
      
      {error && (
        <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md flex items-center text-sm text-red-800">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Error: {error.message}</span>
        </div>
      )}
    </div>
  );
};

export default SmartLayoutAlternativesPanel;
