
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { WireframeEditor } from '@/components/wireframe';
import { WireframeVisualizer, WireframeDataVisualizer } from '@/components/wireframe';
import { AdvancedWireframeGenerator } from '@/components/wireframe';

interface EnhancedWireframeStudioProps {
  projectId?: string;
}

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('generator');
  const { currentWireframe } = useWireframeGeneration();

  return (
    <div className="enhanced-wireframe-studio">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="visualizer">Preview</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <Card>
            <AdvancedWireframeGenerator 
              projectId={projectId} 
              viewMode="editor"
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="visualizer">
          <Card>
            {currentWireframe?.wireframe ? (
              <WireframeVisualizer 
                wireframeData={currentWireframe.wireframe} 
                preview={true}
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                <p className="text-muted-foreground">No wireframe to preview. Generate one first.</p>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            {currentWireframe?.wireframe ? (
              <WireframeDataVisualizer wireframeData={currentWireframe.wireframe} />
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                <p className="text-muted-foreground">No wireframe data to display. Generate one first.</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedWireframeStudio;
