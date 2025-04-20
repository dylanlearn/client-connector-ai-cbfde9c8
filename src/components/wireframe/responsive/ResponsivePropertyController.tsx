
import React, { useMemo } from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { BreakpointKey } from '@/components/wireframe/utils/responsive-utils';

export type ResponsiveValue<T> = {
  base: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

interface ResponsivePropertyControllerProps<T> {
  value: ResponsiveValue<T>;
  children: (currentValue: T) => React.ReactNode;
  fallback?: T;
}

/**
 * Component that resolves responsive properties based on current breakpoint
 */
export function ResponsivePropertyController<T>({
  value,
  children,
  fallback
}: ResponsivePropertyControllerProps<T>) {
  const { currentBreakpoint } = useResponsive();
  
  // Determine the current value based on responsive breakpoints with inheritance
  const currentValue = useMemo(() => {
    // Handle undefined values
    if (!value) {
      return fallback as T;
    }

    // Order of breakpoints from smallest to largest
    const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    
    // Find the appropriate value by traversing down from current breakpoint
    for (let i = currentIndex; i >= 0; i--) {
      const breakpoint = breakpointOrder[i];
      if (value[breakpoint] !== undefined) {
        return value[breakpoint] as T;
      }
    }
    
    // If no match found, return base value or fallback
    return value.base !== undefined ? value.base : (fallback as T);
  }, [value, currentBreakpoint, fallback]);
  
  return <>{children(currentValue)}</>;
}

/**
 * Hook to resolve a responsive value based on current breakpoint
 */
export function useResponsiveValue<T>(responsiveValue: ResponsiveValue<T> | T): T {
  const { currentBreakpoint } = useResponsive();
  
  return useMemo(() => {
    // If the value is not a responsive object, return it directly
    if (!responsiveValue || typeof responsiveValue !== 'object' || !('base' in responsiveValue)) {
      return responsiveValue as T;
    }
    
    const value = responsiveValue as ResponsiveValue<T>;
    
    // Order of breakpoints from smallest to largest
    const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    
    // Find the appropriate value by traversing down from current breakpoint
    for (let i = currentIndex; i >= 0; i--) {
      const breakpoint = breakpointOrder[i];
      if (value[breakpoint] !== undefined) {
        return value[breakpoint] as T;
      }
    }
    
    // If no match found, return base value
    return value.base;
  }, [responsiveValue, currentBreakpoint]);
}

export default ResponsivePropertyController;
