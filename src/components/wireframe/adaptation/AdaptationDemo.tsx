
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AdaptiveContainer from './AdaptiveContainer';
import AdaptiveLayout from './AdaptiveLayout';
import AdaptiveElement from './AdaptiveElement';
import { AdaptiveRules } from './adaptation-types';

const AdaptationDemo: React.FC = () => {
  // State for demo controls
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [elementCount, setElementCount] = useState<number>(4);
  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(true);
  const [activeDemo, setActiveDemo] = useState<string>("container");
  
  // Sample adaptive rules
  const adaptiveRules: AdaptiveRules = {
    thresholds: {
      compact: 480,
      expanded: 768
    },
    transformations: {
      header: {
        compact: ['simplify'],
        normal: [],
        expanded: []
      },
      card: {
        compact: ['collapse'],
        normal: [],
        expanded: []
      },
      detail: {
        compact: ['hide'],
        normal: [],
        expanded: []
      }
    },
    spaceAllocation: {
      minSpacing: 8,
      growthDistribution: 'priority',
      preserveAspectRatio: true
    },
    responsive: {
      mobileLayout: 'stack',
      tabletLayout: 'grid',
      reorderElements: true
    },
    content: {
      truncateText: true,
      maxLines: 2,
      imageScaling: 'cover',
      iconBehavior: 'keep'
    }
  };
  
  // Generate demo elements based on count
  const generateElements = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <AdaptiveElement
        key={index}
        adaptiveId={index === 0 ? "header" : index === count - 1 ? "detail" : "card"}
        adaptivePriority={index === 0 ? 3 : index === 1 ? 2 : 1}
        hideOnCompact={index > 3}
        truncateOnCompact={true}
        className="p-4 bg-secondary/10 border rounded-md"
      >
        <h3 className="text-lg font-medium mb-2">Element {index + 1}</h3>
        <p className="text-sm text-muted-foreground">
          This element adapts based on available space and container context.
          {index === 0 && " This is a high-priority element that always shows."}
          {index === count - 1 && " This is a low-priority element that may hide in compact mode."}
        </p>
      </AdaptiveElement>
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Context-Aware Element Adaptation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs value={activeDemo} onValueChange={setActiveDemo}>
              <TabsList className="mb-4">
                <TabsTrigger value="container">Adaptive Container</TabsTrigger>
                <TabsTrigger value="layout">Adaptive Layout</TabsTrigger>
                <TabsTrigger value="complex">Complex Example</TabsTrigger>
              </TabsList>
              
              <TabsContent value="container" className="space-y-4">
                <div className="space-y-2">
                  <Label>Container Width ({containerWidth}px)</Label>
                  <Slider 
                    min={200} 
                    max={1200} 
                    step={10} 
                    value={[containerWidth]}
                    onValueChange={([value]) => setContainerWidth(value)}
                  />
                </div>
                
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={showDebugInfo}
                        onCheckedChange={setShowDebugInfo}
                        id="debug-mode"
                      />
                      <Label htmlFor="debug-mode">Show debug information</Label>
                    </div>
                  </div>
                  
                  <div style={{ width: `${containerWidth}px` }} className="mx-auto border border-dashed border-gray-300 p-4 transition-all duration-300">
                    <AdaptiveContainer 
                      className="bg-muted p-4 rounded-md"
                      adaptiveRules={adaptiveRules}
                      debug={showDebugInfo}
                    >
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold">Adaptive Header</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <AdaptiveElement 
                            adaptiveId="card" 
                            adaptivePriority={2}
                            className="p-4 bg-card rounded-md shadow-sm"
                          >
                            <h3 className="text-lg font-medium">Primary Content</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              This content will adapt based on the available container width.
                              It will change its layout to best fit the available space.
                            </p>
                          </AdaptiveElement>
                          
                          <AdaptiveElement 
                            adaptiveId="detail" 
                            adaptivePriority={1}
                            hideOnCompact={true}
                            className="p-4 bg-card rounded-md shadow-sm"
                          >
                            <h3 className="text-lg font-medium">Secondary Content</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              This content may be hidden in compact mode to save space.
                              The visibility is determined by the adaptive rules.
                            </p>
                          </AdaptiveElement>
                        </div>
                      </div>
                    </AdaptiveContainer>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="layout" className="space-y-4">
                <div className="space-y-2">
                  <Label>Container Width ({containerWidth}px)</Label>
                  <Slider 
                    min={200} 
                    max={1200} 
                    step={10} 
                    value={[containerWidth]}
                    onValueChange={([value]) => setContainerWidth(value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Number of Elements ({elementCount})</Label>
                  <Slider 
                    min={1} 
                    max={8} 
                    step={1} 
                    value={[elementCount]}
                    onValueChange={([value]) => setElementCount(value)}
                  />
                </div>
                
                <div style={{ width: `${containerWidth}px` }} className="mx-auto border border-dashed border-gray-300 p-4 transition-all duration-300">
                  <AdaptiveLayout 
                    className="relative bg-muted p-4 rounded-md"
                    adaptiveRules={adaptiveRules}
                    debug={showDebugInfo}
                    gap={16}
                  >
                    {generateElements(elementCount)}
                  </AdaptiveLayout>
                </div>
              </TabsContent>
              
              <TabsContent value="complex" className="space-y-4">
                <div className="space-y-2">
                  <Label>Container Width ({containerWidth}px)</Label>
                  <Slider 
                    min={200} 
                    max={1200} 
                    step={10} 
                    value={[containerWidth]}
                    onValueChange={([value]) => setContainerWidth(value)}
                  />
                </div>
                
                <div style={{ width: `${containerWidth}px` }} className="mx-auto border border-dashed border-gray-300 p-4 transition-all duration-300">
                  <AdaptiveContainer 
                    className="bg-muted p-4 rounded-md"
                    adaptiveRules={adaptiveRules}
                    debug={showDebugInfo}
                  >
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold mb-4">Product Dashboard</h2>
                      
                      <AdaptiveLayout gap={16}>
                        <Card className="w-full">
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">Sales Overview</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <AdaptiveElement adaptiveId="chart" className="h-40 bg-secondary/10 rounded-md flex items-center justify-center">
                              <span>Interactive Chart (adapts to width)</span>
                            </AdaptiveElement>
                          </CardContent>
                        </Card>
                        
                        <Card className="w-full">
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">Recent Orders</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="divide-y">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <AdaptiveElement 
                                  key={i} 
                                  adaptiveId="order-item"
                                  truncateOnCompact={true}
                                  className="p-4"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">Order #{1000 + i}</div>
                                      <div className="text-sm text-muted-foreground">Customer {1000 + i}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">${(99.99 * (i + 1)).toFixed(2)}</div>
                                      <AdaptiveElement 
                                        hideOnCompact={true} 
                                        className="text-sm text-muted-foreground"
                                      >
                                        2 hours ago
                                      </AdaptiveElement>
                                    </div>
                                  </div>
                                </AdaptiveElement>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </AdaptiveLayout>
                      
                      <AdaptiveLayout gap={16}>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <AdaptiveElement 
                            key={i}
                            adaptiveId={`metric-${i}`}
                            adaptivePriority={3 - i}
                            hideOnCompact={i === 2}
                            className="bg-card p-4 rounded-md shadow-sm"
                          >
                            <div className="text-2xl font-bold">
                              {i === 0 ? '$12,345' : i === 1 ? '1,234' : '98.7%'}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {i === 0 ? 'Total Revenue' : i === 1 ? 'New Customers' : 'Satisfaction Rate'}
                            </div>
                          </AdaptiveElement>
                        ))}
                      </AdaptiveLayout>
                    </div>
                  </AdaptiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Resize the container to see elements adapt to available space
          </p>
          <Button variant="outline" onClick={() => setContainerWidth(800)}>
            Reset Size
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdaptationDemo;
