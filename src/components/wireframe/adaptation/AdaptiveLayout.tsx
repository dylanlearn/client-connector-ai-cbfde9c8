
import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { useResizeObserver } from '@/hooks/use-resize-observer';
import { cn } from '@/lib/utils';
import { AdaptiveRules, AdaptiveLayoutProps } from './adaptation-types';
import { calculateAdaptiveLayout } from './adaptation-utils';

/**
 * A component that automatically adjusts layout based on available space
 * and number of child elements.
 */
const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  children,
  className,
  adaptiveRules,
  minColumns = 1,
  maxColumns = 4,
  gap = 16,
  debug = false,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<'grid' | 'stack' | 'row'>('row');
  const [columns, setColumns] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // Count valid React element children
  const childCount = React.Children.toArray(children).filter(
    child => React.isValidElement(child)
  ).length;

  // Use resize observer to track container dimensions
  useResizeObserver(containerRef, (entry) => {
    const { width, height } = entry.contentRect;
    setContainerSize({ width, height });
    
    // Calculate layout based on container size and child elements
    const validChildren = React.Children.toArray(children).filter(
      child => React.isValidElement(child)
    ) as React.ReactElement[];
    
    const layoutResult = calculateAdaptiveLayout(
      width,
      height,
      validChildren,
      adaptiveRules || {}
    );

    setLayout(layoutResult.layout);
    setColumns(layoutResult.columns || Math.min(Math.max(minColumns, childCount), maxColumns));
  });
  
  // Get appropriate class names for the current layout
  const layoutClasses = {
    row: "flex flex-row flex-wrap",
    stack: "flex flex-col",
    grid: "grid"
  };
  
  // Generate grid template columns CSS
  const gridStyle = layout === 'grid' ? {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: typeof gap === 'number' ? `${gap}px` : gap
  } : {};

  // Apply flex gap for row and stack layouts
  const flexGapStyle = layout !== 'grid' ? {
    gap: typeof gap === 'number' ? `${gap}px` : gap
  } : {};

  return (
    <div
      ref={containerRef}
      className={cn(
        "adaptive-layout",
        layoutClasses[layout],
        className
      )}
      data-layout={layout}
      data-columns={columns}
      style={{
        ...gridStyle,
        ...flexGapStyle,
        ...style
      }}
    >
      {children}
      
      {debug && (
        <div className="absolute top-1 right-1 text-xs bg-background/80 px-2 py-1 rounded border shadow-sm z-10">
          {containerSize.width.toFixed(0)}×{containerSize.height.toFixed(0)} • {layout} {layout === 'grid' && `(${columns})`}
        </div>
      )}
    </div>
  );
};

export default AdaptiveLayout;
