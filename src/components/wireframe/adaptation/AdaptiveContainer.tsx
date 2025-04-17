
import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { useResizeObserver } from '@/hooks/use-resize-observer';
import { cn } from '@/lib/utils';
import { AdaptiveRules } from './adaptation-types';
import { applyAdaptiveRules } from './adaptation-utils';

interface AdaptiveContainerProps {
  children: ReactNode;
  className?: string;
  adaptiveRules?: AdaptiveRules;
  minWidth?: number;
  maxWidth?: number;
  preserveHeight?: boolean;
  debug?: boolean;
  id?: string;
}

/**
 * A container that adapts its children based on available space
 * and contextual rules.
 */
const AdaptiveContainer: React.FC<AdaptiveContainerProps> = ({
  children,
  className,
  adaptiveRules,
  minWidth = 0,
  maxWidth = Infinity,
  preserveHeight = false,
  debug = false,
  id
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [adaptiveState, setAdaptiveState] = useState<'compact' | 'normal' | 'expanded'>('normal');

  // Use resize observer to track container dimensions
  useResizeObserver(containerRef, (entry) => {
    const { width, height } = entry.contentRect;
    setContainerSize({ width, height });

    // Determine adaptive state based on container width
    if (width < 400) {
      setAdaptiveState('compact');
    } else if (width > 768) {
      setAdaptiveState('expanded');
    } else {
      setAdaptiveState('normal');
    }
  });

  // Apply adaptive rules based on container size and context
  const adaptedChildren = applyAdaptiveRules(
    children,
    containerSize,
    adaptiveState,
    adaptiveRules || {}
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "adaptive-container relative",
        adaptiveState === 'compact' && "adaptive-container-compact",
        adaptiveState === 'expanded' && "adaptive-container-expanded",
        className
      )}
      data-adaptive-state={adaptiveState}
      id={id}
      style={{
        minWidth: minWidth > 0 ? `${minWidth}px` : undefined,
        maxWidth: maxWidth < Infinity ? `${maxWidth}px` : undefined
      }}
    >
      {adaptedChildren}
      
      {debug && (
        <div className="absolute bottom-1 right-1 text-xs bg-background/80 px-2 py-1 rounded border shadow-sm">
          {containerSize.width.toFixed(0)}×{containerSize.height.toFixed(0)} • {adaptiveState}
        </div>
      )}
    </div>
  );
};

export default AdaptiveContainer;
