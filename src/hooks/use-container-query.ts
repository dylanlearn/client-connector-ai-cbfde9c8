
import { useRef, useState, useCallback, useEffect } from 'react';

export type ContainerBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ContainerBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export const DEFAULT_BREAKPOINTS: ContainerBreakpoints = {
  xs: 384,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export interface ContainerQueryInfo {
  size: { width: number; height: number };
  breakpoint: ContainerBreakpoint;
  isExtraSmall: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isExtraLarge: boolean;
  is2XL: boolean;
  aspectRatio: number;
}

/**
 * Hook for tracking container dimensions and applying responsive design at the component level
 */
export function useContainerQuery<T extends HTMLElement = HTMLDivElement>(
  customBreakpoints?: Partial<ContainerBreakpoints>
) {
  const containerRef = useRef<T | null>(null);
  const [containerInfo, setContainerInfo] = useState<ContainerQueryInfo>({
    size: { width: 0, height: 0 },
    breakpoint: 'md',
    isExtraSmall: false,
    isSmall: false,
    isMedium: true,
    isLarge: false,
    isExtraLarge: false,
    is2XL: false,
    aspectRatio: 1,
  });
  
  // Merge custom breakpoints with defaults
  const breakpoints = customBreakpoints 
    ? { ...DEFAULT_BREAKPOINTS, ...customBreakpoints }
    : DEFAULT_BREAKPOINTS;
  
  const getBreakpoint = useCallback((width: number): ContainerBreakpoint => {
    if (width < breakpoints.xs) return 'xs';
    if (width < breakpoints.sm) return 'sm';
    if (width < breakpoints.md) return 'md';
    if (width < breakpoints.lg) return 'lg';
    if (width < breakpoints.xl) return 'xl';
    return '2xl';
  }, [breakpoints]);
  
  const updateContainerInfo = useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      const breakpoint = getBreakpoint(offsetWidth);
      const aspectRatio = offsetWidth / Math.max(offsetHeight, 1);
      
      setContainerInfo({
        size: { width: offsetWidth, height: offsetHeight },
        breakpoint,
        isExtraSmall: breakpoint === 'xs',
        isSmall: breakpoint === 'sm',
        isMedium: breakpoint === 'md',
        isLarge: breakpoint === 'lg',
        isExtraLarge: breakpoint === 'xl',
        is2XL: breakpoint === '2xl',
        aspectRatio,
      });
    }
  }, [getBreakpoint]);
  
  useEffect(() => {
    // Initial measurement
    updateContainerInfo();
    
    // Set up resize observer for container queries
    const observer = new ResizeObserver(updateContainerInfo);
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [updateContainerInfo]);
  
  return [containerRef, containerInfo] as const;
}
