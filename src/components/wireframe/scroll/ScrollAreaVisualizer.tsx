
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownUp, ArrowLeftRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Spinner from '@/components/ui/spinner';

interface ScrollAreaVisualizerProps {
  children: React.ReactNode;
  className?: string;
  height?: number | string;
  width?: number | string;
  showControls?: boolean;
  highlightScrollbars?: boolean;
  showScrollPosition?: boolean;
  horizontalScroll?: boolean;
  verticalScroll?: boolean;
}

/**
 * A component for visualizing scrollable areas with debugging tools
 */
export const ScrollAreaVisualizer: React.FC<ScrollAreaVisualizerProps> = ({
  children,
  className,
  height = 300,
  width = '100%',
  showControls = true,
  highlightScrollbars = true,
  showScrollPosition = true,
  horizontalScroll = true,
  verticalScroll = true
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollInfo, setScrollInfo] = useState({
    scrollTop: 0,
    scrollLeft: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    clientHeight: 0,
    clientWidth: 0,
    verticalPercentage: 0,
    horizontalPercentage: 0,
    hasVerticalScroll: false,
    hasHorizontalScroll: false
  });
  
  // Update scroll info when content scrolls
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const {
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth
    } = containerRef.current;
    
    const verticalPercentage = Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100 || 0);
    const horizontalPercentage = Math.min(100, (scrollLeft / (scrollWidth - clientWidth)) * 100 || 0);
    const hasVerticalScroll = scrollHeight > clientHeight;
    const hasHorizontalScroll = scrollWidth > clientWidth;
    
    setScrollInfo({
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
      verticalPercentage,
      horizontalPercentage,
      hasVerticalScroll,
      hasHorizontalScroll
    });
  };
  
  // Update scroll position with slider
  const handleVerticalSliderChange = ([value]: number[]) => {
    if (!containerRef.current) return;
    
    const { scrollHeight, clientHeight } = containerRef.current;
    const newScrollTop = ((scrollHeight - clientHeight) * value) / 100;
    containerRef.current.scrollTop = newScrollTop;
  };
  
  const handleHorizontalSliderChange = ([value]: number[]) => {
    if (!containerRef.current) return;
    
    const { scrollWidth, clientWidth } = containerRef.current;
    const newScrollLeft = ((scrollWidth - clientWidth) * value) / 100;
    containerRef.current.scrollLeft = newScrollLeft;
  };
  
  // Set up the scroll event listener
  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;
    
    containerElement.addEventListener('scroll', handleScroll);
    
    // Initial scroll info update
    setTimeout(() => {
      setIsLoading(false);
      handleScroll();
    }, 100);
    
    return () => {
      containerElement.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Create scroll indicators
  const renderScrollIndicators = () => (
    <div className={cn("scroll-indicators flex items-center gap-4", !showScrollPosition && "hidden")}>
      <div className="flex flex-col gap-1 text-xs">
        <div className={cn(
          "flex items-center",
          !scrollInfo.hasVerticalScroll && "opacity-50"
        )}>
          <ArrowDownUp size={12} className="mr-1" />
          <span className="font-mono">
            {Math.round(scrollInfo.verticalPercentage)}%
          </span>
        </div>
        <div className={cn(
          "flex items-center", 
          !scrollInfo.hasHorizontalScroll && "opacity-50"
        )}>
          <ArrowLeftRight size={12} className="mr-1" />
          <span className="font-mono">
            {Math.round(scrollInfo.horizontalPercentage)}%
          </span>
        </div>
      </div>
      
      <div className="flex-1 text-xs whitespace-nowrap overflow-hidden overflow-ellipsis">
        {scrollInfo.scrollHeight}×{scrollInfo.scrollWidth}px
      </div>
    </div>
  );
  
  // Render scroll controls
  const renderScrollControls = () => (
    <div className={cn("scroll-controls mt-3", !showControls && "hidden")}>
      <Tabs defaultValue="vertical">
        <TabsList className="w-full">
          <TabsTrigger 
            value="vertical" 
            className="flex-1"
            disabled={!scrollInfo.hasVerticalScroll}
          >
            <ArrowDownUp size={12} className="mr-1" />
            Vertical
          </TabsTrigger>
          <TabsTrigger 
            value="horizontal" 
            className="flex-1"
            disabled={!scrollInfo.hasHorizontalScroll}
          >
            <ArrowLeftRight size={12} className="mr-1" />
            Horizontal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vertical" className="pt-3">
          <div className="flex items-center gap-2">
            <div className="w-8 text-xs font-mono text-right">
              {Math.round(scrollInfo.verticalPercentage)}%
            </div>
            <Slider
              value={[scrollInfo.verticalPercentage]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVerticalSliderChange}
              disabled={!scrollInfo.hasVerticalScroll}
            />
            <div className="text-xs font-mono w-12">
              {scrollInfo.scrollTop}/{scrollInfo.scrollHeight - scrollInfo.clientHeight}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="horizontal" className="pt-3">
          <div className="flex items-center gap-2">
            <div className="w-8 text-xs font-mono text-right">
              {Math.round(scrollInfo.horizontalPercentage)}%
            </div>
            <Slider
              value={[scrollInfo.horizontalPercentage]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleHorizontalSliderChange}
              disabled={!scrollInfo.hasHorizontalScroll}
            />
            <div className="text-xs font-mono w-12">
              {scrollInfo.scrollLeft}/{scrollInfo.scrollWidth - scrollInfo.clientWidth}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  return (
    <div className={cn("scroll-area-visualizer", className)}>
      {showScrollPosition && renderScrollIndicators()}
      
      {/* Scroll Container */}
      <div 
        className={cn(
          "scroll-container relative border rounded overflow-auto",
          highlightScrollbars && "scrollbar-debug"
        )}
        style={{ 
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width
        }}
        ref={containerRef}
      >
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Spinner size="md" />
          </div>
        )}
        
        {/* Scroll debug boundaries */}
        <div className="relative">
          {highlightScrollbars && (
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-primary/20 z-10" />
          )}
          
          {/* Content */}
          <div ref={contentRef}>
            {children}
          </div>
        </div>
      </div>
      
      {showControls && renderScrollControls()}
      
      <style jsx>{`
        .scrollbar-debug::-webkit-scrollbar {
          width: 14px;
          height: 14px;
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .scrollbar-debug::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border: 3px solid transparent;
          border-radius: 7px;
          background-clip: padding-box;
        }
        
        .scrollbar-debug::-webkit-scrollbar-corner {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default ScrollAreaVisualizer;
