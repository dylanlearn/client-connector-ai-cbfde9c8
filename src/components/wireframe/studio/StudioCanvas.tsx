
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import WireframeCanvasFabric from '../WireframeCanvasFabric';
import WireframeVisualizer from '../WireframeVisualizer';
import { useSectionInteractions } from '@/hooks/wireframe/use-section-interactions';

interface StudioCanvasProps {
  projectId: string;
  wireframeData: any;
  deviceType: string;
  viewMode: string;
  selectedSection: string | null;
  onUpdate: (wireframe: any) => void;
}

const StudioCanvas: React.FC<StudioCanvasProps> = ({
  projectId,
  wireframeData,
  deviceType,
  viewMode,
  onUpdate
}) => {
  const { selectedSection, handleSectionClick } = useSectionInteractions();

  return (
    <Tabs defaultValue="canvas" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="canvas">Canvas</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="canvas" className="min-h-[600px]">
        <Card>
          <CardContent className="p-0">
            <WireframeCanvasFabric
              projectId={projectId}
              wireframeData={wireframeData}
              onUpdate={onUpdate}
              readOnly={false}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="preview" className="min-h-[600px]">
        <Card>
          <CardContent className="p-6">
            <WireframeVisualizer
              wireframe={wireframeData}
              deviceType={deviceType}
              viewMode={viewMode}
              onSectionClick={handleSectionClick}
              selectedSectionId={selectedSection}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StudioCanvas;

