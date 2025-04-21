
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ScrollAreaVisualizerProps {
  width?: string | number;
  height?: number;
  showControls?: boolean;
  highlightScrollbars?: boolean;
  showScrollPosition?: boolean;
  children?: React.ReactNode; // Add children prop to fix the error
}

const ScrollAreaVisualizer: React.FC<ScrollAreaVisualizerProps> = ({
  width = '100%',
  height = 300,
  showControls = true,
  highlightScrollbars = true,
  showScrollPosition = true,
  children
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [contentHeight, setContentHeight] = useState(height * 2);
  const [contentWidth, setContentWidth] = useState('100%');
  const [showMetrics, setShowMetrics] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Monitor scroll position
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollTop(scrollContainerRef.current.scrollTop);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };
  
  // Calculate scroll percentages
  const getScrollTopPercentage = () => {
    if (!scrollContainerRef.current) return 0;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    return scrollHeight <= clientHeight ? 0 : (scrollTop / (scrollHeight - clientHeight)) * 100;
  };
  
  const getScrollLeftPercentage = () => {
    if (!scrollContainerRef.current) return 0;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    return scrollWidth <= clientWidth ? 0 : (scrollLeft / (scrollWidth - clientWidth)) * 100;
  };

  // Update content dimensions
  useEffect(() => {
    if (scrollContainerRef.current) {
      handleScroll();
    }
  }, [contentHeight, contentWidth]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      {showControls && (
        <div className="space-y-4 p-4 bg-slate-50 rounded-md">
          <h3 className="text-sm font-medium mb-2">Scroll Area Controls</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="content-height">Content Height: {contentHeight}px</Label>
            </div>
            <Slider
              id="content-height"
              min={height}
              max={height * 3}
              step={50}
              value={[contentHeight]}
              onValueChange={(value) => setContentHeight(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content-width">Content Width</Label>
            <div className="flex gap-2">
              <button
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  contentWidth === '100%' ? "bg-primary text-primary-foreground" : "bg-slate-200"
                )}
                onClick={() => setContentWidth('100%')}
              >
                100%
              </button>
              <button
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  contentWidth === '150%' ? "bg-primary text-primary-foreground" : "bg-slate-200"
                )}
                onClick={() => setContentWidth('150%')}
              >
                150%
              </button>
              <button
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  contentWidth === '200%' ? "bg-primary text-primary-foreground" : "bg-slate-200"
                )}
                onClick={() => setContentWidth('200%')}
              >
                200%
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="show-metrics" 
              checked={showMetrics} 
              onCheckedChange={setShowMetrics}
            />
            <Label htmlFor="show-metrics">Show Scroll Metrics</Label>
          </div>
        </div>
      )}
      
      {/* Scroll metrics display */}
      {showScrollPosition && showMetrics && (
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">
            Scroll Top: {Math.round(scrollTop)}px
          </Badge>
          <Badge variant="outline">
            Scroll Left: {Math.round(scrollLeft)}px
          </Badge>
          <Badge variant="outline">
            Vertical: {Math.round(getScrollTopPercentage())}%
          </Badge>
          <Badge variant="outline">
            Horizontal: {Math.round(getScrollLeftPercentage())}%
          </Badge>
        </div>
      )}
      
      {/* Scroll visualization */}
      <Card className="overflow-hidden" style={{ width }}>
        <div className="relative">
          {/* Vertical scroll indicator */}
          {highlightScrollbars && (
            <div 
              className="absolute right-0 top-0 w-2 bg-slate-200 z-10 opacity-50"
              style={{ height: `${height}px` }}
            >
              <div 
                className="bg-primary w-full rounded-sm"
                style={{ 
                  height: `${(height / (contentHeight / height)) || 0}px`,
                  transform: `translateY(${getScrollTopPercentage() * ((height - (height / (contentHeight / height))) / 100)}px)`,
                  opacity: contentHeight > height ? 0.8 : 0.3
                }}
              />
            </div>
          )}
          
          {/* Horizontal scroll indicator */}
          {highlightScrollbars && contentWidth !== '100%' && (
            <div 
              className="absolute bottom-0 left-0 h-2 bg-slate-200 z-10 opacity-50"
              style={{ width: '100%' }}
            >
              <div 
                className="bg-primary h-full rounded-sm"
                style={{ 
                  width: contentWidth === '150%' ? '66%' : contentWidth === '200%' ? '50%' : '100%',
                  transform: `translateX(${getScrollLeftPercentage() * (100 - (contentWidth === '150%' ? 66 : contentWidth === '200%' ? 50 : 100)) / 100}%)`,
                  opacity: contentWidth !== '100%' ? 0.8 : 0.3
                }}
              />
            </div>
          )}
          
          <div
            ref={scrollContainerRef}
            className="overflow-auto scrollbar-thin"
            style={{ height, maxHeight: height }}
            onScroll={handleScroll}
          >
            <div style={{ height: contentHeight, width: contentWidth }}>
              {children ? children : (
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Array(8).fill(0).map((_, idx) => (
                      <div 
                        key={idx}
                        className="p-4 border rounded-md bg-slate-50/50"
                      >
                        <h4 className="text-sm font-medium">Item {idx + 1}</h4>
                        <p className="text-xs text-slate-500">Scroll content item</p>
                      </div>
                    ))}
                    
                    <div className="col-span-2 p-4 border rounded-md bg-blue-50/50">
                      <h4 className="text-sm font-medium">Scroll to reach</h4>
                      <p className="text-xs text-blue-600">This content requires scrolling to see</p>
                    </div>
                    
                    {Array(4).fill(0).map((_, idx) => (
                      <div 
                        key={`bottom-${idx}`}
                        className="p-4 border rounded-md bg-slate-50/50"
                      >
                        <h4 className="text-sm font-medium">Bottom Item {idx + 1}</h4>
                        <p className="text-xs text-slate-500">This is at the bottom</p>
                      </div>
                    ))}
                  </div>
                  
                  {contentWidth !== '100%' && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md" style={{ marginLeft: '120%', width: '70%' }}>
                      <h4 className="text-sm font-medium">Horizontal Scroll Content</h4>
                      <p className="text-xs text-amber-700">This content requires horizontal scrolling</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {/* CSS for scrollbar styling */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ScrollAreaVisualizer;
