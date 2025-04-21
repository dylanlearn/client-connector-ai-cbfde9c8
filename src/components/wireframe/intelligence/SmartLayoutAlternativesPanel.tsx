
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layout, 
  LayoutGrid, 
  Wand2, 
  ThumbsUp, 
  ThumbsDown,
  CheckCircle, 
  Sparkles,
  MoveHorizontal
} from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  SmartLayoutGeneratorService, 
  LayoutAlternative,
  LayoutGenerationOptions,
  LayoutGenerationResult
} from '@/services/ai/design/layout/smart-layout-generator-service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SmartLayoutAlternativesPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
  onClose?: () => void;
}

const SmartLayoutAlternativesPanel: React.FC<SmartLayoutAlternativesPanelProps> = ({
  wireframe,
  onUpdateWireframe,
  onClose
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<LayoutGenerationResult | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [options, setOptions] = useState<LayoutGenerationOptions>({
    count: 3,
    focusArea: 'engagement'
  });
  
  const handleGenerateAlternatives = async () => {
    setIsGenerating(true);
    try {
      const result = await SmartLayoutGeneratorService.generateAlternatives(wireframe, options);
      setResult(result);
      if (result.alternatives.length > 0) {
        setSelectedAlternative(result.alternatives[0].id);
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleApplyAlternative = () => {
    if (!result || !selectedAlternative) return;
    
    const updatedWireframe = SmartLayoutGeneratorService.applyLayoutAlternative(
      wireframe,
      selectedAlternative,
      result.alternatives
    );
    
    if (onUpdateWireframe) {
      onUpdateWireframe(updatedWireframe);
    }
  };
  
  const handleOptionChange = (key: keyof LayoutGenerationOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const getSelectedAlternative = () => {
    if (!result || !selectedAlternative) return null;
    return result.alternatives.find(alt => alt.id === selectedAlternative);
  };
  
  return (
    <Card className="overflow-hidden border-t-4 border-t-primary">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <LayoutGrid className="mr-2 h-5 w-5" />
            Smart Layout Alternatives
          </h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
        
        {!result ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Optimization Focus</Label>
                <Select 
                  value={options.focusArea} 
                  onValueChange={(value: any) => handleOptionChange('focusArea', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select focus area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="readability">Readability</SelectItem>
                    <SelectItem value="accessibility">Accessibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Number of Alternatives</Label>
                <Select 
                  value={options.count?.toString()} 
                  onValueChange={(value) => handleOptionChange('count', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Number of alternatives" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Industry Context (Optional)</Label>
                <Select 
                  value={options.industryContext} 
                  onValueChange={(value) => handleOptionChange('industryContext', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={handleGenerateAlternatives} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Layout Alternatives
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">{result.summary}</p>
            
            <div className="border rounded-lg overflow-hidden">
              <RadioGroup 
                value={selectedAlternative || ''}
                onValueChange={setSelectedAlternative}
                className="grid grid-cols-1 divide-y"
              >
                {result.alternatives.map((alt) => (
                  <div key={alt.id} className="p-3 hover:bg-muted/50">
                    <div className="flex items-start">
                      <RadioGroupItem value={alt.id} id={alt.id} className="mt-1 mr-2" />
                      <div className="flex-1">
                        <label htmlFor={alt.id} className="flex items-center text-sm font-medium cursor-pointer">
                          <Layout className="mr-2 h-4 w-4" />
                          {alt.name}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">{alt.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {alt.benefits?.map((benefit, i) => (
                            <div key={i} className="text-xs bg-muted px-2 py-1 rounded-full flex items-center">
                              <Sparkles className="mr-1 h-3 w-3" />
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Selected Alternative Preview</h4>
              {getSelectedAlternative() ? (
                <div>
                  <p className="text-sm mb-4">
                    <strong>{getSelectedAlternative()?.name}</strong> - 
                    {getSelectedAlternative()?.description}
                  </p>
                  <div className="border-2 border-dashed border-gray-300 h-[200px] rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Preview would appear here</p>
                    {/* In a real implementation, this would show a simplified preview of the selected layout */}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select an alternative to see a preview</p>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setResult(null)}
              >
                Back
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={handleGenerateAlternatives}
                  disabled={isGenerating}
                >
                  Regenerate
                </Button>
                <Button
                  onClick={handleApplyAlternative}
                  disabled={!selectedAlternative}
                >
                  Apply Selected Layout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SmartLayoutAlternativesPanel;
