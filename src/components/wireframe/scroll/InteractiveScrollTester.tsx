
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import ScrollAreaVisualizer from './ScrollAreaVisualizer';
import ScrollTriggerEffect from './ScrollTriggerEffect';

interface InteractiveScrollTesterProps {
  title?: string;
}

const InteractiveScrollTester: React.FC<InteractiveScrollTesterProps> = ({ 
  title = "Interactive Scroll Testing" 
}) => {
  const [scrollHeight, setScrollHeight] = useState(400);
  const [showScrollbarHighlights, setShowScrollbarHighlights] = useState(true);
  const [showScrollPosition, setShowScrollPosition] = useState(true);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visualization">
          <TabsList className="mb-4">
            <TabsTrigger value="visualization">Scrollbars Visualization</TabsTrigger>
            <TabsTrigger value="triggers">Scroll Triggers</TabsTrigger>
            <TabsTrigger value="metrics">Scroll Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization">
            <div className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-scrollbars"
                    checked={showScrollbarHighlights}
                    onChange={(e) => setShowScrollbarHighlights(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="show-scrollbars" className="text-sm">Show Scrollbar Indicators</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-position"
                    checked={showScrollPosition}
                    onChange={(e) => setShowScrollPosition(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="show-position" className="text-sm">Show Scroll Position</label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Container Height: {scrollHeight}px</label>
                <Slider
                  min={200}
                  max={600}
                  step={50}
                  value={[scrollHeight]}
                  onValueChange={(value) => setScrollHeight(value[0])}
                />
              </div>
              
              <ScrollAreaVisualizer
                height={scrollHeight}
                width="100%"
                showControls={true}
                highlightScrollbars={showScrollbarHighlights}
                showScrollPosition={showScrollPosition}
              >
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-medium">Scroll Area Contents</h3>
                  <p>This is a custom scrollable area with scroll visualization.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="p-4 border rounded-md bg-white shadow-sm">
                        <h4 className="font-medium">Item {i + 1}</h4>
                        <p className="text-sm text-gray-500">
                          Content for item {i + 1}. This is a card inside the scrollable area.
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                    <h4 className="font-medium text-blue-700">Scroll notification</h4>
                    <p className="text-sm text-blue-600">
                      You've scrolled to see this special notification!
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={`bottom-${i}`} className="p-4 border rounded-md bg-white shadow-sm">
                        <h4 className="font-medium">Bottom Item {i + 1}</h4>
                        <p className="text-sm text-gray-500">
                          Content at the bottom of the scroll area.
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                    <h4 className="font-medium text-green-700">Bottom reached!</h4>
                    <p className="text-sm text-green-600">
                      You've scrolled all the way to the bottom!
                    </p>
                  </div>
                </div>
              </ScrollAreaVisualizer>
            </div>
          </TabsContent>
          
          <TabsContent value="triggers">
            <ScrollTriggerEffect
              height={500}
              triggers={[
                { position: 20, label: 'Header' },
                { position: 40, label: 'Content' },
                { position: 60, label: 'Features' },
                { position: 80, label: 'Footer' }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="metrics">
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="text-base font-medium mb-2">Scroll Performance Metrics</h3>
                <p className="text-sm text-muted-foreground">
                  This tab would display scroll performance metrics like frame rate, jank detection, 
                  and smooth scrolling analytics for optimizing scrolling experiences.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Scroll Jank Detection</h4>
                  <div className="h-[150px] bg-slate-50 rounded flex items-center justify-center">
                    <p className="text-sm text-muted-foreground text-center">
                      Jank measurement visualization<br />
                      (Placeholder for metrics)
                    </p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Frame Rate Analysis</h4>
                  <div className="h-[150px] bg-slate-50 rounded flex items-center justify-center">
                    <p className="text-sm text-muted-foreground text-center">
                      Frame rate during scrolling<br />
                      (Placeholder for metrics)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InteractiveScrollTester;
