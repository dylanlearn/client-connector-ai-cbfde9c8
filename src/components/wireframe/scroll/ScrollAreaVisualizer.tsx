
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ScrollIcon, MousePointerClick, ArrowUpDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ScrollAreaVisualizerProps {
  className?: string;
  defaultHeight?: number;
  defaultWidth?: number;
  showControls?: boolean;
}

const ScrollAreaVisualizer: React.FC<ScrollAreaVisualizerProps> = ({
  className,
  defaultHeight = 300,
  defaultWidth = '100%',
  showControls = true,
}) => {
  const [activeTab, setActiveTab] = useState<string>('vertical');
  const [areaHeight, setAreaHeight] = useState(defaultHeight);
  const [contentHeight, setContentHeight] = useState(defaultHeight * 2);
  const [showVisualizer, setShowVisualizer] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll trigger to demonstrate scroll-based effects
  const { triggered } = useScrollTrigger({
    target: containerRef,
    triggerPoint: 20,
    resetOnScrollBack: true,
  });
  
  // Effect to reset scroll position when changing tabs
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
    }
  }, [activeTab]);
  
  // Calculate scroll percentage for visualization
  const getScrollPercentage = () => {
    if (!containerRef.current) return 0;
    
    if (activeTab === 'vertical') {
      const scrollable = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      return (containerRef.current.scrollTop / scrollable) * 100;
    } else {
      const scrollable = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      return (containerRef.current.scrollLeft / scrollable) * 100;
    }
  };
  
  // Generate content for horizontal scrolling demo
  const renderHorizontalContent = () => {
    return (
      <div 
        className="flex items-center gap-4 p-4" 
        style={{ width: contentHeight * 2.5 }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-shrink-0 flex items-center justify-center rounded-lg bg-muted transition-all duration-300",
              triggered && i % 2 === 0 && "bg-primary/30"
            )}
            style={{ 
              width: 180, 
              height: areaHeight - 40,
              transform: triggered && i % 3 === 0 ? 'translateY(-10px)' : 'none'
            }}
          >
            <div className="text-center">
              <p className="font-medium">Card {i + 1}</p>
              <p className="text-xs text-muted-foreground">Scroll to see effects</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Generate content for vertical scrolling demo
  const renderVerticalContent = () => {
    return (
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg bg-muted p-4 transition-all duration-300",
              triggered && i % 2 === 0 && "bg-primary/20"
            )}
            style={{ 
              height: areaHeight / 2,
              transform: triggered && i % 3 === 0 ? 'scale(1.02)' : 'none',
              opacity: triggered && i === 2 ? 0.7 : 1
            }}
          >
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Section {i + 1}</h3>
              <p className="text-sm text-muted-foreground">
                Scroll down to see how this section responds to scroll events.
                Different sections can have different animations or effects.
              </p>
              {i === 0 && (
                <div className={cn(
                  "mt-4 px-4 py-2 bg-primary/10 rounded-md transition-all duration-500",
                  triggered && "bg-primary text-primary-foreground"
                )}>
                  This element changes when scrolled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Visual indicator for scroll position
  const ScrollIndicator = () => {
    const percent = getScrollPercentage();
    
    return (
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>Scroll position: {percent.toFixed(0)}%</span>
          <span>100%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-100" 
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <Card className={cn("scroll-area-visualizer", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Scroll Area Visualizer</CardTitle>
          {showControls && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-visualizer" 
                checked={showVisualizer} 
                onCheckedChange={setShowVisualizer}
              />
              <Label htmlFor="show-visualizer">Show Visualizer</Label>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="w-full">
            <TabsTrigger value="vertical" className="flex-1">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Vertical Scroll
            </TabsTrigger>
            <TabsTrigger value="horizontal" className="flex-1">
              <ScrollIcon className="mr-2 h-4 w-4 rotate-90" />
              Horizontal Scroll
            </TabsTrigger>
          </TabsList>
          
          {showControls && (
            <div className="my-4 space-y-4 p-4 border rounded-md bg-muted/30">
              <div className="space-y-2">
                <Label>Container Height: {areaHeight}px</Label>
                <Slider 
                  value={[areaHeight]} 
                  min={150} 
                  max={500} 
                  step={10} 
                  onValueChange={values => setAreaHeight(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Content Height: {contentHeight}px</Label>
                <Slider 
                  value={[contentHeight]} 
                  min={areaHeight} 
                  max={areaHeight * 3} 
                  step={50} 
                  onValueChange={values => setContentHeight(values[0])}
                />
              </div>
            </div>
          )}
          
          <div 
            className={cn(
              "relative border rounded-md overflow-hidden",
              showVisualizer && "mt-4"
            )}
          >
            <div
              ref={containerRef}
              className={cn(
                "overflow-auto scroll-smooth",
                activeTab === 'vertical' ? 'overflow-y-auto overflow-x-hidden' : 'overflow-x-auto overflow-y-hidden'
              )}
              style={{ 
                height: areaHeight, 
                width: defaultWidth
              }}
            >
              <TabsContent value="vertical" className="m-0 outline-none">
                {renderVerticalContent()}
              </TabsContent>
              
              <TabsContent value="horizontal" className="m-0 h-full outline-none">
                {renderHorizontalContent()}
              </TabsContent>
            </div>
            
            {showVisualizer && (
              <div className="absolute top-4 right-4 p-2 bg-background/90 rounded-md border shadow-sm">
                <MousePointerClick className="h-4 w-4 text-primary" />
              </div>
            )}
          </div>
          
          {showVisualizer && <ScrollIndicator />}
        </Tabs>
        
        <style>
          {`.scroll-area-visualizer .scroll-demo-item {
            transition: transform 0.3s ease-out, opacity 0.3s ease-out, background-color 0.3s ease-out;
          }`}
        </style>
      </CardContent>
    </Card>
  );
};

export default ScrollAreaVisualizer;
