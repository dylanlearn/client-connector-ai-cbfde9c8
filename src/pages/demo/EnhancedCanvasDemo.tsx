
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedWireframeCanvas } from '@/components/wireframe/utils';
import MultiViewportCanvas from '@/components/wireframe/navigation/MultiViewportCanvas';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { fabric } from 'fabric';

const mockWireframeData = {
  id: 'demo-wireframe',
  title: 'Demo Wireframe',
  description: 'A demo wireframe for the canvas',
  sections: [
    {
      id: 'section-1',
      name: 'Header',
      sectionType: 'header',
      components: []
    },
    {
      id: 'section-2',
      name: 'Hero',
      sectionType: 'hero',
      components: []
    },
    {
      id: 'section-3',
      name: 'Features',
      sectionType: 'features',
      components: []
    }
  ],
  colorScheme: {
    primary: '#3498db',
    secondary: '#2ecc71',
    accent: '#e74c3c',
    background: '#f8f9fa'
  },
  typography: {
    headings: 'Inter',
    body: 'Roboto'
  }
};

const EnhancedCanvasDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [canvasInstance, setCanvasInstance] = useState<fabric.Canvas | null>(null);
  
  const handleCanvasReady = useCallback((canvas: fabric.Canvas) => {
    setCanvasInstance(canvas);
    
    // Create some example shapes
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: '#3498db',
      stroke: '#2980b9',
      strokeWidth: 2,
      rx: 8,
      ry: 8
    });
    
    const circle = new fabric.Circle({
      left: 400,
      top: 150,
      radius: 50,
      fill: '#2ecc71',
      stroke: '#27ae60',
      strokeWidth: 2
    });
    
    const text = new fabric.Text('Enhanced Canvas', {
      left: 200,
      top: 250,
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#333'
    });
    
    canvas.add(rect, circle, text);
    canvas.renderAll();
  }, []);
  
  const handleObjectSelected = (object: any) => {
    setSelectedObject(object);
  };
  
  const canvasConfig: Partial<WireframeCanvasConfig> = {
    width: 1200,
    height: 800,
    showGrid: true,
    snapToGrid: true,
    showSmartGuides: true,
    gridSize: 20,
    backgroundColor: '#ffffff'
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Enhanced Canvas Demo</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Canvas</TabsTrigger>
          <TabsTrigger value="multi">Multi-Viewport</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Wireframe Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedWireframeCanvas
                wireframe={mockWireframeData}
                onRenderComplete={handleCanvasReady}
                onSectionClick={(sectionId) => console.log('Section clicked:', sectionId)}
                interactive={true}
                showControls={true}
                canvasConfig={canvasConfig}
                className="border rounded-md"
                darkMode={false}
                deviceType="desktop"
              />
            </CardContent>
          </Card>
          
          {selectedObject && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Selected Object</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-40">
                  {JSON.stringify(selectedObject, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="multi">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Viewport Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiViewportCanvas
                width={1200}
                height={800}
                initialViewMode="single"
                wireframeData={mockWireframeData}
                onSectionFocus={(viewportIndex, sectionId) => {
                  console.log(`Section ${sectionId} focused in viewport ${viewportIndex}`);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCanvasDemo;
