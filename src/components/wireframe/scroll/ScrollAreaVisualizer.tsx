
import React, { useState, useEffect, useRef } from 'react';

export interface ScrollAreaVisualizerProps {
  width?: string | number;
  height?: number;
  showControls?: boolean;
  highlightScrollbars?: boolean;
  showScrollPosition?: boolean;
  children?: React.ReactNode;
}

const ScrollAreaVisualizer: React.FC<ScrollAreaVisualizerProps> = ({
  width = "100%",
  height = 400,
  showControls = true,
  highlightScrollbars = true,
  showScrollPosition = true,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollInfo, setScrollInfo] = useState({
    top: 0,
    left: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    clientHeight: 0,
    clientWidth: 0,
    verticalPercentage: 0,
    horizontalPercentage: 0
  });

  // Update scroll info whenever scroll happens
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const {
        scrollTop,
        scrollLeft,
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth
      } = scrollContainer;

      const verticalPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      const horizontalPercentage = Math.round((scrollLeft / (scrollWidth - clientWidth)) * 100);

      setScrollInfo({
        top: scrollTop,
        left: scrollLeft,
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
        verticalPercentage: isNaN(verticalPercentage) ? 0 : verticalPercentage,
        horizontalPercentage: isNaN(horizontalPercentage) ? 0 : horizontalPercentage
      });
    };

    handleScroll(); // Initial call
    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll control functions
  const scrollTo = (direction: 'top' | 'bottom' | 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    switch (direction) {
      case 'top':
        container.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'bottom':
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        break;
      case 'left':
        container.scrollTo({ left: 0, behavior: 'smooth' });
        break;
      case 'right':
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full">
      {showControls && (
        <div className="mb-2 flex justify-between">
          {/* Vertical scroll controls */}
          <div className="flex gap-2">
            <button 
              onClick={() => scrollTo('top')} 
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Scroll Top
            </button>
            <button 
              onClick={() => scrollTo('bottom')} 
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Scroll Bottom
            </button>
          </div>
          
          {/* Horizontal scroll controls */}
          <div className="flex gap-2">
            <button 
              onClick={() => scrollTo('left')} 
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Scroll Left
            </button>
            <button 
              onClick={() => scrollTo('right')} 
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Scroll Right
            </button>
          </div>
        </div>
      )}
      
      <div 
        className="relative border border-gray-200 rounded overflow-hidden"
        style={{ width }}
      >
        {/* Scroll container */}
        <div 
          ref={containerRef}
          className={`overflow-auto ${highlightScrollbars ? 'custom-scrollbar' : ''}`}
          style={{ 
            height, 
            maxHeight: height,
          }}
        >
          {children || (
            <div className="min-h-[800px] min-w-[1200px] relative p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              {/* Sample scrollable content */}
              <div className="absolute top-20 left-20 bg-white p-4 shadow-md rounded">
                Item in top-left area
              </div>
              <div className="absolute top-40 right-20 bg-white p-4 shadow-md rounded">
                Item in top-right area
              </div>
              <div className="absolute bottom-20 left-40 bg-white p-4 shadow-md rounded">
                Item in bottom-left area
              </div>
              <div className="absolute bottom-40 right-40 bg-white p-4 shadow-md rounded">
                Item in bottom-right area
              </div>
              
              {/* Center Item */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-6 shadow-lg rounded">
                Center Item
              </div>
              
              {/* Far-off items to create scrollable space */}
              <div className="absolute top-10 right-[1000px] bg-white p-4 shadow-md rounded">
                Far left item
              </div>
              <div className="absolute bottom-10 left-[1000px] bg-white p-4 shadow-md rounded">
                Far right item
              </div>
              <div className="absolute top-[700px] left-1/3 bg-white p-4 shadow-md rounded">
                Far bottom item
              </div>
            </div>
          )}
        </div>
        
        {/* Scroll position indicators */}
        {showScrollPosition && (
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <div>
              <span>Vertical: {scrollInfo.verticalPercentage}%</span>
              <span className="mx-2">|</span>
              <span>Horizontal: {scrollInfo.horizontalPercentage}%</span>
            </div>
            <div>
              <span>{scrollInfo.top}px / {scrollInfo.scrollHeight}px</span>
              <span className="mx-2">×</span>
              <span>{scrollInfo.left}px / {scrollInfo.scrollWidth}px</span>
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 12px;
            height: 12px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 6px;
            border: 3px solid #f1f1f1;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
          }
          .custom-scrollbar::-webkit-scrollbar-corner {
            background: #f1f1f1;
          }
        `}
      </style>
    </div>
  );
};

export default ScrollAreaVisualizer;
