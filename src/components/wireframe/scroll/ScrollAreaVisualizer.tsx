
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';
import { cn } from '@/lib/utils';

export interface ScrollAreaVisualizerProps {
  width?: string | number;
  height?: number;
  showControls?: boolean;
  highlightScrollbars?: boolean;
  showScrollPosition?: boolean;
  children?: ReactNode; // Add children prop
  className?: string;
  contentHeight?: number;
  contentWidth?: number;
  initialScrollPosition?: { x: number; y: number };
}

const ScrollAreaVisualizer: React.FC<ScrollAreaVisualizerProps> = ({
  width = '100%',
  height = 300,
  showControls = true,
  highlightScrollbars = true,
  showScrollPosition = true,
  children,
  className,
  contentHeight = 600,
  contentWidth,
  initialScrollPosition = { x: 0, y: 0 },
}) => {
  const [scrollPosition, setScrollPosition] = useState(initialScrollPosition);
  const scrollableRef = useRef<HTMLDivElement>(null);
  
  // Track if we've reached various scroll thresholds
  const { triggered: reachedMidpoint } = useScrollTrigger({
    target: scrollableRef,
    triggerPoint: 50,
    resetOnScrollBack: true,
  });
  
  const { triggered: reachedBottom } = useScrollTrigger({
    target: scrollableRef,
    triggerPoint: 90,
    resetOnScrollBack: true,
  });
  
  // Handle scroll event
  const handleScroll = () => {
    if (!scrollableRef.current) return;
    
    const element = scrollableRef.current;
    const maxScrollHeight = element.scrollHeight - element.clientHeight;
    const maxScrollWidth = element.scrollWidth - element.clientWidth;
    
    const scrollPercent = {
      x: maxScrollWidth ? Math.round((element.scrollLeft / maxScrollWidth) * 100) : 0,
      y: maxScrollHeight ? Math.round((element.scrollTop / maxScrollHeight) * 100) : 0,
    };
    
    setScrollPosition({
      x: element.scrollLeft,
      y: element.scrollTop,
    });
  };
  
  // Scroll to specific position using the slider
  const scrollToPosition = (value: number[]) => {
    if (!scrollableRef.current) return;
    
    const element = scrollableRef.current;
    const maxScrollHeight = element.scrollHeight - element.clientHeight;
    const targetPosition = Math.round((value[0] / 100) * maxScrollHeight);
    
    element.scrollTop = targetPosition;
  };
  
  // Force scroll to certain positions
  const scrollToTop = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = 0;
    }
  };
  
  const scrollToMiddle = () => {
    if (scrollableRef.current) {
      const maxScroll = scrollableRef.current.scrollHeight - scrollableRef.current.clientHeight;
      scrollableRef.current.scrollTop = maxScroll / 2;
    }
  };
  
  const scrollToBottom = () => {
    if (scrollableRef.current) {
      const maxScroll = scrollableRef.current.scrollHeight - scrollableRef.current.clientHeight;
      scrollableRef.current.scrollTop = maxScroll;
    }
  };
  
  // Calculate the percentage scrolled
  const scrollPercentage = scrollableRef.current
    ? Math.min(
        100,
        Math.round(
          (scrollPosition.y /
            (scrollableRef.current.scrollHeight - scrollableRef.current.clientHeight)) *
            100
        )
      )
    : 0;
  
  // Default content if no children provided
  const defaultContent = (
    <div
      style={{
        height: contentHeight,
        width: contentWidth || '100%',
        padding: '1rem',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
      }}
    >
      <h3 className="text-lg font-medium mb-4">Scrollable Content</h3>
      
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'p-4 rounded-md transition-colors duration-200',
              i % 3 === 0 ? 'bg-blue-100' : i % 3 === 1 ? 'bg-green-100' : 'bg-amber-100'
            )}
          >
            <h4 className="font-medium">Section {i + 1}</h4>
            <p className="text-sm text-gray-600">
              Scroll to explore this content section. This area demonstrates how content
              overflow and scrolling behavior works in the wireframe.
            </p>
          </div>
        ))}
      </div>
      
      <div
        className={cn(
          'p-4 mt-8 rounded-md bg-indigo-100 transition-opacity duration-500',
          reachedBottom ? 'opacity-100' : 'opacity-50'
        )}
      >
        <h4 className="font-medium">Bottom Trigger Zone</h4>
        <p className="text-sm">
          You've scrolled to the bottom of the content! This element appears at full opacity
          when you reach the bottom.
        </p>
      </div>
    </div>
  );
  
  return (
    <div className={cn('scroll-visualizer flex flex-col', className)}>
      {showControls && (
        <div className="controls pb-4 space-y-2">
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={scrollToTop}>
              Top
            </Button>
            <Button size="sm" onClick={scrollToMiddle}>
              Middle
            </Button>
            <Button size="sm" onClick={scrollToBottom}>
              Bottom
            </Button>
            <Toggle
              aria-label="Highlight scrollbars"
              pressed={highlightScrollbars}
            >
              Highlight
            </Toggle>
          </div>
          
          {showScrollPosition && (
            <div className="flex items-center gap-4 text-sm">
              <div>Scroll: {scrollPercentage}%</div>
              <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                value={[scrollPercentage]}
                onValueChange={scrollToPosition}
                className="w-[60%]"
              />
            </div>
          )}
        </div>
      )}
      
      <Card
        className="overflow-hidden border border-border"
        style={{ width, height }}
      >
        <ScrollArea
          className={cn(
            'h-full w-full',
            highlightScrollbars && 'highlight-scrollbars'
          )}
        >
          <div
            ref={scrollableRef}
            className="h-full w-full overflow-auto"
            onScroll={handleScroll}
          >
            {children || defaultContent}
          </div>
        </ScrollArea>
      </Card>
      
      {reachedMidpoint && (
        <div className="mt-2 text-xs text-muted-foreground">
          Scroll trigger: Midpoint reached
        </div>
      )}
      {reachedBottom && (
        <div className="mt-2 text-xs text-muted-foreground">
          Scroll trigger: Bottom reached
        </div>
      )}
      
      {/* Add CSS styling for highlighted scrollbars */}
      <style>
        {`
          .highlight-scrollbars ::-webkit-scrollbar {
            width: 14px;
            height: 14px;
          }
          
          .highlight-scrollbars ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 7px;
          }
          
          .highlight-scrollbars ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 7px;
            border: 3px solid rgba(0, 0, 0, 0);
            background-clip: padding-box;
          }
          
          .highlight-scrollbars ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 7px;
            border: 3px solid rgba(0, 0, 0, 0);
            background-clip: padding-box;
          }
        `}
      </style>
    </div>
  );
};

export default ScrollAreaVisualizer;
