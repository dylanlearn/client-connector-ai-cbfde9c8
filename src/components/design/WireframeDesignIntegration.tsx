
import React, { useState } from 'react';
import AIWireframeRenderer from '@/components/wireframe/AIWireframeRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DesignWireframeBridge } from './DesignWireframeBridge';
import { EnhancedVisualPicker } from './EnhancedVisualPicker';
import { WireframeData, WireframeGenerationResult } from '@/services/ai/wireframe/wireframe-types';
import { DesignSuggestion } from '@/hooks/wireframe/use-wireframe-variations';
import { Paintbrush, Layout, Wand2 } from 'lucide-react';

interface WireframeDesignIntegrationProps {
  projectId?: string;
  initialWireframe?: WireframeData;
  onWireframeGenerated?: (wireframe: WireframeGenerationResult) => void;
}

// Define the BackgroundColor type to fix the type error
type BackgroundColor = string;

export const WireframeDesignIntegration: React.FC<WireframeDesignIntegrationProps> = ({
  projectId,
  initialWireframe,
  onWireframeGenerated
}) => {
  const [activeTab, setActiveTab] = useState<string>('design');
  const [currentDesign, setCurrentDesign] = useState<DesignSuggestion | null>(null);
  const [generatedWireframes, setGeneratedWireframes] = useState<WireframeGenerationResult[]>([]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const handleDesignApplied = (design: DesignSuggestion) => {
    setCurrentDesign(design);
  };
  
  const handleWireframeGenerated = (wireframe: WireframeGenerationResult) => {
    if (onWireframeGenerated) {
      onWireframeGenerated(wireframe);
    }
    
    setCurrentDesign(currentDesign);
    setGeneratedWireframes(prev => [...prev, wireframe]);
    
    setActiveTab('preview');
  };
  
  return (
    <div className="wireframe-design-integration">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            Design Selection
          </TabsTrigger>
          <TabsTrigger value="bridge" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Generate Wireframe
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Preview Result
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="design">
          <Card>
            <CardHeader>
              <CardTitle>Select Your Design Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedVisualPicker 
                onDesignSelected={handleDesignApplied}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bridge">
          <Card>
            <CardHeader>
              <CardTitle>Generate Wireframe with Selected Design</CardTitle>
            </CardHeader>
            <CardContent>
              <DesignWireframeBridge 
                projectId={projectId}
                designSuggestion={currentDesign}
                onWireframeGenerated={handleWireframeGenerated}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Wireframe Preview</CardTitle>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-1 rounded ${previewMode === 'desktop' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  Desktop
                </button>
                <button 
                  onClick={() => setPreviewMode('tablet')}
                  className={`px-3 py-1 rounded ${previewMode === 'tablet' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  Tablet
                </button>
                <button 
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-1 rounded ${previewMode === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  Mobile
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {generatedWireframes.length > 0 ? (
                <AIWireframeRenderer 
                  wireframe={generatedWireframes[generatedWireframes.length - 1].wireframe}
                  deviceType={previewMode}
                  className="border rounded-md"
                />
              ) : (
                <div className="flex items-center justify-center p-8 border border-dashed rounded-md text-muted-foreground">
                  No wireframe generated yet. Select design preferences and generate a wireframe.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
