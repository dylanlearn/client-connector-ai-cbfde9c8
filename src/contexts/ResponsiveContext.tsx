
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BreakpointKey } from '@/components/wireframe/utils/responsive-utils';

interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

interface ResponsiveContextType {
  viewportWidth: number;
  viewportHeight: number;
  currentBreakpoint: BreakpointKey;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  orientation: 'portrait' | 'landscape';
  devicePixelRatio: number;
}

export const breakpoints: Breakpoints = {
  xs: 0,
  sm: 640, 
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

const initialContext: ResponsiveContextType = {
  viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
  viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 768,
  currentBreakpoint: 'lg',
  isDesktop: true,
  isTablet: false,
  isMobile: false,
  orientation: 'landscape',
  devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1
};

export const ResponsiveContext = createContext<ResponsiveContextType>(initialContext);

export function useResponsive() {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
}

interface ResponsiveProviderProps {
  children: ReactNode;
}

export function ResponsiveProvider({ children }: ResponsiveProviderProps) {
  const [responsive, setResponsive] = useState<ResponsiveContextType>(initialContext);

  // Determine the current breakpoint based on viewport width
  const getCurrentBreakpoint = (width: number): BreakpointKey => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentBreakpoint = getCurrentBreakpoint(width);
      
      setResponsive({
        viewportWidth: width,
        viewportHeight: height,
        currentBreakpoint,
        isDesktop: width >= breakpoints.lg,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isMobile: width < breakpoints.md,
        orientation: width > height ? 'landscape' : 'portrait',
        devicePixelRatio: window.devicePixelRatio
      });
    };

    // Initialize
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ResponsiveContext.Provider value={responsive}>
      {children}
    </ResponsiveContext.Provider>
  );
}
