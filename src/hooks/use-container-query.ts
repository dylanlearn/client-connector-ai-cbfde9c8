
import { useRef, useState, useCallback, useEffect } from 'react';

type ContainerBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ContainerQueryInfo {
  size: { width: number; height: number };
  breakpoint: ContainerBreakpoint;
  isExtraSmall: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isExtraLarge: boolean;
  is2XL: boolean;
}

/**
 * Hook for tracking container dimensions and applying responsive design at the component level
 */
export function useContainerQuery<T extends HTMLElement = HTMLDivElement>() {
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
  });
  
  const getBreakpoint = useCallback((width: number): ContainerBreakpoint => {
    if (width < 384) return 'xs';
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    if (width < 1280) return 'xl';
    return '2xl';
  }, []);
  
  const updateContainerInfo = useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      const breakpoint = getBreakpoint(offsetWidth);
      
      setContainerInfo({
        size: { width: offsetWidth, height: offsetHeight },
        breakpoint,
        isExtraSmall: breakpoint === 'xs',
        isSmall: breakpoint === 'sm',
        isMedium: breakpoint === 'md',
        isLarge: breakpoint === 'lg',
        isExtraLarge: breakpoint === 'xl',
        is2XL: breakpoint === '2xl',
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
