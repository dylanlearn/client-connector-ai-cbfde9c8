
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import WireframeCanvasFabric from '../WireframeCanvasFabric';
import WireframeVisualizer from '../WireframeVisualizer';
import { useSectionInteractions } from '@/hooks/wireframe/use-section-interactions';
import { StudioCanvasProps } from '../types/studio-types';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

const StudioCanvas: React.FC<StudioCanvasProps> = ({
  projectId,
  wireframeData,
  deviceType,
  viewMode,
  selectedSection,
  onUpdate
}) => {
  const errorHandler = useErrorHandler({ componentName: 'StudioCanvas' });
  const { selectedSection: interactionSelectedSection, handleSectionClick } = useSectionInteractions();

  const handleUpdate = (updatedData: WireframeData) => {
    try {
      onUpdate(updatedData);
    } catch (error) {
      errorHandler.handleError(error, 'Error in canvas update');
    }
  };

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
              onUpdate={handleUpdate}
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
              darkMode={false} 
              viewMode={viewMode}
              onSectionClick={handleSectionClick}
              activeSection={selectedSection}
              deviceType={deviceType}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StudioCanvas;
