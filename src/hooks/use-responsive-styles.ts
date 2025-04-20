
import { useMemo } from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { BreakpointKey } from '@/components/wireframe/utils/responsive-utils';
import { useResponsiveValue, ResponsiveValue } from '@/components/wireframe/responsive/ResponsivePropertyController';

export interface ResponsiveStyles {
  [key: string]: ResponsiveValue<any>;
}

/**
 * A hook that computes responsive styles based on the current breakpoint
 */
export function useResponsiveStyles<T extends ResponsiveStyles>(
  styles: T
): Record<keyof T, any> {
  const { currentBreakpoint } = useResponsive();
  
  return useMemo(() => {
    const resolvedStyles: Record<string, any> = {};
    
    // Resolve each responsive style property
    Object.entries(styles).forEach(([key, value]) => {
      // Skip undefined values
      if (value === undefined) return;
      
      // If the value is a responsive value object
      if (typeof value === 'object' && value !== null && 'base' in value) {
        const responsiveValue = value as ResponsiveValue<any>;
        
        // Order of breakpoints from smallest to largest
        const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
        const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
        
        // Find the appropriate value
        let foundValue = responsiveValue.base;
        
        for (let i = 0; i <= currentIndex; i++) {
          const breakpoint = breakpointOrder[i];
          if (responsiveValue[breakpoint] !== undefined) {
            foundValue = responsiveValue[breakpoint];
          }
        }
        
        resolvedStyles[key] = foundValue;
      } else {
        // If it's a simple value, use it directly
        resolvedStyles[key] = value;
      }
    });
    
    return resolvedStyles as Record<keyof T, any>;
  }, [styles, currentBreakpoint]);
}

/**
 * A hook that computes responsive classes based on the current breakpoint
 */
export function useResponsiveClasses(
  classMap: Record<string, ResponsiveValue<boolean> | boolean>
): string {
  const { currentBreakpoint } = useResponsive();
  
  return useMemo(() => {
    const activeClasses: string[] = [];
    
    Object.entries(classMap).forEach(([className, condition]) => {
      // If it's a simple boolean
      if (typeof condition === 'boolean') {
        if (condition) {
          activeClasses.push(className);
        }
        return;
      }
      
      // If it's a responsive value
      if (typeof condition === 'object' && condition !== null && 'base' in condition) {
        const responsiveCondition = condition as ResponsiveValue<boolean>;
        
        // Default to base value
        let isActive = !!responsiveCondition.base;
        
        // Order of breakpoints from smallest to largest
        const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
        const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
        
        // Find the appropriate value
        for (let i = 0; i <= currentIndex; i++) {
          const breakpoint = breakpointOrder[i];
          if (responsiveCondition[breakpoint] !== undefined) {
            isActive = !!responsiveCondition[breakpoint];
          }
        }
        
        if (isActive) {
          activeClasses.push(className);
        }
      }
    });
    
    return activeClasses.join(' ');
  }, [classMap, currentBreakpoint]);
}
