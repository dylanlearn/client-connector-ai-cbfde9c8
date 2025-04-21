
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollAreaVisualizer } from './ScrollAreaVisualizer';
import { ScrollTriggerEffect } from './ScrollTriggerEffect';

interface InteractiveScrollTesterProps {
  title?: string;
}

const InteractiveScrollTester: React.FC<InteractiveScrollTesterProps> = ({
  title = 'Interactive Scroll Testing',
}) => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Scrolling</TabsTrigger>
            <TabsTrigger value="scrollTrigger">Scroll Triggers</TabsTrigger>
            <TabsTrigger value="overflow">Overflow Behavior</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Test basic scrolling behavior with visualization of scroll position and controls.
            </p>
            
            <ScrollAreaVisualizer
              height={300}
              showControls={true}
              highlightScrollbars={true}
              showScrollPosition={true}
            />
          </TabsContent>
          
          <TabsContent value="scrollTrigger" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Demonstrates elements that respond to scroll position using scroll triggers.
            </p>
            
            <ScrollTriggerEffect 
              height={400}
              triggers={[
                { position: 25, label: 'First Trigger' },
                { position: 50, label: 'Middle Trigger' },
                { position: 75, label: 'Late Trigger' }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="overflow" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Test how content behaves when it overflows in different dimensions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Vertical Overflow</h3>
                <ScrollAreaVisualizer 
                  height={200}
                  contentHeight={500}
                  showControls={false}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Horizontal Overflow</h3>
                <ScrollAreaVisualizer 
                  height={200}
                  showControls={false}
                >
                  <div style={{ width: '1000px', padding: '1rem' }}>
                    <div className="flex gap-4 overflow-x-auto">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-shrink-0 w-64 p-4 rounded-md bg-slate-100"
                        >
                          <h4 className="font-medium">Card {i + 1}</h4>
                          <p className="text-sm text-gray-600">
                            This content demonstrates horizontal scrolling behavior.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollAreaVisualizer>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Both Directions</h3>
                <ScrollAreaVisualizer
                  height={200}
                  showControls={false}
                >
                  <div style={{ width: '1000px', height: '400px', padding: '1rem' }}>
                    <div className="grid grid-cols-5 gap-4">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-md bg-slate-100"
                        >
                          <h4 className="font-medium">Item {i + 1}</h4>
                          <p className="text-sm text-gray-600">
                            Scrolls in both directions.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollAreaVisualizer>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Nested Scrolling</h3>
                <ScrollAreaVisualizer
                  height={200}
                  showControls={false}
                >
                  <div style={{ height: '400px', padding: '1rem' }}>
                    <h3 className="text-lg font-medium mb-4">Outer Scroll Area</h3>
                    <p className="mb-4">Scroll down to see the nested scroll area.</p>
                    
                    <div className="mt-20">
                      <h4 className="font-medium mb-2">Nested Scroll Area:</h4>
                      <div className="border border-slate-200 rounded-md overflow-hidden">
                        <div style={{ height: '150px', overflow: 'auto' }}>
                          <div style={{ height: '300px', padding: '1rem' }}>
                            <p>This is a nested scrollable area inside the main scroll area.</p>
                            <div className="mt-20">
                              <p>You need to scroll to see this content.</p>
                            </div>
                            <div className="mt-20">
                              <p>And scroll even more to see this text.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-20">
                      <p>More content after the nested scroll area.</p>
                    </div>
                  </div>
                </ScrollAreaVisualizer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InteractiveScrollTester;
