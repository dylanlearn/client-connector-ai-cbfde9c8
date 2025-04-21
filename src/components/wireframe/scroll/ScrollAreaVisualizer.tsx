
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface ScrollAreaVisualizerProps {
  children: ReactNode;
  width?: string | number;
  height?: number;
  showControls?: boolean;
  showScrollPosition?: boolean;
  highlightScrollbars?: boolean;
}

const ScrollAreaVisualizer: React.FC<ScrollAreaVisualizerProps> = ({
  children,
  width = "100%",
  height = 300,
  showControls = false,
  showScrollPosition = false,
  highlightScrollbars = false
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [scrollbarHighlight, setScrollbarHighlight] = useState(highlightScrollbars);
  
  // Track scroll position
  useEffect(() => {
    if (!scrollAreaRef.current) return;
    
    const scrollable = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
    if (!scrollable) return;
    
    const content = scrollable.firstElementChild as HTMLElement;
    if (!content) return;
    
    const handleScroll = () => {
      setScrollX(scrollable.scrollLeft);
      setScrollY(scrollable.scrollTop);
    };
    
    // Get content dimensions
    const updateDimensions = () => {
      setContentHeight(content.scrollHeight);
      setContentWidth(content.scrollWidth);
      setViewportHeight(scrollable.clientHeight);
      setViewportWidth(scrollable.clientWidth);
    };
    
    updateDimensions();
    
    scrollable.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateDimensions);
    
    // Observe content changes
    const observer = new MutationObserver(updateDimensions);
    observer.observe(content, { childList: true, subtree: true });
    
    return () => {
      scrollable.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateDimensions);
      observer.disconnect();
    };
  }, []);
  
  // Handle programmatic scroll
  const scrollTo = (x: number, y: number) => {
    if (!scrollAreaRef.current) return;
    
    const scrollable = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
    if (!scrollable) return;
    
    scrollable.scrollTo(x, y);
  };
  
  return (
    <div className="space-y-4">
      <div 
        ref={scrollAreaRef}
        className="rounded-lg border bg-card"
        style={{ width }}
      >
        <ScrollArea 
          className={cn(
            "h-[--height]", 
            scrollbarHighlight ? "scroll-highlight" : ""
          )}
          style={{ 
            '--height': typeof height === 'number' ? `${height}px` : height,
          } as React.CSSProperties}
        >
          {children}
        </ScrollArea>
      </div>
      
      {showScrollPosition && (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Scroll Position: X: {Math.round(scrollX)}, Y: {Math.round(scrollY)}</p>
          <p>Content Size: {contentWidth}×{contentHeight}, Viewport: {viewportWidth}×{viewportHeight}</p>
        </div>
      )}
      
      {showControls && (
        <Card className="p-4 space-y-6">
          <div className="space-y-1">
            <Label htmlFor="y-scroll">Vertical Scroll ({Math.round(scrollY)}px)</Label>
            <Slider 
              id="y-scroll"
              min={0} 
              max={Math.max(0, contentHeight - viewportHeight)} 
              step={1}
              value={[scrollY]}
              onValueChange={(value) => scrollTo(scrollX, value[0])}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="x-scroll">Horizontal Scroll ({Math.round(scrollX)}px)</Label>
            <Slider 
              id="x-scroll"
              min={0} 
              max={Math.max(0, contentWidth - viewportWidth)} 
              step={1}
              value={[scrollX]}
              onValueChange={(value) => scrollTo(value[0], scrollY)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="highlight-scrollbar">Highlight Scrollbars</Label>
            <Switch 
              id="highlight-scrollbar"
              checked={scrollbarHighlight}
              onCheckedChange={setScrollbarHighlight}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ScrollAreaVisualizer;
