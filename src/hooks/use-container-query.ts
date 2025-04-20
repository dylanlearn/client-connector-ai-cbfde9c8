
import { useState, useEffect, useRef, RefObject } from 'react';
import { BreakpointKey } from '@/components/wireframe/utils/responsive-utils';

export interface ContainerBreakpoints {
  xs: number; // Extra small containers
  sm: number; // Small containers
  md: number; // Medium containers
  lg: number; // Large containers
  xl: number; // Extra large containers
}

export interface ContainerSize {
  width: number;
  height: number;
}

export interface ContainerInfo {
  size: ContainerSize;
  breakpoint: BreakpointKey;
  isExtraSmall: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isExtraLarge: boolean;
  aspectRatio: number;
}

// Default breakpoints for containers (smaller than viewport breakpoints)
const defaultContainerBreakpoints: ContainerBreakpoints = {
  xs: 0,
  sm: 384,
  md: 576,
  lg: 768,
  xl: 960,
};

export function useContainerQuery<T extends HTMLElement = HTMLDivElement>(
  customBreakpoints?: Partial<ContainerBreakpoints>
): [RefObject<T>, ContainerInfo] {
  const containerRef = useRef<T>(null);
  const breakpoints: ContainerBreakpoints = {
    ...defaultContainerBreakpoints,
    ...customBreakpoints,
  };
  
  const [containerInfo, setContainerInfo] = useState<ContainerInfo>({
    size: { width: 0, height: 0 },
    breakpoint: 'xs',
    isExtraSmall: true,
    isSmall: false,
    isMedium: false,
    isLarge: false,
    isExtraLarge: false,
    aspectRatio: 1,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateContainerInfo = () => {
      const container = containerRef.current;
      if (!container) return;

      // Get the current dimensions
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Determine the current breakpoint
      let breakpoint: BreakpointKey = 'xs';
      if (width >= breakpoints.xl) breakpoint = 'xl';
      else if (width >= breakpoints.lg) breakpoint = 'lg';
      else if (width >= breakpoints.md) breakpoint = 'md';
      else if (width >= breakpoints.sm) breakpoint = 'sm';
      
      // Update state with new info
      setContainerInfo({
        size: { width, height },
        breakpoint,
        isExtraSmall: width < breakpoints.sm,
        isSmall: width >= breakpoints.sm && width < breakpoints.md,
        isMedium: width >= breakpoints.md && width < breakpoints.lg,
        isLarge: width >= breakpoints.lg && width < breakpoints.xl,
        isExtraLarge: width >= breakpoints.xl,
        aspectRatio: height > 0 ? width / height : 1,
      });
    };

    // Initialize the observer
    const resizeObserver = new ResizeObserver(() => {
      updateContainerInfo();
    });
    
    // Start observing the container
    resizeObserver.observe(containerRef.current);
    
    // Initial measurement
    updateContainerInfo();
    
    // Clean up
    return () => {
      resizeObserver.disconnect();
    };
  }, [breakpoints]);
  
  return [containerRef, containerInfo];
}
