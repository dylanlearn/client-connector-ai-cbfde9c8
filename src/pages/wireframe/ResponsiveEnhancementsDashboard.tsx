
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreakpointInheritanceProvider } from '@/components/wireframe/responsive/BreakpointInheritance';
import { ResponsiveProvider } from '@/contexts/ResponsiveContext';
import { VisualStateProvider } from '@/contexts/VisualStateContext';
import { ScrollIcon, Smartphone, Tablet, Monitor, SplitSquareVertical } from 'lucide-react';
import ScrollAreaVisualizer from '@/components/wireframe/scroll/ScrollAreaVisualizer';
import StatePreview from '@/components/visual-states/StatePreview';
import { StateTransitionPreview } from '@/components/visual-states/StateTransitionPreview';
import StatefulComponent from '@/components/visual-states/StatefulComponent';

/**
 * Dashboard showcasing responsive enhancements and visual state management
 */
const ResponsiveEnhancementsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('responsive');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Wireframe Enhancement System</h1>
      <p className="text-muted-foreground mb-6">
        Explore responsive behavior, visual states, and scrolling systems
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="responsive">
            <SplitSquareVertical className="mr-2 h-4 w-4" />
            Responsive System
          </TabsTrigger>
          <TabsTrigger value="states">
            <Tablet className="mr-2 h-4 w-4" />
            Visual States
          </TabsTrigger>
          <TabsTrigger value="scroll">
            <ScrollIcon className="mr-2 h-4 w-4" />
            Scroll Visualization
          </TabsTrigger>
        </TabsList>
        
        <ResponsiveProvider>
          <BreakpointInheritanceProvider>
            <VisualStateProvider>
              <TabsContent value="responsive" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Responsive Behavior System</CardTitle>
                    <CardDescription>
                      View how components adapt across different screen sizes with inheritance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Device Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4 justify-around">
                          <div className="text-center">
                            <Smartphone className="mx-auto h-8 w-8 text-primary" />
                            <span className="text-xs font-medium">Mobile</span>
                          </div>
                          <div className="text-center">
                            <Tablet className="mx-auto h-8 w-8 text-primary" />
                            <span className="text-xs font-medium">Tablet</span>
                          </div>
                          <div className="text-center">
                            <Monitor className="mx-auto h-8 w-8 text-primary" />
                            <span className="text-xs font-medium">Desktop</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Breakpoint Inheritance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Properties cascade from smaller to larger breakpoints unless overridden
                          </p>
                          <div className="mt-2 flex gap-2">
                            <div className="p-2 bg-primary/10 text-xs rounded">xs → sm → md</div>
                            <div className="p-2 bg-primary/10 text-xs rounded">md → lg → xl</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Responsive Component Demo</CardTitle>
                      </CardHeader>
                      <CardContent className="border rounded-md p-4">
                        <div className="p-4 bg-muted rounded-md">
                          <p className="text-center text-sm">
                            This component adapts to screen size.
                            Resize your browser window to see changes.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="states" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Visual States System</CardTitle>
                    <CardDescription>
                      Preview and test different component states and transitions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <StatePreview
                          component={<button className="px-4 py-2 w-full">Button Example</button>}
                          defaultStyles="bg-primary text-primary-foreground rounded"
                          hoverStyles="bg-primary/90"
                          activeStyles="bg-primary/80"
                          focusStyles="ring-2 ring-primary ring-offset-2 outline-none"
                          disabledStyles="bg-muted text-muted-foreground cursor-not-allowed"
                          showAllStates={true}
                        />
                        
                        <StatePreview
                          component={<div className="w-full p-3 text-center">Card Component</div>}
                          defaultStyles="bg-card border rounded shadow-sm"
                          hoverStyles="shadow-md"
                          activeStyles="bg-muted"
                          focusStyles="ring-2 ring-primary/30 outline-none"
                          disabledStyles="opacity-50 bg-muted"
                        />
                      </div>
                      
                      <StateTransitionPreview />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="scroll" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scroll Visualization System</CardTitle>
                    <CardDescription>
                      Test and visualize scrollable areas and scroll-triggered effects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollAreaVisualizer />
                  </CardContent>
                </Card>
              </TabsContent>
            </VisualStateProvider>
          </BreakpointInheritanceProvider>
        </ResponsiveProvider>
      </Tabs>
    </div>
  );
};

export default ResponsiveEnhancementsDashboard;
