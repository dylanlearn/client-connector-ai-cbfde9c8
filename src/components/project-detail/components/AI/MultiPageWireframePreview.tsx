
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WireframeDataVisualizer } from '@/components/wireframe';

interface MultiPageWireframePreviewProps {
  projectId: string;
  wireframes: any[];
}

const MultiPageWireframePreview: React.FC<MultiPageWireframePreviewProps> = ({
  projectId,
  wireframes = []
}) => {
  const [activeTab, setActiveTab] = useState<string>(wireframes[0]?.id || '');
  
  if (!wireframes || wireframes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wireframe Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No wireframes available for this project</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Wireframes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {wireframes.map(wireframe => (
              <TabsTrigger key={wireframe.id} value={wireframe.id}>
                {wireframe.title || `Wireframe ${wireframe.id.slice(0, 4)}`}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {wireframes.map(wireframe => (
            <TabsContent key={wireframe.id} value={wireframe.id}>
              <WireframeDataVisualizer 
                wireframeData={wireframe} 
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultiPageWireframePreview;
