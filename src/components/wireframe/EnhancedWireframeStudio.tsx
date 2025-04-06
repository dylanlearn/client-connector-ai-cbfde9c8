import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { useDesignReferences } from '@/hooks/use-design-references';
import { Loader2, Wand2, ScrollText, LayoutPanelTop, Save, Sparkles } from 'lucide-react';
import WireframeVisualizer from './WireframeVisualizer';
import DesignMemoryPanel from './DesignMemoryPanel';
import { DesignReference } from '@/services/ai/design/design-memory-reference-service';
import { WireframeGenerationParams, WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';

interface EnhancedWireframeStudioProps {
  projectId: string;
  onWireframeGenerated?: () => void;
  onWireframeSaved?: () => void;
  darkMode?: boolean;
}

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({ 
  projectId, 
  onWireframeGenerated,
  onWireframeSaved,
  darkMode = false
}) => {
  const [activeTab, setActiveTab] = useState('prompt');
  const [userInput, setUserInput] = useState('');
  const [styleToken, setStyleToken] = useState('modern');
  const [useDesignMemory, setUseDesignMemory] = useState(false);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const [creativityLevel, setCreativityLevel] = useState(7);
  const [selectedReference, setSelectedReference] = useState<DesignReference | null>(null);
  
  const {
    isGenerating,
    currentWireframe,
    wireframes,
    generateWireframe,
    generateCreativeVariation,
    provideFeedback,
    loadProjectWireframes,
    deleteWireframe,
    setCreativityLevel: setCreativityLevelInHook
  } = useWireframeGeneration();
  
  const { references, storeReference } = useDesignReferences();
  
  useEffect(() => {
    if (projectId) {
      loadProjectWireframes(projectId);
    }
  }, [projectId, loadProjectWireframes]);
  
  useEffect(() => {
    setCreativityLevelInHook(creativityLevel);
  }, [creativityLevel, setCreativityLevelInHook]);
  
  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    
    const params: WireframeGenerationParams = {
      description: userInput,
      projectId: projectId,
      style: styleToken,
      enhancedCreativity: true, 
      creativityLevel: creativityLevel,
      darkMode: darkMode
    };
    
    if (useDesignMemory && selectedReference) {
      params.baseWireframe = selectedReference.metadata;
    }
    
    const result = await generateWireframe(params);
    
    if (result && onWireframeGenerated) {
      onWireframeGenerated();
    }
    
    if (result) {
      setActiveTab('preview');
    }
  };
  
  const handleGenerateVariation = async () => {
    if (!currentWireframe?.wireframe) return;
    
    const result = await generateCreativeVariation(currentWireframe.wireframe, projectId);
    
    if (result && onWireframeGenerated) {
      onWireframeGenerated();
    }
  };
  
  const handleSaveToMemory = async () => {
    if (!currentWireframe?.wireframe) return null;
    
    const extractTags = (text: string) => {
      const words = text.toLowerCase().split(/\s+/);
      const commonTags = ['modern', 'minimal', 'dashboard', 'ecommerce', 'landing', 'dark', 'light', 
                          'corporate', 'creative', 'portfolio', 'mobile', 'responsive', 'clean'];
      
      return commonTags.filter(tag => words.includes(tag));
    };
    
    const wireframeTitle = currentWireframe.wireframe.title || 'Untitled Wireframe';
    const wireframeDescription = currentWireframe.wireframe.description || userInput;
    
    const titleTags = extractTags(wireframeTitle);
    const descriptionTags = extractTags(wireframeDescription);
    const tags = Array.from(new Set([...titleTags, ...descriptionTags]));
    
    if (styleToken) {
      tags.push(styleToken.toLowerCase());
    }
    
    const reference = await storeReference(
      wireframeTitle,
      'wireframe',
      currentWireframe.wireframe,
      tags,
      wireframeDescription
    );
    
    return reference;
  };
  
  const handleReferenceSelect = (reference: DesignReference) => {
    setSelectedReference(reference);
    setUseDesignMemory(true);
  };
  
  const styleOptions = [
    { value: 'modern', label: 'Modern & Clean' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'brutalist', label: 'Brutalist' },
    { value: 'glassy', label: 'Glassmorphic' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'playful', label: 'Playful' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'tech-forward', label: 'Tech-Forward' }
  ];
  
  return (
    <div className={cn(
      "enhanced-wireframe-studio grid",
      showMemoryPanel ? "grid-cols-[1fr_350px]" : "grid-cols-1",
      darkMode ? "text-gray-200" : ""
    )}>
      <Card className={cn(
        "w-full", 
        darkMode ? "bg-gray-800 border-gray-700" : "",
        showMemoryPanel ? "rounded-r-none border-r-0" : ""
      )}>
        <CardHeader className={darkMode ? "border-gray-700" : ""}>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className={`h-5 w-5 ${darkMode ? "text-blue-400" : "text-primary"}`} />
              Enhanced Wireframe Studio
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowMemoryPanel(!showMemoryPanel)}
              className={darkMode ? "bg-gray-700 border-gray-600" : ""}
            >
              {showMemoryPanel ? "Hide" : "Show"} Memory
            </Button>
          </CardTitle>
          <CardDescription className={darkMode ? "text-gray-400" : ""}>
            Create detailed wireframes with AI and design memory
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="prompt">
                <ScrollText className="h-4 w-4 mr-2" />
                Prompt
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!currentWireframe}>
                <LayoutPanelTop className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="variations" disabled={!currentWireframe}>
                <Sparkles className="h-4 w-4 mr-2" />
                Variations
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="prompt">
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="user-input" className={darkMode ? "text-gray-200" : ""}>Design Description</Label>
                <Textarea
                  id="user-input"
                  placeholder="Describe the website design you want to create..."
                  rows={5}
                  className={cn(
                    "resize-none mt-1",
                    darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : ""
                  )}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="style-select" className={darkMode ? "text-gray-200" : ""}>Visual Style</Label>
                  <Select value={styleToken} onValueChange={setStyleToken}>
                    <SelectTrigger 
                      id="style-select" 
                      className={cn(
                        "mt-1",
                        darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : ""
                      )}
                    >
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : ""}>
                      {styleOptions.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="creativity-level" className={darkMode ? "text-gray-200" : ""}>
                    Creativity Level: {creativityLevel}/10
                  </Label>
                  <Slider
                    id="creativity-level"
                    min={1}
                    max={10}
                    step={1}
                    value={[creativityLevel]}
                    onValueChange={(value) => setCreativityLevel(value[0])}
                    className="mt-3"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-memory"
                  checked={useDesignMemory}
                  onCheckedChange={setUseDesignMemory}
                  disabled={!selectedReference}
                />
                <Label 
                  htmlFor="use-memory" 
                  className={selectedReference 
                    ? darkMode ? "text-gray-200" : "" 
                    : "text-gray-400"}
                >
                  Use selected design reference
                  {!selectedReference && " (No reference selected)"}
                </Label>
              </div>
              
              {selectedReference && (
                <div className={cn(
                  "p-3 border rounded",
                  darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">
                      {selectedReference.title}
                    </h4>
                    <Badge variant="outline">{selectedReference.type}</Badge>
                  </div>
                  {selectedReference.description && (
                    <p className="text-xs mb-2 text-gray-500">
                      {selectedReference.description.length > 120 
                        ? selectedReference.description.slice(0, 120) + '...' 
                        : selectedReference.description}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between pt-2">
              <div className="text-sm text-muted-foreground">
                {references.length > 0 && (
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    darkMode ? "border-gray-600 text-gray-300" : ""
                  )}>
                    {references.length} References Available
                  </Badge>
                )}
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !userInput.trim()}
                className={darkMode ? "hover:bg-blue-600" : ""}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Wireframe
                  </>
                )}
              </Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="preview">
            {currentWireframe && (
              <div>
                <div className={cn(
                  "p-4 border-b",
                  darkMode ? "border-gray-700" : "border-gray-200"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-lg">
                      {currentWireframe.wireframe.title || 'Untitled Wireframe'}
                    </h3>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveToMemory}>
                        <Save className="h-4 w-4 mr-1" />
                        Save to Memory
                      </Button>
                    </div>
                  </div>
                  {currentWireframe.wireframe.description && (
                    <p className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {currentWireframe.wireframe.description}
                    </p>
                  )}
                </div>
                
                <div className="p-4">
                  <WireframeVisualizer
                    wireframe={{
                      id: currentWireframe.id || "current-wireframe", 
                      title: currentWireframe.wireframe.title || "Untitled Wireframe",
                      description: currentWireframe.wireframe.description || "",
                      imageUrl: currentWireframe.wireframe.imageUrl || "",
                      sections: currentWireframe.wireframe.sections?.map((section: any, index: number) => ({
                        id: section.id || `section-${index}`,
                        name: section.name || section.type || `Section ${index + 1}`,
                        description: section.description || section.content || "",
                        imageUrl: section.imageUrl || ""
                      })) || [],
                      version: "1.0",
                      lastUpdated: new Date().toLocaleDateString()
                    }}
                    viewMode="preview"
                    deviceType="desktop"
                    darkMode={darkMode}
                    interactive={true}
                    highlightSections={true}
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="variations">
            {currentWireframe && (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Generate Creative Variations</h3>
                  <Button 
                    size="sm"
                    onClick={handleGenerateVariation}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Create Variation
                  </Button>
                </div>
                
                {wireframes.length > 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wireframes.slice(0, 4).map((wireframe, index) => (
                      <Card key={wireframe.id || index} className={cn(
                        "overflow-hidden",
                        darkMode ? "bg-gray-800 border-gray-700" : ""
                      )}>
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">{wireframe.title || `Variation ${index + 1}`}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="h-[300px] overflow-hidden">
                            <WireframeVisualizer
                              wireframe={{
                                id: wireframe.id || `variation-${index}`,
                                title: wireframe.title || `Variation ${index + 1}`,
                                description: wireframe.description || "",
                                imageUrl: wireframe.imageUrl || "",
                                sections: wireframe.data?.sections || wireframe.sections || [],
                                version: "1.0",
                                lastUpdated: new Date().toLocaleDateString()
                              }}
                              viewMode="preview"
                              deviceType="desktop"
                              darkMode={darkMode}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <p className="mb-2">No variations generated yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click "Create Variation" to generate design alternatives based on your current wireframe
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
      
      {showMemoryPanel && (
        <DesignMemoryPanel
          darkMode={darkMode}
          onSelectReference={handleReferenceSelect}
          onSaveCurrentDesign={handleSaveToMemory}
          className={cn(
            "border rounded-r-lg", 
            darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200"
          )}
        />
      )}
    </div>
  );
};

export default EnhancedWireframeStudio;
