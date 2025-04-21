
import React, { useState } from 'react';
import { useBreakpointInheritance, BreakpointValues } from './BreakpointInheritance';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { Expand, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BreakpointDebuggerProps {
  className?: string;
  showDetails?: boolean;
  properties?: Record<string, BreakpointValues<any>>;
}

/**
 * A component that visualizes the current breakpoint and inheritance system
 * Displays the active values and inheritance chain for debugging
 */
export const BreakpointDebugger: React.FC<BreakpointDebuggerProps> = ({ 
  className,
  showDetails = false,
  properties = {} 
}) => {
  const { resolveValue, getCurrentBreakpoint, getBreakpointOrder, getAllInheritedValues } = useBreakpointInheritance();
  const { viewportWidth, viewportHeight } = useResponsive();
  const [expanded, setExpanded] = useState(showDetails);
  
  const currentBreakpoint = getCurrentBreakpoint();
  const breakpointOrder = getBreakpointOrder();
  
  // Create a sample responsive value for demonstration
  const sampleProperty: BreakpointValues<string> = {
    base: 'flex-col',
    md: 'flex-row',
    lg: 'flex-row justify-between',
  };
  
  // Combine sample and provided properties
  const allProperties = {
    flexDirection: sampleProperty,
    ...properties
  };
  
  // Get color for current breakpoint
  const getBreakpointColor = (breakpoint: string): string => {
    switch (breakpoint) {
      case 'xs': return 'bg-red-500';
      case 'sm': return 'bg-orange-500';
      case 'md': return 'bg-yellow-500';
      case 'lg': return 'bg-green-500';
      case 'xl': return 'bg-blue-500';
      case '2xl': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className={cn("breakpoint-debugger border rounded-lg shadow-sm bg-white dark:bg-gray-900", className)}>
      <div className="p-3 flex justify-between items-center">
        <div>
          <Badge className={cn("px-2 py-1 text-sm", getBreakpointColor(currentBreakpoint))}>
            {currentBreakpoint}
          </Badge>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {viewportWidth}×{viewportHeight}px
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)} 
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
        >
          {expanded ? <ChevronDown size={16} /> : <Expand size={16} />}
        </Button>
      </div>
      
      {expanded && (
        <Card className="border-t rounded-t-none">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-sm font-medium">Breakpoint Inheritance</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <Tabs defaultValue="inheritance">
              <TabsList className="mb-2">
                <TabsTrigger value="inheritance">Inheritance Chain</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inheritance">
                <div className="text-xs space-y-1">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    <div className="font-medium">Property</div>
                    {breakpointOrder.map(bp => (
                      <div key={bp} className={cn("font-medium", currentBreakpoint === bp ? "text-primary" : "")}>
                        {bp}
                      </div>
                    ))}
                  </div>
                  
                  {Object.entries(allProperties).map(([name, values]) => {
                    const inheritedValues = getAllInheritedValues(values);
                    return (
                      <div key={name} className="grid grid-cols-7 gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded">
                        <div className="font-medium truncate">{name}</div>
                        {breakpointOrder.map(bp => (
                          <div 
                            key={bp} 
                            className={cn(
                              "truncate", 
                              currentBreakpoint === bp ? "font-medium text-primary" : "",
                              values[bp] !== undefined ? "italic" : ""
                            )}
                            title={String(inheritedValues[bp])}
                          >
                            {String(inheritedValues[bp]).substring(0, 10)}
                            {String(inheritedValues[bp]).length > 10 ? '...' : ''}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="properties">
                <div className="text-xs space-y-2">
                  {Object.entries(allProperties).map(([name, values]) => {
                    const currentValue = resolveValue(values);
                    return (
                      <div key={name} className="hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded">
                        <div className="font-medium">{name}</div>
                        <div className="flex gap-2 flex-wrap">
                          {Object.entries(values).map(([bp, val]) => (
                            <Badge 
                              key={bp} 
                              variant={bp === 'base' ? "outline" : "secondary"}
                              className={cn(
                                "text-xs", 
                                bp === currentBreakpoint || (bp === 'base' && currentValue === val) ? "ring-1 ring-primary" : ""
                              )}
                            >
                              {bp}: {String(val).substring(0, 15)}
                              {String(val).length > 15 ? '...' : ''}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BreakpointDebugger;
