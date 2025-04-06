
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useAdvancedWireframe } from '@/hooks/use-advanced-wireframe';
import { Loader2, Sparkles, ScrollText, LayoutPanelTop } from 'lucide-react';
import { FlowchartView } from './FlowchartView';
import WireframeVisualizer from './WireframeVisualizer';

interface AdvancedWireframeGeneratorProps {
  projectId: string;
  onWireframeGenerated?: () => void;
  onWireframeSaved?: () => void;
  darkMode?: boolean;
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({ 
  projectId, 
  onWireframeGenerated,
  onWireframeSaved,
  darkMode = false
}) => {
  const [activeTab, setActiveTab] = useState('prompt');
  const [userInput, setUserInput] = useState('');
  const [styleToken, setStyleToken] = useState('modern');
  const [useDesignMemory, setUseDesignMemory] = useState(false);
  const [viewMode, setViewMode] = useState<'flowchart' | 'preview'>('preview');
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile'>('desktop');
  
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

  React.useEffect(() => {
    if (projectId) {
      loadDesignMemory(projectId);
    }
  }, [projectId]);

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    
    const result = await generateWireframe({
      userInput: userInput,
      projectId,
      styleToken,
      includeDesignMemory: useDesignMemory,
      // We'll pass darkMode as a custom parameter
      customParams: {
        darkMode: darkMode
      }
    });
    
    if (result && onWireframeGenerated) {
      onWireframeGenerated();
    }
    
    // Switch to the preview tab after generation
    if (result) {
      setActiveTab('preview');
    }
  };
  
  const handleSave = async () => {
    if (!currentWireframe) return;
    
    const result = await saveWireframe(projectId, userInput);
    
    if (result && onWireframeSaved) {
      onWireframeSaved();
    }
  };
  
  // Example prompts to help users get started
  const examplePrompts = [
    "Create a modern SaaS homepage with hero, feature grid, pricing, and testimonials using a dark theme",
    "Design a minimalist portfolio for a photographer with fullscreen image galleries and a side navigation",
    "Build a tech dashboard with analytics charts, user stats, and a sidebar navigation in a corporate style",
    "Make an e-commerce product page with image carousel, product details, reviews, and related items"
  ];
  
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
  
  // Apply dark mode class if enabled
  const darkModeClass = darkMode ? 'bg-gray-900 text-gray-100' : '';
  
  return (
    <Card className={`w-full ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardHeader className={darkMode ? 'border-gray-700' : ''}>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-primary'}`} />
          Advanced Wireframe Generator
        </CardTitle>
        <CardDescription className={darkMode ? 'text-gray-400' : ''}>
          Create detailed wireframes using natural language descriptions
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
            <TabsTrigger value="code" disabled={!currentWireframe}>
              Code
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="prompt">
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="user-input" className={darkMode ? 'text-gray-200' : ''}>Design Description</Label>
              <Textarea
                id="user-input"
                placeholder="Describe the website design you want to create..."
                rows={5}
                className={`resize-none mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              
              {userInput.length === 0 && (
                <div className="mt-3">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'} mb-2`}>
                    Try one of these examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((prompt, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}`}
                        onClick={() => setUserInput(prompt)}
                      >
                        {prompt.length > 40 ? `${prompt.substring(0, 40)}...` : prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="style-select" className={darkMode ? 'text-gray-200' : ''}>Visual Style</Label>
                <Select value={styleToken} onValueChange={setStyleToken}>
                  <SelectTrigger id="style-select" className={`mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent className={darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}>
                    {styleOptions.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="use-memory"
                  checked={useDesignMemory}
                  onCheckedChange={setUseDesignMemory}
                  disabled={!designMemory}
                />
                <Label 
                  htmlFor="use-memory" 
                  className={!designMemory 
                    ? 'text-gray-400' 
                    : darkMode ? 'text-gray-200' : ''}
                >
                  Use design memory
                  {!designMemory && " (No design memory available)"}
                </Label>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              {designMemory && (
                <Badge variant="outline" className={`text-xs ${darkMode ? 'border-gray-600 text-gray-300' : ''}`}>
                  Design Memory Available
                </Badge>
              )}
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !userInput.trim()}
              className={darkMode ? 'hover:bg-blue-600' : ''}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Wireframe
                </>
              )}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="preview">
          <CardContent className="pt-4 space-y-4">
            {currentWireframe && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : ''}`}>
                      {currentWireframe.title || 'Untitled Wireframe'}
                    </h3>
                    {currentWireframe.description && (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {currentWireframe.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'flowchart' | 'preview')}>
                      <SelectTrigger className={`w-36 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}>
                        <SelectItem value="preview">Visual Preview</SelectItem>
                        <SelectItem value="flowchart">Structure View</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {viewMode === 'preview' && (
                      <Select value={deviceType} onValueChange={(value) => setDeviceType(value as 'desktop' | 'mobile')}>
                        <SelectTrigger className={`w-32 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}>
                          <SelectItem value="desktop">Desktop</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                
                {/* Style information */}
                {intentData && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {intentData.visualTone && intentData.visualTone.split(',').map((tone: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className={darkMode ? 'bg-gray-600 text-gray-200' : ''}>{tone.trim()}</Badge>
                    ))}
                    {intentData.pageType && <Badge variant="outline" className={darkMode ? 'border-gray-600 text-gray-300' : ''}>{intentData.pageType}</Badge>}
                    {intentData.complexity && <Badge variant="outline" className={darkMode ? 'border-gray-600 text-gray-300' : ''}>{intentData.complexity}</Badge>}
                  </div>
                )}
                
                <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : ''}`}>
                  {viewMode === 'flowchart' ? (
                    <div className={`p-4 ${darkMode ? 'bg-gray-800' : ''}`}>
                      <FlowchartView 
                        pages={currentWireframe.pages || [{ sections: currentWireframe.sections || [] }]} 
                        showDetails={true}
                      />
                    </div>
                  ) : (
                    <div className={`p-4 ${deviceType === 'mobile' ? 'max-w-sm mx-auto' : ''} ${darkMode ? 'bg-gray-800' : ''}`}>
                      <WireframeVisualizer
                        wireframeData={currentWireframe}
                        viewMode="preview"
                        deviceType={deviceType}
                        darkMode={darkMode}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter>
            <Button onClick={handleSave} disabled={!currentWireframe} className={darkMode ? 'hover:bg-blue-600' : ''}>
              Save Wireframe
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="code">
          <CardContent className="pt-4">
            {currentWireframe && (
              <div className={`border rounded-lg p-4 overflow-auto max-h-[500px] ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50'}`}>
                <pre className="text-xs">
                  {JSON.stringify(currentWireframe, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AdvancedWireframeGenerator;
