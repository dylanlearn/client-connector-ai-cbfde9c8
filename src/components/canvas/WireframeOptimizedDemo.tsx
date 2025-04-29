
import React, { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import { useHighPerformanceCanvas } from '@/hooks/canvas/use-high-performance-canvas';
import { useEnhancedCanvasEngine } from '@/hooks/canvas/use-enhanced-canvas-engine';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Layers, 
  Trash2, 
  Cpu, 
  MemoryStick, 
  Plus, 
  SquareStack
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Demo component that showcases canvas optimization features
const WireframeOptimizedDemo: React.FC = () => {
  const {
    canvas,
    canvasRef,
    performanceMetrics,
    canvasControls,
    addObject,
    clearCanvas
  } = useEnhancedCanvasEngine({
    canvasOptions: {
      width: 1200,
      height: 800,
      backgroundColor: '#f9f9f9'
    },
    gridOptions: {
      visible: true,
      size: 20,
      type: 'lines'
    },
    optimizationOptions: {
      useLayerCaching: true,
      incrementalRendering: true,
      hardwareAcceleration: true
    },
    memoryOptions: {
      autoGarbageCollection: true,
      objectPooling: true
    }
  });
  
  const [activeTab, setActiveTab] = useState('performance');
  const [stressTestLevel, setStressTestLevel] = useState(200);
  const [recordingMetrics, setRecordingMetrics] = useState(false);
  const metricsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Add some default shapes when canvas is ready
  useEffect(() => {
    if (!canvas) return;
    
    // Add a welcome text
    const text = new fabric.Text('Canvas Optimization Demo', {
      left: 50,
      top: 50,
      fontFamily: 'Arial',
      fontSize: 30,
      fill: '#333'
    });
    
    // Add a rectangle
    const rect = new fabric.Rect({
      left: 50,
      top: 100,
      width: 100,
      height: 100,
      fill: '#3498db',
      stroke: '#2980b9',
      strokeWidth: 2,
      rx: 10,
      ry: 10
    });
    
    // Add a circle
    const circle = new fabric.Circle({
      left: 200,
      top: 100,
      radius: 50,
      fill: '#e74c3c',
      stroke: '#c0392b',
      strokeWidth: 2
    });
    
    canvas.add(text, rect, circle);
    canvas.renderAll();
  }, [canvas]);
  
  // Add random objects to stress test the canvas
  const addRandomObjects = (count: number) => {
    if (!canvas) return;
    
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];
    const canvasWidth = canvas.width || 1200;
    const canvasHeight = canvas.height || 800;
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * (canvasWidth - 100);
      const y = Math.random() * (canvasHeight - 100);
      const size = 20 + Math.random() * 80;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Randomly choose between rectangle, circle, triangle, or text
      const shapeType = Math.floor(Math.random() * 4);
      
      let shape: fabric.Object;
      
      switch (shapeType) {
        case 0: // Rectangle
          shape = new fabric.Rect({
            left: x,
            top: y,
            width: size,
            height: size,
            fill: color,
            opacity: 0.7 + Math.random() * 0.3,
            rx: Math.random() > 0.5 ? 10 : 0,
            ry: Math.random() > 0.5 ? 10 : 0
          });
          break;
        
        case 1: // Circle
          shape = new fabric.Circle({
            left: x,
            top: y,
            radius: size / 2,
            fill: color,
            opacity: 0.7 + Math.random() * 0.3
          });
          break;
        
        case 2: // Triangle
          shape = new fabric.Triangle({
            left: x,
            top: y,
            width: size,
            height: size,
            fill: color,
            opacity: 0.7 + Math.random() * 0.3
          });
          break;
        
        default: // Text
          shape = new fabric.Text('Text', {
            left: x,
            top: y,
            fontSize: Math.floor(size / 4) + 10,
            fill: color,
            opacity: 0.7 + Math.random() * 0.3
          });
          break;
      }
      
      addObject(shape);
    }
  };
  
  // Start/stop recording metrics
  const toggleRecordMetrics = () => {
    if (recordingMetrics) {
      // Stop recording
      if (metricsTimerRef.current) {
        clearInterval(metricsTimerRef.current);
        metricsTimerRef.current = null;
      }
      setRecordingMetrics(false);
    } else {
      // Start recording
      setRecordingMetrics(true);
      
      // Record metrics every second
      metricsTimerRef.current = setInterval(() => {
        if (!performanceMetrics) return;
        
        // Record metrics to Supabase
        const metrics = {
          user_id: '00000000-0000-0000-0000-000000000000', // Demo user ID
          wireframe_id: 'demo-wireframe',
          test_name: 'optimization-demo',
          render_time_ms: performanceMetrics.rendering.renderTime,
          fps: performanceMetrics.rendering.frameRate,
          memory_usage_kb: performanceMetrics.memory.estimatedMemoryUsage / 1024,
          resource_usage: { 
            objectCount: performanceMetrics.rendering.objectCount,
            inactivePoolSize: performanceMetrics.memory.inactivePoolSize,
            activePoolSize: performanceMetrics.memory.activePoolSize,
            gcRuns: performanceMetrics.memory.gcRuns
          },
          browser_info: {
            userAgent: navigator.userAgent,
            vendor: navigator.vendor,
            platform: navigator.platform
          },
          device_info: {
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio
          }
        };
        
        supabase
          .from('canvas_performance_metrics')
          .insert([metrics])
          .then(({ error }) => {
            if (error) console.error('Error recording metrics:', error);
          });
        
      }, 1000);
    }
  };
  
  return (
    <div className="flex flex-col h-full border rounded-lg shadow-sm bg-background">
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold mr-4">Canvas Optimization Demo</h2>
          {canvasControls}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addRandomObjects(50)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add 50 Objects
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addRandomObjects(500)}
          >
            <SquareStack className="h-4 w-4 mr-1" /> Add 500 Objects
          </Button>
          <Button 
            variant={recordingMetrics ? "destructive" : "outline"} 
            size="sm" 
            onClick={toggleRecordMetrics}
          >
            <Activity className="h-4 w-4 mr-1" /> {recordingMetrics ? 'Stop Recording' : 'Record Metrics'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => clearCanvas()}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Clear Canvas
          </Button>
        </div>
      </div>
      
      <div className="flex flex-grow">
        <div className="w-3/4 relative">
          <canvas 
            ref={canvasRef} 
            className="border-r" 
          />
        </div>
        
        <div className="w-1/4 border-l">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="performance">
                <Cpu className="h-4 w-4 mr-1" /> Performance
              </TabsTrigger>
              <TabsTrigger value="memory">
                <MemoryStick className="h-4 w-4 mr-1" /> Memory
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">FPS</h3>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${Math.min(100, (performanceMetrics?.rendering?.frameRate || 0) / 60 * 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{performanceMetrics?.rendering?.frameRate || 0} FPS</span>
                  <span>Target: 60 FPS</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Render Time</h3>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      (performanceMetrics?.rendering?.renderTime || 0) < 16
                        ? 'bg-green-500'
                        : (performanceMetrics?.rendering?.renderTime || 0) < 32
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (performanceMetrics?.rendering?.renderTime || 0) / 50 * 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{performanceMetrics?.rendering?.renderTime || 0} ms</span>
                  <span>Target: &lt;16ms</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Object Count</h3>
                <div className="text-2xl font-semibold">
                  {performanceMetrics?.rendering?.objectCount || 0}
                </div>
                <div className="text-xs text-muted-foreground">Total objects on canvas</div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Stress Test</h3>
                <input 
                  type="range" 
                  min="100" 
                  max="10000" 
                  step="100" 
                  value={stressTestLevel} 
                  onChange={(e) => setStressTestLevel(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between">
                  <span className="text-xs">Objects: {stressTestLevel}</span>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => addRandomObjects(stressTestLevel)}
                  >
                    Run Test
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="memory" className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Memory Usage</h3>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      (performanceMetrics?.memory?.estimatedMemoryUsage || 0) < 50 * 1024 * 1024
                        ? 'bg-green-500'
                        : (performanceMetrics?.memory?.estimatedMemoryUsage || 0) < 100 * 1024 * 1024
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (performanceMetrics?.memory?.estimatedMemoryUsage || 0) / (200 * 1024 * 1024) * 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{((performanceMetrics?.memory?.estimatedMemoryUsage || 0) / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>Target: &lt;100MB</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Active Objects</h3>
                  <div className="text-2xl font-semibold">
                    {performanceMetrics?.memory?.activePoolSize || 0}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Object Pool Size</h3>
                  <div className="text-2xl font-semibold">
                    {performanceMetrics?.memory?.inactivePoolSize || 0}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Garbage Collection Runs</h3>
                <div className="text-2xl font-semibold">
                  {performanceMetrics?.memory?.gcRuns || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total GC cycles since initialization
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Memory Management</h3>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      // Force garbage collection
                      if (typeof window !== 'undefined' && window.gc) {
                        try {
                          window.gc();
                        } catch (e) {
                          console.error('Cannot force GC', e);
                        }
                      }
                    }}
                  >
                    Force GC
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WireframeOptimizedDemo;
