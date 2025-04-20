
import React, { ReactNode } from 'react';
import { useContainerQuery } from '@/hooks/use-container-query';
import { cn } from '@/lib/utils';

interface AdaptiveGridProps {
  children: ReactNode;
  className?: string;
  baseColumns?: 1 | 2 | 3 | 4 | 6 | 12;
  smColumns?: 1 | 2 | 3 | 4;
  mdColumns?: 1 | 2 | 3 | 4 | 6;
  lgColumns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | number;
  rowGap?: 'none' | 'sm' | 'md' | 'lg' | number;
  colGap?: 'none' | 'sm' | 'md' | 'lg' | number;
  autoRows?: boolean;
  minRowHeight?: string;
  style?: React.CSSProperties;
}

/**
 * A grid component that adapts its column count based on container width
 */
export function AdaptiveGrid({
  children,
  className,
  baseColumns = 1,
  smColumns = 2,
  mdColumns = 3,
  lgColumns = 4,
  gap = 'md',
  rowGap,
  colGap,
  autoRows = false,
  minRowHeight = '100px',
  style
}: AdaptiveGridProps) {
  // Use container query to detect the container size
  const [containerRef, containerInfo] = useContainerQuery();
  
  // Determine columns based on container width
  let columns = baseColumns;
  if (containerInfo.isExtraLarge || containerInfo.isLarge) {
    columns = lgColumns;
  } else if (containerInfo.isMedium) {
    columns = mdColumns;
  } else if (containerInfo.isSmall) {
    columns = smColumns;
  }
  
  // Convert gap sizes to pixel values
  const getGapSize = (size: 'none' | 'sm' | 'md' | 'lg' | number | undefined): string => {
    if (size === undefined) return '';
    if (size === 'none') return '0';
    if (size === 'sm') return '0.5rem';
    if (size === 'md') return '1rem';
    if (size === 'lg') return '2rem';
    return `${size}px`;
  };
  
  // Apply grid styles
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: getGapSize(gap),
    ...style
  };
  
  // Apply row and column gap if specified
  if (rowGap) {
    gridStyle.rowGap = getGapSize(rowGap);
  }
  
  if (colGap) {
    gridStyle.columnGap = getGapSize(colGap);
  }
  
  // Apply auto rows if specified
  if (autoRows) {
    gridStyle.gridAutoRows = `minmax(${minRowHeight}, auto)`;
  }

  return (
    <div
      ref={containerRef}
      className={cn('adaptive-grid', className)}
      style={gridStyle}
    >
      {children}
    </div>
  );
}

export default AdaptiveGrid;
