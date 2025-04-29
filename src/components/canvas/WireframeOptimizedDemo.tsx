import React, { useCallback, useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import HighPerformanceCanvas from './HighPerformanceCanvas';
import { fabric } from 'fabric';
import { 
  LayoutGrid, 
  Layers, 
  Plus, 
  Trash2, 
  Gauge, 
  RotateCcw 
} from 'lucide-react';

const WireframeOptimizedDemo: React.FC = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [showStats, setShowStats] = useState<boolean>(true);
  const [autoOptimize, setAutoOptimize] = useState<boolean>(true);
  const [objectCount, setObjectCount] = useState<number>(0);
  
  // Handle canvas ready
  const handleCanvasReady = useCallback((fabricCanvas: fabric.Canvas) => {
    setCanvas(fabricCanvas);
    
    // Add grid for wireframing
    const gridSize = 20;
    const width = fabricCanvas.getWidth();
    const height = fabricCanvas.getHeight();
    
    // Add horizontal lines
    for (let i = gridSize; i < height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      fabricCanvas.add(line);
      fabricCanvas.sendToBack(line);
    }
    
    // Add vertical lines
    for (let i = gridSize; i < width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      fabricCanvas.add(line);
      fabricCanvas.sendToBack(line);
    }
    
    fabricCanvas.renderAll();
  }, []);
  
  // Add shapes to test performance
  const addBoxes = useCallback((count: number = 10) => {
    if (!canvas) return;
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 100 + 50;
      const opacity = Math.random() * 0.5 + 0.3;
      
      // Alternate between rectangles and circles
      if (i % 2 === 0) {
        const rect = new fabric.Rect({
          left: Math.random() * (canvas.width! - size),
          top: Math.random() * (canvas.height! - size),
          width: size,
          height: size,
          fill: `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${opacity})`,
          stroke: '#555',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
          shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.2)',
            blur: 10,
            offsetX: 5,
            offsetY: 5
          }),
          objectCaching: true,
        });
        canvas.add(rect);
      } else {
        const circle = new fabric.Circle({
          left: Math.random() * (canvas.width! - size),
          top: Math.random() * (canvas.height! - size),
          radius: size / 2,
          fill: `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${opacity})`,
          stroke: '#555',
          strokeWidth: 1,
          shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.2)',
            blur: 10,
            offsetX: 5,
            offsetY: 5
          }),
          objectCaching: true,
        });
        canvas.add(circle);
      }
    }
    
    canvas.renderAll();
    setObjectCount(canvas.getObjects().filter(obj => obj.stroke !== '#e0e0e0').length);
  }, [canvas]);
  
  // Add text objects
  const addText = useCallback((count: number = 5) => {
    if (!canvas) return;
    
    const texts = [
      "Header Text",
      "Button Label",
      "Menu Item",
      "Description text for the wireframe element that might be longer than others",
      "Footer Text",
    ];
    
    for (let i = 0; i < count; i++) {
      const textObj = new fabric.Text(texts[i % texts.length], {
        left: Math.random() * (canvas.width! - 200),
        top: Math.random() * (canvas.height! - 30),
        fontSize: i % 3 === 0 ? 24 : (i % 3 === 1 ? 16 : 12),
        fontFamily: 'Arial',
        fill: '#333',
        objectCaching: true,
      });
      canvas.add(textObj);
    }
    
    canvas.renderAll();
    setObjectCount(canvas.getObjects().filter(obj => obj.stroke !== '#e0e0e0').length);
  }, [canvas]);
  
  // Clear all non-grid objects
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const objectsToRemove = objects.filter(obj => {
      // Keep grid lines
      if (obj.stroke === '#e0e0e0' && obj.strokeWidth === 0.5) {
        return false;
      }
      return true;
    });
    
    objectsToRemove.forEach(obj => {
      canvas.remove(obj);
    });
    
    canvas.renderAll();
    setObjectCount(0);
  }, [canvas]);
  
  // Add stress test objects (many objects to test performance)
  const addStressTest = useCallback(() => {
    if (!canvas) return;
    
    addBoxes(100);
    addText(50);
  }, [canvas, addBoxes, addText]);
  
  // Keep track of object count
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectAdded = () => {
      setObjectCount(canvas.getObjects().filter(obj => obj.stroke !== '#e0e0e0').length);
    };
    
    const handleObjectRemoved = () => {
      setObjectCount(canvas.getObjects().filter(obj => obj.stroke !== '#e0e0e0').length);
    };
    
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvas]);
  
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Optimized Wireframe Canvas</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-stats" 
                  checked={showStats} 
                  onCheckedChange={setShowStats} 
                />
                <Label htmlFor="show-stats">Stats</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-optimize" 
                  checked={autoOptimize} 
                  onCheckedChange={setAutoOptimize} 
                />
                <Label htmlFor="auto-optimize">Auto-optimize</Label>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Layers className="mr-1 h-4 w-4" />
                <span>Objects: {objectCount}</span>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            High-performance canvas with layer caching, incremental rendering, and memory management
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="canvas">
            <div className="px-6 pt-2 border-b">
              <TabsList>
                <TabsTrigger value="canvas">Canvas</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="canvas" className="m-0">
              <div className="p-6">
                <HighPerformanceCanvas 
                  width={1100} 
                  height={600}
                  onCanvasReady={handleCanvasReady}
                  showPerformanceStats={showStats}
                  autoOptimize={autoOptimize}
                  className="border rounded-md shadow-sm"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="m-0">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Gauge className="mr-2 h-4 w-4" />
                        Performance Optimization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>This canvas implements several performance optimizations:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Layer caching for static elements</li>
                        <li>Incremental rendering for changed objects</li>
                        <li>Hardware acceleration via CSS transforms</li>
                        <li>Object visibility culling for off-screen elements</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Memory Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>Memory optimizations include:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Object pooling for repeated elements</li>
                        <li>Automatic garbage collection for unused objects</li>
                        <li>Resource usage monitoring</li>
                        <li>Dynamic quality adjustments based on performance</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">How to test performance:</h3>
                  <p className="text-sm mb-4">Use the buttons below to add objects to the canvas and see how performance holds up even with many objects.</p>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => addBoxes(10)} variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" />
                      Add 10 Shapes
                    </Button>
                    <Button onClick={() => addBoxes(100)} variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" />
                      Add 100 Shapes
                    </Button>
                    <Button onClick={() => addText(10)} variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" />
                      Add 10 Texts
                    </Button>
                    <Button onClick={addStressTest} variant="outline" size="sm" className="text-amber-600 border-amber-600">
                      <Plus className="mr-1 h-3 w-3" />
                      Stress Test (150+ objects)
                    </Button>
                    <Button onClick={clearCanvas} variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-3 w-3" />
                      Clear Canvas
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t p-4 flex justify-between">
          <div className="text-xs text-muted-foreground">
            Toggle stats display to see real-time performance metrics
          </div>
          <div className="flex gap-2">
            <Button onClick={() => addBoxes()} size="sm" variant="outline">
              <LayoutGrid className="mr-1 h-4 w-4" />
              Add Sample Wireframe Elements
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WireframeOptimizedDemo;
