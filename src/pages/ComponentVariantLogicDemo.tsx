
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransitionControl } from '@/components/visual-states/TransitionControl';
import ContentAwareContainer from '@/components/layout/ContentAwareContainer';

const ComponentVariantLogicDemo = () => {
  const [transitionStyle, setTransitionStyle] = useState<React.CSSProperties>({});

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Component State & Layout Management</h1>
      
      <Tabs defaultValue="transitions">
        <TabsList>
          <TabsTrigger value="transitions">State Transitions</TabsTrigger>
          <TabsTrigger value="content-aware">Content-Aware Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="transitions" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <TransitionControl onTransitionChange={setTransitionStyle} />
            
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preview</h3>
                <div style={transitionStyle} className="space-y-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Button Example
                  </button>
                  
                  <div className="p-4 border rounded">
                    Card Example
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content-aware" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Resizable Container</h3>
              <ContentAwareContainer
                className="border rounded p-4 resize-x overflow-auto min-h-[200px]"
                preserveRatio={true}
                adaptiveFont={true}
              >
                <div className="space-y-4">
                  <h4 className="text-xl font-bold">Responsive Content</h4>
                  <p>
                    This content will automatically adjust to fit the available space
                    while maintaining readability and layout integrity.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-100 rounded">
                      Panel 1
                    </div>
                    <div className="p-4 bg-green-100 rounded">
                      Panel 2
                    </div>
                  </div>
                </div>
              </ContentAwareContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Fixed Container</h3>
              <ContentAwareContainer
                className="border rounded p-4"
                minHeight={200}
                maxHeight={400}
                preserveRatio={false}
                adaptiveFont={true}
              >
                <div className="space-y-4">
                  <h4 className="text-xl font-bold">Fixed Height Content</h4>
                  <p>
                    This content adapts differently within fixed height constraints
                    while still maintaining optimal viewing experience.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-2 bg-gray-100 rounded text-center">
                        Item {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </ContentAwareContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentVariantLogicDemo;
