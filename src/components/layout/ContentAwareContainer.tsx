
import React, { useRef, useEffect, useState } from 'react';
import { useResizeObserver } from '@/hooks/use-resize-observer';
import { cn } from '@/lib/utils';

interface ContentAwareContainerProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  preserveRatio?: boolean;
  adaptiveFont?: boolean;
  preventOverflow?: boolean;
  style?: React.CSSProperties;
}

const ContentAwareContainer: React.FC<ContentAwareContainerProps> = ({
  children,
  className,
  minHeight = 0,
  maxHeight = Infinity,
  preserveRatio = true,
  adaptiveFont = true,
  preventOverflow = true,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | { x: number; y: number }>(1);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useResizeObserver(containerRef, () => {
    adjustContent();
  });

  const adjustContent = () => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    // Check for overflow
    const isContentOverflowing = 
      content.scrollWidth > container.clientWidth ||
      content.scrollHeight > container.clientHeight;

    setIsOverflowing(isContentOverflowing);

    if (isContentOverflowing && preventOverflow) {
      // Calculate scale to fit
      const widthScale = container.clientWidth / content.scrollWidth;
      const heightScale = container.clientHeight / content.scrollHeight;
      const newScale = preserveRatio 
        ? Math.min(widthScale, heightScale)
        : { x: widthScale, y: heightScale };

      setScale(newScale);

      // Adjust font size if enabled
      if (adaptiveFont) {
        const baseFontSize = parseInt(window.getComputedStyle(container).fontSize);
        const newFontSize = baseFontSize * (typeof newScale === 'number' ? newScale : newScale.x);
        container.style.fontSize = `${Math.max(12, Math.min(newFontSize, 24))}px`;
      }
    } else {
      setScale(1);
      if (adaptiveFont) {
        container.style.fontSize = '';
      }
    }
  };

  useEffect(() => {
    adjustContent();
  }, [children]);

  // Helper function to generate the CSS transform value
  const getTransformValue = () => {
    if (typeof scale === 'number') {
      return `scale(${scale})`;
    } else {
      return `scale(${scale.x}, ${scale.y})`;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "content-aware-container relative",
        preventOverflow && "overflow-hidden",
        className
      )}
      style={{
        minHeight: minHeight > 0 ? `${minHeight}px` : undefined,
        maxHeight: maxHeight < Infinity ? `${maxHeight}px` : undefined,
        ...style
      }}
    >
      <div
        ref={contentRef}
        className="content-wrapper"
        style={{
          transform: getTransformValue(),
          transformOrigin: 'center',
          transition: 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
      
      {isOverflowing && !preventOverflow && (
        <div className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
          Content overflow detected
        </div>
      )}
    </div>
  );
};

export default ContentAwareContainer;
