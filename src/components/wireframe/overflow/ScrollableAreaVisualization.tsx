
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ScrollableAreaVisualizationProps {
  children: React.ReactNode;
  className?: string;
  height?: number | string;
  width?: number | string;
  direction?: 'vertical' | 'horizontal' | 'both';
  showScrollbar?: boolean;
  showScrollIndicators?: boolean;
  simulateScroll?: boolean;
  onScroll?: (position: { x: number; y: number; percentX: number; percentY: number }) => void;
  scrollTriggers?: {
    position: number; // percentage of scroll (0-100)
    direction: 'vertical' | 'horizontal';
    callback: () => void;
    fired?: boolean;
  }[];
}

/**
 * A component that visualizes scrollable areas and their behavior
 */
const ScrollableAreaVisualization: React.FC<ScrollableAreaVisualizationProps> = ({
  children,
  className,
  height = 300,
  width = '100%',
  direction = 'vertical',
  showScrollbar = true,
  showScrollIndicators = true,
  simulateScroll = false,
  onScroll,
  scrollTriggers = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0, percentX: 0, percentY: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [triggeredEffects, setTriggeredEffects] = useState<Record<number, boolean>>({});
  
  // Configure overflow based on direction prop
  const overflowClass = 
    direction === 'vertical' ? 'overflow-y-auto overflow-x-hidden' :
    direction === 'horizontal' ? 'overflow-x-auto overflow-y-hidden' :
    'overflow-auto';
  
  // Hide scrollbar if requested
  const scrollbarClass = !showScrollbar ? 'scrollbar-hide' : '';
  
  // Handle scroll events
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = containerRef.current;
    const percentY = (scrollTop / (scrollHeight - clientHeight)) * 100;
    const percentX = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    
    // Update position state
    setScrollPosition({
      x: scrollLeft,
      y: scrollTop,
      percentX,
      percentY
    });
    
    // Trigger scroll callbacks
    if (onScroll) {
      onScroll({
        x: scrollLeft,
        y: scrollTop,
        percentX,
        percentY
      });
    }
    
    // Check for scroll triggers
    scrollTriggers.forEach((trigger, index) => {
      const triggerValue = trigger.direction === 'vertical' ? percentY : percentX;
      
      if (triggerValue >= trigger.position && !triggeredEffects[index]) {
        // Execute the trigger callback
        trigger.callback();
        
        // Mark as triggered
        setTriggeredEffects(prev => ({
          ...prev,
          [index]: true
        }));
      } else if (triggerValue < trigger.position && triggeredEffects[index]) {
        // Reset trigger state when scrolling back up
        setTriggeredEffects(prev => ({
          ...prev,
          [index]: false
        }));
      }
    });
  };
  
  // Simulate scrolling if requested
  useEffect(() => {
    if (!simulateScroll || !containerRef.current) return;
    
    let animationFrame: number;
    let scrollProgress = 0;
    const scrollSpeed = 50; // pixels per second
    const lastTime = { current: Date.now() };
    
    const simulateScrollAnimation = () => {
      const currentTime = Date.now();
      const delta = currentTime - lastTime.current;
      lastTime.current = currentTime;
      
      if (containerRef.current) {
        const maxScroll = direction === 'horizontal' 
          ? containerRef.current.scrollWidth - containerRef.current.clientWidth
          : containerRef.current.scrollHeight - containerRef.current.clientHeight;
        
        scrollProgress += (scrollSpeed * delta) / 1000;
        if (scrollProgress > maxScroll) {
          scrollProgress = 0;
        }
        
        if (direction === 'horizontal') {
          containerRef.current.scrollLeft = scrollProgress;
        } else {
          containerRef.current.scrollTop = scrollProgress;
        }
      }
      
      animationFrame = requestAnimationFrame(simulateScrollAnimation);
    };
    
    animationFrame = requestAnimationFrame(simulateScrollAnimation);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [simulateScroll, direction]);
  
  return (
    <div className="relative">
      {/* Main scrollable area */}
      <div
        ref={containerRef}
        className={cn(
          'scrollable-area',
          overflowClass,
          scrollbarClass,
          isScrolling && 'is-scrolling',
          className
        )}
        style={{ height, width }}
        onScroll={handleScroll}
        onMouseEnter={() => setIsScrolling(true)}
        onMouseLeave={() => setIsScrolling(false)}
      >
        {children}
      </div>
      
      {/* Scroll indicators */}
      {showScrollIndicators && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Vertical scroll indicator */}
          {(direction === 'vertical' || direction === 'both') && (
            <div 
              className="absolute right-1 top-0 w-1 h-full opacity-50"
              aria-hidden="true"
            >
              <div 
                className="bg-primary/30 rounded-full w-1"
                style={{
                  height: '20%', 
                  transform: `translateY(${scrollPosition.percentY * 0.8}%)`,
                  opacity: isScrolling ? 0.8 : 0.3,
                  transition: 'opacity 0.2s ease'
                }}
              />
            </div>
          )}
          
          {/* Horizontal scroll indicator */}
          {(direction === 'horizontal' || direction === 'both') && (
            <div 
              className="absolute bottom-1 left-0 h-1 w-full opacity-50"
              aria-hidden="true"
            >
              <div 
                className="bg-primary/30 rounded-full h-1"
                style={{
                  width: '20%', 
                  transform: `translateX(${scrollPosition.percentX * 0.8}%)`,
                  opacity: isScrolling ? 0.8 : 0.3,
                  transition: 'opacity 0.2s ease'
                }}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Scroll position display (for development/visualization) */}
      <div className="absolute bottom-0 right-0 bg-background/80 text-xs px-2 py-1 rounded-tl">
        {direction === 'vertical' || direction === 'both' ? `${Math.round(scrollPosition.percentY)}%` : ''}
        {direction === 'both' ? ' | ' : ''}
        {direction === 'horizontal' || direction === 'both' ? `${Math.round(scrollPosition.percentX)}%` : ''}
      </div>
    </div>
  );
};

export default ScrollableAreaVisualization;
