import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollAreaVisualizer } from './';
import { ScrollTriggerEffect } from './';

interface InteractiveScrollTesterProps {
  title?: string;
}

const InteractiveScrollTester: React.FC<InteractiveScrollTesterProps> = ({ title = "Interactive Scroll Tester" }) => {
  const [activeTab, setActiveTab] = useState<string>("scroll-area");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="scroll-area">Scroll Area</TabsTrigger>
            <TabsTrigger value="scroll-trigger">Scroll Trigger</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scroll-area">
            <ScrollAreaVisualizer height={300} width="100%" showControls showScrollPosition highlightScrollbars>
              {/* Content inside the scrollable area */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Scrollable Content</h3>
                <p className="text-sm text-muted-foreground">
                  This is an example of scrollable content within the ScrollAreaVisualizer.
                  You can place any content here to test the scroll behavior.
                </p>
                <div style={{ height: '600px' }}>
                  {/* Spacer to make content scrollable */}
                </div>
              </div>
            </ScrollAreaVisualizer>
          </TabsContent>
          
          <TabsContent value="scroll-trigger">
            <ScrollTriggerEffect />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InteractiveScrollTester;
