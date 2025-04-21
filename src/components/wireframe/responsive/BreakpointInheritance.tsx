
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { BreakpointKey } from '../utils/responsive-utils';

export interface BreakpointValues<T> {
  base: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

interface BreakpointInheritanceContextType {
  resolveValue: <T>(values: BreakpointValues<T>) => T;
  getCurrentBreakpoint: () => BreakpointKey;
  getBreakpointOrder: () => BreakpointKey[];
  getAllInheritedValues: <T>(values: BreakpointValues<T>) => Record<BreakpointKey, T>;
}

const BreakpointInheritanceContext = createContext<BreakpointInheritanceContextType | undefined>(undefined);

export const useBreakpointInheritance = () => {
  const context = useContext(BreakpointInheritanceContext);
  if (!context) {
    throw new Error('useBreakpointInheritance must be used within a BreakpointInheritanceProvider');
  }
  return context;
};

interface BreakpointInheritanceProviderProps {
  children: ReactNode;
}

export const BreakpointInheritanceProvider: React.FC<BreakpointInheritanceProviderProps> = ({ children }) => {
  const { currentBreakpoint } = useResponsive();
  
  // Order of breakpoints from smallest to largest
  const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  // Resolve the inherited value for the current breakpoint
  const resolveValue = <T,>(values: BreakpointValues<T>): T => {
    if (!values) return values as unknown as T;
    
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    
    // Start from current breakpoint and go down to find the first defined value
    for (let i = currentIndex; i >= 0; i--) {
      const breakpoint = breakpointOrder[i];
      if (values[breakpoint] !== undefined) {
        return values[breakpoint] as T;
      }
    }
    
    // If no match found in smaller breakpoints, use base value
    return values.base;
  };
  
  // Get current active breakpoint
  const getCurrentBreakpoint = (): BreakpointKey => {
    return currentBreakpoint;
  };
  
  // Get the breakpoint order for custom inheritance logic
  const getBreakpointOrder = (): BreakpointKey[] => {
    return [...breakpointOrder];
  };
  
  // Get all inherited values for each breakpoint (useful for debugging)
  const getAllInheritedValues = <T,>(values: BreakpointValues<T>): Record<BreakpointKey, T> => {
    const result: Partial<Record<BreakpointKey, T>> = {};
    
    // For each breakpoint, calculate what its value would be
    breakpointOrder.forEach((breakpoint) => {
      const currentIndex = breakpointOrder.indexOf(breakpoint);
      
      // Find the first defined value for this breakpoint by looking at it and all smaller breakpoints
      for (let i = currentIndex; i >= 0; i--) {
        const checkBreakpoint = breakpointOrder[i];
        if (values[checkBreakpoint] !== undefined) {
          result[breakpoint] = values[checkBreakpoint] as T;
          break;
        }
      }
      
      // If no match found, use base value
      if (result[breakpoint] === undefined) {
        result[breakpoint] = values.base;
      }
    });
    
    return result as Record<BreakpointKey, T>;
  };
  
  return (
    <BreakpointInheritanceContext.Provider value={{
      resolveValue,
      getCurrentBreakpoint,
      getBreakpointOrder,
      getAllInheritedValues
    }}>
      {children}
    </BreakpointInheritanceContext.Provider>
  );
};
