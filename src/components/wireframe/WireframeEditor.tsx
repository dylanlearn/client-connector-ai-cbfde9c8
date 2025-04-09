
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WireframeSection, WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { WireframeCanvasEnhanced } from './WireframeCanvasEnhanced';

interface WireframeEditorProps {
  projectId?: string;
  wireframeData?: WireframeData;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({
  projectId,
  wireframeData
}) => {
  const [sections, setSections] = useState<WireframeSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<WireframeSection | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(800);
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  useEffect(() => {
    if (wireframeData?.sections) {
      setSections(wireframeData.sections);
    }
  }, [wireframeData]);
  
  const handleSectionClick = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setSelectedSection(section);
    }
  };
  
  const handleSectionChange = (updatedSection: WireframeSection) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === updatedSection.id ? updatedSection : section
      )
    );
  };
  
  return (
    <div className="wireframe-editor p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Wireframe Editor</h2>
        
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDeviceType('desktop')}
          >
            Desktop
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDeviceType('tablet')}
          >
            Tablet
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDeviceType('mobile')}
          >
            Mobile
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="canvas">
        <TabsList>
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="canvas" className="mt-2">
          <div className="border rounded-md overflow-hidden" style={{ height: '600px' }}>
            <WireframeCanvasEnhanced
              sections={sections}
              width={canvasWidth}
              height={canvasHeight}
              editable={true}
              showGrid={showGrid}
              snapToGrid={snapToGrid}
              deviceType={deviceType}
              onSectionClick={handleSectionClick}
              onSectionChange={handleSectionChange}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-2">
          <div className="border rounded-md overflow-hidden" style={{ height: '600px' }}>
            <WireframeCanvasEnhanced
              sections={sections}
              width={canvasWidth}
              height={canvasHeight}
              editable={false}
              showGrid={false}
              snapToGrid={false}
              deviceType={deviceType}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedSection && (
        <div className="mt-4 p-4 border rounded-md">
          <h3 className="font-medium mb-2">Edit Section: {selectedSection.name}</h3>
          {/* Section editor controls would go here */}
        </div>
      )}
    </div>
  );
};

export default WireframeEditor;
