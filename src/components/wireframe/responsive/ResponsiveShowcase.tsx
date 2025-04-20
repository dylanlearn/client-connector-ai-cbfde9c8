
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveProvider, useResponsive } from '@/contexts/ResponsiveContext';
import { ResponsiveText } from './ResponsiveText';
import { ResponsiveComponent } from './ResponsiveComponent';
import { AdaptiveGrid } from './AdaptiveGrid';
import { ContainerQuery } from './ContainerQuery';
import { useResponsiveClasses } from '@/hooks/use-responsive-styles';

export function ViewportInformation() {
  const {
    viewportWidth,
    viewportHeight,
    currentBreakpoint,
    isDesktop,
    isTablet,
    isMobile,
    orientation,
    devicePixelRatio
  } = useResponsive();
  
  return (
    <div className="p-4 bg-muted/20 rounded-lg">
      <h3 className="font-medium text-lg mb-2">Viewport Information</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Width:</div>
        <div className="font-mono">{viewportWidth}px</div>
        
        <div>Height:</div>
        <div className="font-mono">{viewportHeight}px</div>
        
        <div>Breakpoint:</div>
        <div className="font-mono">{currentBreakpoint}</div>
        
        <div>Device:</div>
        <div className="font-mono">
          {isDesktop ? 'Desktop' : isTablet ? 'Tablet' : 'Mobile'}
        </div>
        
        <div>Orientation:</div>
        <div className="font-mono">{orientation}</div>
        
        <div>Pixel Ratio:</div>
        <div className="font-mono">{devicePixelRatio}x</div>
      </div>
    </div>
  );
}

function ResponsiveDemo() {
  const classes = useResponsiveClasses({
    'bg-blue-100': { base: false, md: true },
    'bg-green-100': { base: true, md: false },
    'p-2': { base: true },
    'p-4': { base: false, md: true },
    'rounded-md': true,
    'shadow': { base: false, lg: true }
  });
  
  return (
    <div className="space-y-8">
      <ViewportInformation />
      
      <Card>
        <CardHeader>
          <CardTitle>Responsive Text</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveText 
            as="h1"
            size={{ base: '2xl', md: '3xl', lg: '4xl' }}
            weight={{ base: 'normal', md: 'semibold' }}
            align={{ base: 'left', md: 'center' }}
            className="mb-4"
          >
            This text adapts to viewport size
          </ResponsiveText>
          
          <ResponsiveText className="text-muted-foreground">
            The heading above changes size, weight, and alignment based on viewport width.
            Try resizing your browser to see it in action.
          </ResponsiveText>
          
          <div className={classes + " mt-4"}>
            This box uses responsive classes that change at different breakpoints
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Adaptive Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <AdaptiveGrid
            baseColumns={1}
            smColumns={2}
            mdColumns={3}
            lgColumns={4}
            gap="md"
            className="mb-4"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-muted/30 p-4 rounded-md text-center">
                Item {i}
              </div>
            ))}
          </AdaptiveGrid>
          
          <ResponsiveText className="text-muted-foreground">
            The grid above adapts its column count based on available width.
            Try resizing your browser to see it change.
          </ResponsiveText>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Container Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 border border-dashed border-muted-foreground/30 p-4">
              <ContainerQuery 
                condition="narrow" 
                fallback={<div className="p-4 bg-muted/20 rounded">Wide container</div>}
              >
                <div className="p-4 bg-blue-100 rounded">Narrow container</div>
              </ContainerQuery>
            </div>
            
            <div className="w-full md:w-1/2 border border-dashed border-muted-foreground/30 p-4">
              <ContainerQuery condition="sm-and-up">
                <div className="p-4 bg-green-100 rounded">
                  Container width is SM or larger
                </div>
              </ContainerQuery>
            </div>
          </div>
          
          <ResponsiveText className="text-muted-foreground mt-4">
            Container queries respond to their container size, not the viewport.
            Try resizing your browser to see how they adapt independently.
          </ResponsiveText>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Responsive Component Behavior</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveComponent 
            stackOnMobile 
            className="gap-4"
            mobileClasses="bg-red-50 p-4 rounded-lg"
            tabletClasses="bg-yellow-50 p-6 rounded-lg"
            desktopClasses="bg-green-50 p-8 rounded-lg"
          >
            <div className="bg-white p-4 rounded shadow">Box 1</div>
            <div className="bg-white p-4 rounded shadow">Box 2</div>
            <div className="bg-white p-4 rounded shadow">Box 3</div>
          </ResponsiveComponent>
          
          <ResponsiveText className="text-muted-foreground mt-4">
            This component stack its children vertically on mobile and
            applies different styles at different breakpoints.
          </ResponsiveText>
        </CardContent>
      </Card>
    </div>
  );
}

