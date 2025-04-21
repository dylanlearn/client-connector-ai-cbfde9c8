
import { useRef, useState, useEffect, RefObject } from 'react';

export interface ContainerQueryInfo {
  isExtraSmall: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isExtraLarge: boolean;
  size: {
    width: number;
    height: number;
  };
  aspectRatio: number;
  breakpoint: string;
}

export function useContainerQuery(): [RefObject<HTMLDivElement>, ContainerQueryInfo] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerInfo, setContainerInfo] = useState<ContainerQueryInfo>({
    isExtraSmall: false,
    isSmall: false,
    isMedium: false,
    isLarge: false,
    isExtraLarge: false,
    size: { width: 0, height: 0 },
    aspectRatio: 1,
    breakpoint: 'md'
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateContainerInfo = () => {
      if (!containerRef.current) return;

      const { offsetWidth, offsetHeight } = containerRef.current;

      // Calculate aspect ratio
      const aspectRatio = offsetWidth / offsetHeight;
      
      // Determine container size category
      const isExtraSmall = offsetWidth < 384;
      const isSmall = offsetWidth >= 384 && offsetWidth < 640;
      const isMedium = offsetWidth >= 640 && offsetWidth < 768;
      const isLarge = offsetWidth >= 768 && offsetWidth < 1024;
      const isExtraLarge = offsetWidth >= 1024;

      // Determine breakpoint name
      let breakpoint = 'md';
      if (isExtraSmall) breakpoint = 'xs';
      else if (isSmall) breakpoint = 'sm';
      else if (isMedium) breakpoint = 'md';
      else if (isLarge) breakpoint = 'lg';
      else breakpoint = 'xl';

      setContainerInfo({
        isExtraSmall,
        isSmall,
        isMedium,
        isLarge,
        isExtraLarge,
        size: { width: offsetWidth, height: offsetHeight },
        aspectRatio,
        breakpoint
      });
    };

    // Initial update
    updateContainerInfo();

    // Set up ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      updateContainerInfo();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [containerRef, containerInfo];
}

export default useContainerQuery;
