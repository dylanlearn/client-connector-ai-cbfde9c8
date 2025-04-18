
import React, { useCallback, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Square, Circle, Type, Image as ImageIcon, 
  Layers, MousePointer, Settings
} from 'lucide-react';
import EnhancedWireframeCanvas from '@/components/wireframe/EnhancedWireframeCanvas';

const EnhancedCanvasDemo: React.FC = () => {
  const { toast } = useToast();
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [activeTool, setActiveTool] = useState<string>('select');

  // Handle canvas ready
  const handleCanvasReady = useCallback((fabricCanvas: fabric.Canvas) => {
    setCanvas(fabricCanvas);
    
    // Add some sample objects
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 150,
      fill: '#3b82f6',
      data: {
        id: 'rect1',
        type: 'rectangle',
        name: 'Blue Rectangle'
      }
    });
    
    const circle = new fabric.Circle({
      left: 400,
      top: 150,
      radius: 80,
      fill: '#10b981',
      data: {
        id: 'circle1',
        type: 'circle',
        name: 'Green Circle'
      }
    });
    
    const text = new fabric.Text('Interactive Canvas', {
      left: 100,
      top: 400,
      fontSize: 24,
      fontFamily: 'Inter',
      fill: '#111827',
      data: {
        id: 'text1',
        type: 'text',
        name: 'Heading Text'
      }
    });
    
    fabricCanvas.add(rect, circle, text);
    fabricCanvas.renderAll();
    
    toast({
      title: 'Canvas Ready',
      description: 'Enhanced canvas loaded with demo objects.'
    });
  }, [toast]);

  // Handle tool clicks
  const handleToolClick = useCallback((tool: string) => {
    if (!canvas) return;
    
    setActiveTool(tool);
    canvas.isDrawingMode = tool === 'draw';
    
    if (tool === 'select') {
      canvas.selection = true;
    }
    
    // Add objects based on selected tool
    if (tool === 'rectangle') {
      const rect = new fabric.Rect({
        left: 150,
        top: 150,
        width: 100,
        height: 100,
        fill: '#f59e0b',
        data: {
          id: `rect-${Date.now()}`,
          type: 'rectangle',
          name: 'New Rectangle'
        }
      });
      
      canvas.add(rect);
      canvas.setActiveObject(rect);
    }
    
    if (tool === 'circle') {
      const circle = new fabric.Circle({
        left: 150,
        top: 150,
        radius: 50,
        fill: '#ec4899',
        data: {
          id: `circle-${Date.now()}`,
          type: 'circle',
          name: 'New Circle'
        }
      });
      
      canvas.add(circle);
      canvas.setActiveObject(circle);
    }
    
    if (tool === 'text') {
      const text = new fabric.Textbox('Double-click to edit', {
        left: 150,
        top: 150,
        width: 200,
        fontSize: 18,
        fontFamily: 'Inter',
        fill: '#111827',
        data: {
          id: `text-${Date.now()}`,
          type: 'text',
          name: 'New Text'
        }
      });
      
      canvas.add(text);
      canvas.setActiveObject(text);
    }
    
    canvas.requestRenderAll();
  }, [canvas]);

  // Handle object selection
  const handleObjectSelected = useCallback((object: fabric.Object | null) => {
    if (object) {
      setSelectedObjects(object.type === 'activeSelection' 
        ? (object as fabric.ActiveSelection).getObjects()
        : [object]
      );
    } else {
      setSelectedObjects([]);
    }
  }, []);

  // Create selection groups
  const handleCreateGroup = useCallback(() => {
    if (!canvas || selectedObjects.length < 2) {
      toast({
        title: 'Cannot Group',
        description: 'Please select at least two objects to create a group.',
        variant: 'destructive'
      });
      return;
    }
    
    const activeSelection = canvas.getActiveObject() as fabric.ActiveSelection;
    if (!activeSelection || activeSelection.type !== 'activeSelection') return;
    
    const group = activeSelection.toGroup();
    group.data = {
      id: `group-${Date.now()}`,
      type: 'group',
      name: 'Object Group'
    };
    
    canvas.requestRenderAll();
    
    toast({
      title: 'Group Created',
      description: 'Selected objects have been grouped together.'
    });
  }, [canvas, selectedObjects, toast]);

  // Ungroup selection
  const handleUngroup = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'group') {
      toast({
        title: 'Cannot Ungroup',
        description: 'Please select a group to ungroup.',
        variant: 'destructive'
      });
      return;
    }
    
    const group = activeObject as fabric.Group;
    group.toActiveSelection();
    canvas.requestRenderAll();
    
    toast({
      title: 'Group Ungrouped',
      description: 'Group has been split into individual objects.'
    });
  }, [canvas, selectedObjects, toast]);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="text-3xl font-bold mb-6">Enhanced Canvas Demo</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:flex-1 order-2 lg:order-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Interactive Canvas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <EnhancedWireframeCanvas
                width={1200}
                height={800}
                onCanvasReady={handleCanvasReady}
                onObjectSelected={handleObjectSelected}
                initialConfig={{
                  showGrid: true,
                  snapToGrid: true,
                  showGuides: true,
                  gridSize: 20,
                  backgroundColor: '#ffffff'
                }}
                viewportConfig={{
                  showControls: true,
                  showMinimap: true,
                  allowMultiViewport: true,
                  persistViewportState: true
                }}
                className="max-h-[600px]"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-64 order-1 lg:order-2">
          <Tabs defaultValue="tools">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="mt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={activeTool === 'select' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('select')}
                  className="justify-start"
                >
                  <MousePointer className="h-4 w-4 mr-2" />
                  Select
                </Button>
                
                <Button
                  variant={activeTool === 'rectangle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('rectangle')}
                  className="justify-start"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Rectangle
                </Button>
                
                <Button
                  variant={activeTool === 'circle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('circle')}
                  className="justify-start"
                >
                  <Circle className="h-4 w-4 mr-2" />
                  Circle
                </Button>
                
                <Button
                  variant={activeTool === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('text')}
                  className="justify-start"
                >
                  <Type className="h-4 w-4 mr-2" />
                  Text
                </Button>
              </div>
              
              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium">Selection Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateGroup}
                    disabled={selectedObjects.length < 2}
                  >
                    Group
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUngroup}
                    disabled={!selectedObjects.some(obj => obj.type === 'group')}
                  >
                    Ungroup
                  </Button>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click the ? button to show keyboard shortcuts</li>
                  <li>• Hold Space + Drag to pan the canvas</li>
                  <li>• Use Ctrl+Scroll to zoom in/out</li>
                  <li>• Delete key removes selected objects</li>
                  <li>• Try the multi-viewport button in the toolbar</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="layers" className="mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Selected Objects</h3>
                {selectedObjects.length > 0 ? (
                  <div className="space-y-1">
                    {selectedObjects.map((obj, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
                      >
                        <span>{obj.data?.name || obj.type}</span>
                        <span className="text-xs text-muted-foreground">
                          ID: {obj.data?.id || 'unknown'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No objects selected
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Canvas Settings</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    These settings are managed by the EnhancedWireframeCanvas component.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <span className="w-24">Grid:</span>
                      <span className="text-green-600">Enabled</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-24">Snap to Grid:</span>
                      <span className="text-green-600">Enabled</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-24">Smart Guides:</span>
                      <span className="text-green-600">Enabled</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-24">Multi-viewport:</span>
                      <span className="text-green-600">Enabled</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCanvasDemo;