export function ResponsiveShowcase() {
  return (
    <ResponsiveProvider>
      <div className="max-w-5xl mx-auto my-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Responsive Component Behavior System</h1>
        <p className="text-muted-foreground mb-8">
          This showcase demonstrates various responsive components that adapt to different viewport sizes.
          Try resizing your browser window to see how they respond.
        </p>
        
        <Tabs defaultValue="demo">
          <TabsList className="mb-4">
            <TabsTrigger value="demo">Demo</TabsTrigger>
            <TabsTrigger value="usage">Usage Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo">
            <ResponsiveDemo />
          </TabsContent>
          
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Usage Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">ResponsiveProvider</h3>
                  <p className="text-sm text-muted-foreground">
                    Wrap your application or component with the ResponsiveProvider to enable viewport-based responsiveness.
                  </p>
                  <pre className="bg-muted p-4 rounded-md text-xs mt-2">
                    {`<ResponsiveProvider>\n  <YourComponent />\n</ResponsiveProvider>`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">useResponsive()</h3>
                  <p className="text-sm text-muted-foreground">
                    Access viewport information and breakpoint data in any component.
                  </p>
                  <pre className="bg-muted p-4 rounded-md text-xs mt-2">
                    {`const { currentBreakpoint, isDesktop } = useResponsive();`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">ResponsiveText</h3>
                  <p className="text-sm text-muted-foreground">
                    Renders text that adapts its properties based on viewport size.
                  </p>
                  <pre className="bg-muted p-4 rounded-md text-xs mt-2">
                    {`<ResponsiveText\n  size={{ base: "lg", md: "xl", lg: "2xl" }}\n  weight={{ base: "normal", md: "bold" }}\n>\n  Responsive Text\n</ResponsiveText>`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">AdaptiveGrid</h3>
                  <p className="text-sm text-muted-foreground">
                    Creates a grid layout that changes column count based on container width.
                  </p>
                  <pre className="bg-muted p-4 rounded-md text-xs mt-2">
                    {`<AdaptiveGrid\n  baseColumns={1}\n  smColumns={2}\n  lgColumns={4}\n  gap="md"\n>\n  {items.map(item => (\n    <GridItem key={item.id} {...item} />\n  ))}\n</AdaptiveGrid>`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">ContainerQuery</h3>
                  <p className="text-sm text-muted-foreground">
                    Conditionally renders content based on container size.
                  </p>
                  <pre className="bg-muted p-4 rounded-md text-xs mt-2">
                    {`<ContainerQuery condition="md-and-up" fallback={<MobileView />}>\n  <DesktopView />\n</ContainerQuery>`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">useResponsiveStyles()</h3>
                  <p className="text-sm text-muted-foreground">
                    Compute responsive style objects based on current breakpoint.
                  </p>
                  <pre className="bg-muted p-4 rounded-md text-xs mt-2">
                    {`const styles = useResponsiveStyles({\n  padding: { base: '1rem', md: '2rem' },\n  fontSize: { base: '16px', lg: '18px' }\n});`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveProvider>
  );
}

export default ResponsiveShowcase;
