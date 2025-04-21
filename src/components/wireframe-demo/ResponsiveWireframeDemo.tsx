
import React from 'react';
import { useWireframe } from '@/contexts/WireframeContext';
import { ResponsiveProvider } from '@/contexts/ResponsiveContext';
import { VisualStateProvider } from '@/contexts/VisualStateContext';
import ResponsiveComponent from '../wireframe/responsive/ResponsiveComponent';
import StatefulComponent from '../visual-states/StatefulComponent';
import VisualStateInspector from '../visual-states/VisualStateInspector';
import ScrollableAreaVisualization from '../wireframe/overflow/ScrollableAreaVisualization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatePreview from '../visual-states/StatePreview';
import { Button } from '@/components/ui/button';

/**
 * Integrated demo of responsive wireframing, visual states, and scrolling features
 */
const ResponsiveWireframeDemo: React.FC = () => {
  return (
    <ResponsiveProvider>
      <VisualStateProvider>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Wireframe Enhancement Demo</h1>
          
          <Tabs defaultValue="responsive">
            <TabsList className="mb-4">
              <TabsTrigger value="responsive">Responsive Behavior</TabsTrigger>
              <TabsTrigger value="states">Visual States</TabsTrigger>
              <TabsTrigger value="scrolling">Scrolling & Overflow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="responsive" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Responsive Component Behavior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Resize the containers below to see how components adapt:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Small container */}
                    <div className="border p-4 w-full h-80 resize-x overflow-auto bg-muted/20">
                      <p className="text-sm text-muted-foreground mb-2">Small Container:</p>
                      <ResponsiveComponent
                        stackOnMobile={true}
                        mobileClasses="flex-col space-y-3"
                        tabletClasses="grid grid-cols-2 gap-3"
                        desktopClasses="flex space-x-3"
                        debug={true}
                      >
                        <Button>Primary Action</Button>
                        <Button variant="outline">Secondary Action</Button>
                        <Button variant="ghost" className="hidden sm:block">Tertiary Action</Button>
                      </ResponsiveComponent>
                    </div>
                    
                    {/* Medium container */}
                    <div className="border p-4 w-full h-80 resize-x overflow-auto bg-muted/20">
                      <p className="text-sm text-muted-foreground mb-2">Medium Container:</p>
                      <ResponsiveComponent
                        mobileClasses="grid grid-cols-1 gap-4"
                        tabletClasses="grid grid-cols-2 gap-4"
                        desktopClasses="grid grid-cols-3 gap-4"
                        debug={true}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Feature 1</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>Responsive feature description that adapts to available space.</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Feature 2</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>Responsive feature description that adapts to available space.</p>
                          </CardContent>
                        </Card>
                        <Card className="hidden sm:block md:block">
                          <CardHeader>
                            <CardTitle className="text-lg">Feature 3</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>This card only appears on larger screens.</p>
                          </CardContent>
                        </Card>
                      </ResponsiveComponent>
                    </div>
                    
                    {/* Large container */}
                    <div className="border p-4 w-full h-80 resize-x overflow-auto bg-muted/20">
                      <p className="text-sm text-muted-foreground mb-2">Large Container:</p>
                      <ResponsiveComponent
                        mobileClasses="space-y-4"
                        tabletClasses="space-y-3"
                        desktopClasses="space-y-2"
                        debug={true}
                      >
                        <h2 className="text-2xl font-bold">Hero Section</h2>
                        <p>This content adapts its spacing based on container size.</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button>Get Started</Button>
                          <Button variant="outline">Learn More</Button>
                        </div>
                      </ResponsiveComponent>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="states" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visual States Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="col-span-1 lg:col-span-2">
                      <h3 className="text-lg font-medium mb-4">State Previews</h3>
                      <div className="space-y-8">
                        {/* Button state preview */}
                        <StatePreview
                          component={<Button className="w-40">Interactive Button</Button>}
                          defaultStyles="bg-primary text-white"
                          hoverStyles="bg-primary/90 shadow-md"
                          activeStyles="bg-primary/80 scale-95"
                          focusStyles="ring-2 ring-primary/30 ring-offset-2"
                          disabledStyles="bg-muted text-muted-foreground cursor-not-allowed"
                        />
                        
                        {/* Card state preview */}
                        <StatePreview
                          component={
                            <div className="w-64 p-4 rounded-lg border">
                              <h3 className="text-lg font-medium">Interactive Card</h3>
                              <p className="text-sm">This card responds to state changes.</p>
                            </div>
                          }
                          defaultStyles="bg-background"
                          hoverStyles="bg-muted/50 transform translate-y-[-4px] shadow-md"
                          activeStyles="bg-muted transform translate-y-[-2px] shadow-sm"
                          focusStyles="ring-2 ring-primary/30"
                          disabledStyles="bg-muted/20 text-muted-foreground"
                        />
                        
                        {/* Link state preview */}
                        <StatePreview
                          component={
                            <span className="text-primary underline cursor-pointer">Interactive Link</span>
                          }
                          defaultStyles=""
                          hoverStyles="text-primary/80"
                          activeStyles="text-primary/60"
                          focusStyles="outline-none ring-2 ring-primary/30 ring-offset-2"
                          disabledStyles="text-muted-foreground no-underline cursor-not-allowed"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">State Controls</h3>
                      <VisualStateInspector />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scrolling" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scrolling & Overflow Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Vertical scrolling */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Vertical Scrolling</h3>
                      <ScrollableAreaVisualization
                        height={300}
                        direction="vertical"
                        showScrollIndicators={true}
                        scrollTriggers={[
                          {
                            position: 30,
                            direction: 'vertical',
                            callback: () => console.log('30% scroll trigger activated')
                          },
                          {
                            position: 70,
                            direction: 'vertical',
                            callback: () => console.log('70% scroll trigger activated')
                          }
                        ]}
                      >
                        <div className="p-4 space-y-4">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="p-4 bg-muted rounded-md">
                              <h4 className="font-medium">Scroll Section {i + 1}</h4>
                              <p>Scroll to trigger effects. Check console for trigger logs.</p>
                            </div>
                          ))}
                        </div>
                      </ScrollableAreaVisualization>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Scroll triggers at 30% and 70% (see console)
                      </div>
                    </div>
                    
                    {/* Horizontal scrolling */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Horizontal Scrolling</h3>
                      <ScrollableAreaVisualization
                        height={300}
                        direction="horizontal"
                        showScrollIndicators={true}
                      >
                        <div className="p-4 flex space-x-4 h-full">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div 
                              key={i}
                              className="flex-shrink-0 w-64 p-4 bg-muted rounded-md flex flex-col justify-center"
                            >
                              <h4 className="font-medium">Horizontal Section {i + 1}</h4>
                              <p>Scroll horizontally to see more content.</p>
                            </div>
                          ))}
                        </div>
                      </ScrollableAreaVisualization>
                    </div>
                    
                    {/* Overflow behavior demo */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium mb-4">Overflow Behavior</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">overflow: visible</p>
                          <div className="w-full h-32 bg-muted/20 p-4 overflow-visible relative">
                            <div className="absolute bg-primary/20 p-4 rounded w-52">
                              This content intentionally overflows the container to demonstrate the visible overflow behavior.
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium">overflow: hidden</p>
                          <div className="w-full h-32 bg-muted/20 p-4 overflow-hidden relative">
                            <div className="absolute bg-primary/20 p-4 rounded w-52">
                              This content is hidden when it overflows the container boundaries.
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium">overflow: scroll</p>
                          <div className="w-full h-32 bg-muted/20 p-4 overflow-scroll relative">
                            <div className="bg-primary/20 p-4 rounded w-52 h-52">
                              This container has scrollbars to navigate overflowing content in both directions.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </VisualStateProvider>
    </ResponsiveProvider>
  );
};

export default ResponsiveWireframeDemo;
