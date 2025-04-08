
import React, { useEffect, useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, PlusCircle, Save, Sparkles } from "lucide-react";
import { useAdvancedWireframe } from "@/hooks/use-advanced-wireframe";
import DesignMemoryPanel from './DesignMemoryPanel';
import { CreativityGauge } from '@/components/ui/creativity-gauge';
import { debounce } from 'lodash';

interface AdvancedWireframeGeneratorProps {
  projectId: string;
  darkMode?: boolean;
  onWireframeGenerated?: (wireframe: any) => void;
  onWireframeSaved?: (result: any) => void;
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId,
  darkMode = false,
  onWireframeGenerated,
  onWireframeSaved
}) => {
  const [userInput, setUserInput] = useState<string>("");
  const [styleToken, setStyleToken] = useState<string>("modern");
  const [includeDesignMemory, setIncludeDesignMemory] = useState<boolean>(true);
  const [creativityLevel, setCreativityLevel] = useState<number>(7); // Default creativity level
  const { toast } = useToast();
  
  const {
    isGenerating,
    currentWireframe,
    intentData,
    blueprint,
    designMemory,
    generateWireframe,
    saveWireframe,
    loadDesignMemory
  } = useAdvancedWireframe();

  // Prevent excessive re-renders with debounced input
  const debouncedSetUserInput = useCallback(
    debounce((value: string) => {
      setUserInput(value);
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the input field immediately for UI responsiveness
    e.persist();
    debouncedSetUserInput(e.target.value);
  };

  useEffect(() => {
    if (projectId && includeDesignMemory) {
      loadDesignMemory(projectId);
    }
  }, [projectId, includeDesignMemory, loadDesignMemory]);

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Input required",
        description: "Please describe what you want to generate",
        variant: "destructive"
      });
      return;
    }

    const result = await generateWireframe({
      userInput,
      projectId,
      styleToken,
      includeDesignMemory,
      customParams: {
        darkMode,
        creativityLevel
      }
    });

    if (result && onWireframeGenerated) {
      onWireframeGenerated(result);
    }
  };

  const handleSave = async () => {
    if (!currentWireframe) {
      toast({
        title: "No wireframe to save",
        description: "Please generate a wireframe first",
        variant: "destructive"
      });
      return;
    }

    const result = await saveWireframe(projectId, userInput);
    
    if (result && onWireframeSaved) {
      onWireframeSaved(result);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="w-full md:w-2/3 space-y-4">
        <Card className={darkMode ? "bg-gray-800 text-gray-100 border-gray-700" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              Advanced Wireframe Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="wireframe-prompt">Describe the wireframe you want to create</Label>
                <Textarea
                  id="wireframe-prompt"
                  placeholder="Enter a detailed description of the website wireframe you want to generate..."
                  defaultValue={userInput}
                  onChange={handleInputChange}
                  rows={5}
                  className={darkMode ? "bg-gray-700 border-gray-600" : ""}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="style-select">Style</Label>
                    <Select 
                      value={styleToken} 
                      onValueChange={setStyleToken}
                    >
                      <SelectTrigger id="style-select" className={darkMode ? "bg-gray-700 border-gray-600" : ""}>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="brutalist">Brutalist</SelectItem>
                        <SelectItem value="glassy">Glassy</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="design-memory" 
                      checked={includeDesignMemory} 
                      onCheckedChange={setIncludeDesignMemory} 
                    />
                    <Label htmlFor="design-memory">Use design memory</Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>Creativity Level</Label>
                  <CreativityGauge
                    value={creativityLevel}
                    onChange={setCreativityLevel}
                    showValue={true}
                    size={120}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="default" 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !userInput.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Generate Wireframe
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSave} 
                  disabled={!currentWireframe || isGenerating}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Wireframe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentWireframe && (
          <Card className={darkMode ? "bg-gray-800 text-gray-100 border-gray-700" : ""}>
            <CardHeader>
              <CardTitle>Generated Wireframe: {currentWireframe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview">
                <TabsList className="mb-4">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h2 className="text-xl font-bold mb-4">{currentWireframe.title}</h2>
                    <p className="mb-6">{currentWireframe.description}</p>
                    
                    {currentWireframe.sections?.map((section, i) => (
                      <div key={section.id || i} className="mb-8 p-4 border rounded-md">
                        <h3 className="font-semibold text-lg">{section.name}</h3>
                        <p>{section.description}</p>
                        
                        {section.components && (
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {section.components.map((component, j) => (
                              <div key={component.id || j} className="p-2 border rounded">
                                {component.content}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="data">
                  <pre className="text-xs p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto max-h-96">
                    {JSON.stringify(currentWireframe, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="w-full md:w-1/3">
        <DesignMemoryPanel 
          darkMode={darkMode}
          filterType="wireframe"
        />
      </div>
    </div>
  );
};

export default AdvancedWireframeGenerator;
