
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DesignWireframeBridge } from './DesignWireframeBridge';
import { EnhancedVisualPicker } from './EnhancedVisualPicker';
import { WireframeData, WireframeGenerationResult } from '@/services/ai/wireframe/wireframe-types';
import { DesignSuggestion } from '@/hooks/wireframe/use-wireframe-variations';
import { AIWireframeRenderer } from '@/components/wireframe/AIWireframeRenderer';
import { Paintbrush, Layout, Wand2 } from 'lucide-react';

interface WireframeDesignIntegrationProps {
  projectId?: string;
  initialWireframe?: WireframeData;
  className?: string;
}

export const WireframeDesignIntegration: React.FC<WireframeDesignIntegrationProps> = ({
  projectId,
  initialWireframe,
  className
}) => {
  const [currentWireframe, setCurrentWireframe] = useState<WireframeData | undefined>(initialWireframe);
  const [currentDesign, setCurrentDesign] = useState<DesignSuggestion | null>(null);
  const [generatedWireframes, setGeneratedWireframes] = useState<WireframeData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('design');
  
  const handleWireframeGenerated = (result: WireframeGenerationResult) => {
    if (result && result.wireframe) {
      setCurrentWireframe(result.wireframe);
      setGeneratedWireframes(prev => [...prev, result.wireframe]);
    }
  };
  
  const handleDesignApplied = (wireframe: WireframeData, design: DesignSuggestion) => {
    setCurrentWireframe(wireframe);
    setCurrentDesign(design);
    setGeneratedWireframes(prev => [...prev, wireframe]);
    
    // Switch to the preview tab to show the result
    setActiveTab('preview');
  };
  
  return (
    <div className={`wireframe-design-integration ${className}`}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Wireframe Design Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="design" 
            value={activeTab}
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Paintbrush className="h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="p-1">
              <DesignWireframeBridge
                initialWireframe={currentWireframe}
                projectId={projectId}
                onWireframeGenerated={handleWireframeGenerated}
                onDesignApplied={handleDesignApplied}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="min-h-[600px] border rounded-lg p-4">
              {currentWireframe ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Wireframe Preview</h3>
                  <AIWireframeRenderer 
                    wireframe={currentWireframe}
                    className="h-[500px] border rounded overflow-auto"
                  />
                  
                  {currentDesign && (
                    <div className="p-4 bg-muted rounded-lg mt-4">
                      <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Wand2 className="h-4 w-4" /> 
                        Applied Design Elements
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Colors</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {currentDesign.colorScheme && (
                              Object.entries(currentDesign.colorScheme).map(([key, color]) => (
                                <div key={key} className="flex items-center gap-1">
                                  <div 
                                    className="w-4 h-4 rounded-full" 
                                    style={{ backgroundColor: color }}
                                  ></div>
                                  <span>{key}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium">Typography</p>
                          <div className="mt-2">
                            {currentDesign.typography && (
                              <>
                                <p>Headings: {currentDesign.typography.headings}</p>
                                <p>Body: {currentDesign.typography.body}</p>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium">Layout Style</p>
                          <p className="mt-2 capitalize">{currentDesign.layoutStyle || "Standard"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    Generate a wireframe and apply design suggestions to see the preview
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WireframeDesignIntegration;
