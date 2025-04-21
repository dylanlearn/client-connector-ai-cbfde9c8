
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResponsive } from '@/hooks/use-responsive';
import ContainerQuery from './ContainerQuery';
import { Badge } from '@/components/ui/badge';

const ResponsiveShowcase = () => {
  const responsive = useResponsive();
  
  // Extract correct properties from responsive context
  const {
    currentBreakpoint,
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    viewportWidth,
    viewportHeight
  } = responsive;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Responsive Context Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Current Breakpoint</h4>
              <Badge variant="outline" className="text-xs">
                {currentBreakpoint}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Breakpoint Flags</h4>
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="text-xs w-24">Extra Small:</span>
                  <Badge variant={isExtraSmall ? "default" : "outline"} className="text-xs">
                    {isExtraSmall ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <span className="text-xs w-24">Small:</span>
                  <Badge variant={isSmall ? "default" : "outline"} className="text-xs">
                    {isSmall ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <span className="text-xs w-24">Medium:</span>
                  <Badge variant={isMedium ? "default" : "outline"} className="text-xs">
                    {isMedium ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <span className="text-xs w-24">Large:</span>
                  <Badge variant={isLarge ? "default" : "outline"} className="text-xs">
                    {isLarge ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <span className="text-xs w-24">Extra Large:</span>
                  <Badge variant={isExtraLarge ? "default" : "outline"} className="text-xs">
                    {isExtraLarge ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <h4 className="text-sm font-medium mb-2">Viewport Size</h4>
              <p className="text-xs text-muted-foreground">
                {viewportWidth}px × {viewportHeight}px
              </p>
            </div>
            
            <div className="col-span-2">
              <h4 className="text-sm font-medium mb-2">Container Query Demo</h4>
              <div className="border rounded-md resize-x overflow-auto min-w-[200px] max-w-[800px] p-1">
                <ContainerQuery 
                  condition="wide" 
                  fallback={
                    <div className="bg-red-100 p-4 flex items-center justify-center h-40 dark:bg-red-900/20">
                      <span className="text-sm font-medium">Narrow Container</span>
                    </div>
                  }
                  debug
                >
                  <div className="bg-green-100 p-4 flex items-center justify-center h-40 dark:bg-green-900/20">
                    <span className="text-sm font-medium">Wide Container (aspect ratio > 1.5)</span>
                  </div>
                </ContainerQuery>
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  ↔️ Resize this container to see the content change
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsiveShowcase;
