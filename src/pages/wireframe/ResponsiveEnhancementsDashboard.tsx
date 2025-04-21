
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreakpointInheritanceProvider } from '@/components/wireframe/responsive/BreakpointInheritance';
import ResponsivePreviewTool from '@/components/wireframe/responsive/ResponsivePreviewTool';
import BreakpointDebugger from '@/components/wireframe/responsive/BreakpointDebugger';
import StatePreviewSystem from '@/components/visual-states/StatePreviewSystem';
import BatchStateManager from '@/components/visual-states/BatchStateManager';
import { StatefulComponent } from '@/components/visual-states/StatefulComponent';
import ScrollAreaVisualizer from '@/components/wireframe/scroll/ScrollAreaVisualizer';
import InteractiveScrollTester from '@/components/wireframe/scroll/InteractiveScrollTester';
import OverflowBehaviorDemo from '@/components/wireframe/scroll/OverflowBehaviorDemo';
import ScrollTriggerEffect from '@/components/wireframe/scroll/ScrollTriggerEffect';
import { VisualStateProvider } from '@/contexts/VisualStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout, Smartphone, Palette, Box, ScrollText } from 'lucide-react';

/**
 * Dashboard showcasing all the new responsive wireframe enhancements
 */
export const ResponsiveEnhancementsDashboard = () => {
  // Sample stateful button for demonstration
  const StatefulButton = () => (
    <StatefulComponent
      defaultStyles="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all px-4 py-2 rounded text-white"
      hoverStyles="bg-blue-600"
      activeStyles="bg-blue-700 transform scale-95"
      focusStyles="ring-2 ring-blue-500 ring-opacity-50"
      disabledStyles="bg-gray-400 cursor-not-allowed"
    >
      Interactive Button
    </StatefulComponent>
  );
  
  // Sample responsive component for demonstration
  const SampleResponsiveComponent = () => (
    <div className="border p-4 rounded-md">
      <h3 className="text-lg font-medium mb-2">Responsive Component</h3>
      <div className="md:flex md:gap-4 space-y-2 md:space-y-0">
        <div className="bg-blue-100 p-4 rounded">Box 1</div>
        <div className="bg-green-100 p-4 rounded">Box 2</div>
        <div className="bg-yellow-100 p-4 rounded">Box 3</div>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        This component changes layout based on screen size.
      </p>
    </div>
  );
  
  return (
    <BreakpointInheritanceProvider>
      <VisualStateProvider>
        <div className="responsive-enhancements-dashboard p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Wireframe Enhancements Dashboard</h1>
            <Badge variant="outline" className="text-sm">
              Developer Preview
            </Badge>
          </div>
          
          <Tabs defaultValue="responsive" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="responsive" className="flex gap-2">
                <Layout size={16} />
                Responsive System
              </TabsTrigger>
              <TabsTrigger value="states" className="flex gap-2">
                <Palette size={16} />
                Visual States
              </TabsTrigger>
              <TabsTrigger value="scroll" className="flex gap-2">
                <ScrollText size={16} />
                Scroll & Overflow
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="responsive" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone size={18} />
                      Responsive Preview Tool
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsivePreviewTool
                      properties={{
                        layout: {
                          base: 'flex-col',
                          md: 'flex-row',
                          lg: 'flex-row flex-wrap'
                        },
                        gap: {
                          base: '0.5rem',
                          md: '1rem',
                          lg: '1.5rem'
                        }
                      }}
                    >
                      <SampleResponsiveComponent />
                    </ResponsivePreviewTool>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Breakpoint Inheritance System</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      The breakpoint inheritance system allows responsive properties to cascade down through breakpoints.
                      Resize the browser window to see how values are inherited based on the current breakpoint.
                    </p>
                    
                    <BreakpointDebugger
                      properties={{
                        padding: {
                          base: '1rem',
                          md: '1.5rem',
                          lg: '2rem'
                        },
                        columns: {
                          base: 1,
                          sm: 2,
                          lg: 4
                        },
                        fontSize: {
                          base: '14px',
                          md: '16px',
                          xl: '18px'
                        }
                      }}
                      showDetails={true}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="states" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>State Preview System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StatePreviewSystem>
                      <StatefulButton />
                    </StatePreviewSystem>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Batch State Manager</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BatchStateManager />
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Visual State Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {['default', 'hover', 'active', 'focus', 'disabled'].map((state) => (
                        <StatefulComponent 
                          key={state} 
                          forceState={state as any}
                          className="border rounded-md p-4"
                        >
                          <div className="text-center">
                            <div className="mb-2">
                              <StatefulButton />
                            </div>
                            <Badge variant="secondary">
                              {state}
                            </Badge>
                          </div>
                        </StatefulComponent>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="scroll" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scroll Area Visualization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollAreaVisualizer
                      height={300}
                      showControls={true}
                      highlightScrollbars={true}
                      showScrollPosition={true}
                    >
                      <div className="p-4 space-y-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="border p-4 rounded-md">
                            <h3 className="font-medium">Scroll Item {i + 1}</h3>
                            <p className="text-sm text-gray-600">
                              This is scrollable content to demonstrate the scroll area visualizer.
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollAreaVisualizer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Overflow Behavior Demo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OverflowBehaviorDemo />
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Interactive Scroll Tester</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InteractiveScrollTester />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </VisualStateProvider>
    </BreakpointInheritanceProvider>
  );
};

export default ResponsiveEnhancementsDashboard;
