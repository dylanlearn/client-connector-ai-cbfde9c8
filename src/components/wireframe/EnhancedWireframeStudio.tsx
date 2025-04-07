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
import { WireframeVisualizer, WireframeDataVisualizer } from '@/components/wireframe';
import DesignMemoryPanel from './DesignMemoryPanel';
import { DesignReference } from '@/services/ai/design/design-memory-reference-service';
import { WireframeGenerationParams, WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';
import { WireframeProps } from './types';

interface AIWireframe {
  id: string;
  title?: string;
  description: string;
  wireframe_data?: WireframeData;
  image_url?: string;
  sections?: any[];
  created_at?: string;
}

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
  const [previewData, setPreviewData] = useState<WireframeData | null>(null);
  const [previewingWireframe, setPreviewingWireframe] = useState<WireframeData | null>(null);
  
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
    
    const result = await generateCreativeVariation(currentWireframe);
    
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
  
  const handleShowMemoryPanel = () => {
    setShowMemoryPanel(!showMemoryPanel);
  };
  
  const handlePreviewWireframe = () => {
    if (!previewData) return;
    
    const previewWireframe = {
      id: `preview-${Date.now()}`,
      title: previewData.title || "Wireframe Preview",
      description: previewData.description || "",
      sections: previewData.sections || [],
      imageUrl: previewData.imageUrl || "",
    };
    
    setPreviewingWireframe(previewWireframe);
  };
  
  const styleOptions = [
    { value: 'modern', label: 'Modern & Clean' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'creative', label: 'Creative' },
    { value: 'tech', label: 'Tech-focused' },
    { value: 'bold', label: 'Bold & Vibrant' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'playful', label: 'Playful' }
  ];
  
  const adaptSectionsForVisualizer = (sections: WireframeSection[] = []): any[] => {
    return sections.map((section, index) => ({
      id: section.id || `section-${index}`,
      name: section.name,
      sectionType: section.sectionType,
      description: section.description || '',
    }));
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="prompt">
            <ScrollText className="mr-2 h-4 w-4" />
            Prompt
          </TabsTrigger>
          
          <TabsTrigger value="preview" disabled={!currentWireframe}>
            <LayoutPanelTop className="mr-2 h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompt" className="space-y-4 mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Generate AI Wireframe</CardTitle>
              <CardDescription>
                Describe the page or layout you want to create
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Describe the wireframe you want to generate. Be specific about layout, purpose, and the type of content you want to include..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="min-h-[120px]"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Design Style</Label>
                  <Select value={styleToken} onValueChange={setStyleToken}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Creativity Level: {creativityLevel}</Label>
                  <Slider
                    value={[creativityLevel]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(vals) => setCreativityLevel(vals[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Conservative</span>
                    <span>Creative</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-memory"
                  checked={useDesignMemory}
                  onCheckedChange={setUseDesignMemory}
                />
                <Label htmlFor="use-memory" className="cursor-pointer">Use Design Memory</Label>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShowMemoryPanel}
                  className="ml-auto"
                >
                  {showMemoryPanel ? 'Hide Memory' : 'Show Memory'}
                </Button>
              </div>
              
              {showMemoryPanel && (
                <DesignMemoryPanel 
                  onSelectReference={handleReferenceSelect}
                  selectedReferenceId={selectedReference?.id}
                  filterType="wireframe"
                  darkMode={darkMode}
                />
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !userInput.trim()}
                className="w-full"
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
          </Card>
          
          {wireframes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Wireframes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto">
                  {wireframes.map((wireframe) => (
                    <div
                      key={wireframe.id}
                      className="flex items-center p-4 border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        // TODO: Add logic to view this wireframe
                      }}
                    >
                      <div>
                        <h4 className="font-medium">
                          {wireframe.title || 'Untitled Wireframe'}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {wireframe.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4 mt-2">
          {currentWireframe && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentWireframe.wireframe?.title || 'Generated Wireframe'}</CardTitle>
                    <CardDescription>
                      {currentWireframe.wireframe?.description || 'AI generated wireframe based on your requirements'}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{styleToken}</Badge>
                    <Badge variant="secondary">Creativity: {creativityLevel}</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {currentWireframe.wireframe ? (
                  <div className="border rounded-md p-1 bg-background">
                    <WireframeVisualizer 
                      wireframe={{
                        id: 'temp-id',
                        title: currentWireframe.wireframe.title || 'Generated Wireframe',
                        description: currentWireframe.wireframe.description || '',
                        imageUrl: currentWireframe.wireframe.imageUrl,
                        sections: adaptSectionsForVisualizer(currentWireframe.wireframe.sections),
                        version: '1.0',
                        lastUpdated: new Date().toISOString()
                      }}
                      darkMode={darkMode}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] bg-muted rounded-md">
                    <p className="text-muted-foreground">No preview available</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleGenerateVariation}
                  disabled={isGenerating}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Variation
                </Button>
                
                <Button onClick={handleSaveToMemory}>
                  <Save className="mr-2 h-4 w-4" />
                  Save to Design Memory
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedWireframeStudio;
