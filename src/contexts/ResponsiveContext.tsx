
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BreakpointKey } from '@/components/wireframe/utils/responsive-utils';

interface ResponsiveContextType {
  currentBreakpoint: BreakpointKey;
  isExtraSmall: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isExtraLarge: boolean;
  is2XL: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

const ResponsiveContext = createContext<ResponsiveContextType>({
  currentBreakpoint: 'lg',
  isExtraSmall: false,
  isSmall: false,
  isMedium: false,
  isLarge: true,
  isExtraLarge: false,
  is2XL: false,
  viewportWidth: 0,
  viewportHeight: 0
});

interface ResponsiveProviderProps {
  children: ReactNode;
}

export function ResponsiveProvider({ children }: ResponsiveProviderProps) {
  const [state, setState] = useState<ResponsiveContextType>({
    currentBreakpoint: 'lg',
    isExtraSmall: false,
    isSmall: false,
    isMedium: false,
    isLarge: true,
    isExtraLarge: false,
    is2XL: false,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let breakpoint: BreakpointKey = 'lg';
      
      if (width < 384) breakpoint = 'xs';
      else if (width < 640) breakpoint = 'sm';
      else if (width < 768) breakpoint = 'md';
      else if (width < 1024) breakpoint = 'lg';
      else if (width < 1280) breakpoint = 'xl';
      else breakpoint = '2xl';
      
      setState({
        currentBreakpoint: breakpoint,
        isExtraSmall: breakpoint === 'xs',
        isSmall: breakpoint === 'sm',
        isMedium: breakpoint === 'md',
        isLarge: breakpoint === 'lg',
        isExtraLarge: breakpoint === 'xl',
        is2XL: breakpoint === '2xl',
        viewportWidth: width,
        viewportHeight: height
      });
    };
    
    // Initial call
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <ResponsiveContext.Provider value={state}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export const useResponsive = () => useContext(ResponsiveContext);
