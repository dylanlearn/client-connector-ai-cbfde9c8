
import React from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { cn } from '@/lib/utils';
import { useContainerQuery } from '@/hooks/use-container-query';
import { ResponsiveValue, useResponsiveValue } from './ResponsivePropertyController';

export interface ResponsiveTextProps {
  children: string | React.ReactNode;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  size?: ResponsiveValue<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'> | 
         'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: ResponsiveValue<'normal' | 'medium' | 'semibold' | 'bold'> | 
            'normal' | 'medium' | 'semibold' | 'bold';
  align?: ResponsiveValue<'left' | 'center' | 'right'> | 
           'left' | 'center' | 'right';
  truncate?: boolean | number;
  className?: string;
  containerQuery?: boolean;
}

/**
 * A component that renders responsive text with different sizes at different breakpoints
 */
export function ResponsiveText({
  children,
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  align = 'left',
  truncate = false,
  className,
  containerQuery = false
}: ResponsiveTextProps) {
  const { currentBreakpoint } = useResponsive();
  const [containerRef, containerInfo] = useContainerQuery();
  
  // Use either viewport or container breakpoints
  const activeBreakpoint = containerQuery 
    ? containerInfo.breakpoint 
    : currentBreakpoint;
  
  // Get responsive values
  const responsiveSize = useResponsiveValue(size);
  const responsiveWeight = useResponsiveValue(weight);
  const responsiveAlign = useResponsiveValue(align);
  
  // Map text sizes to Tailwind classes
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
  };
  
  // Map font weights to Tailwind classes
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };
  
  // Map text alignment to Tailwind classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  // Handle truncation
  let truncateClass = '';
  if (truncate === true) {
    truncateClass = 'truncate';
  } else if (typeof truncate === 'number') {
    truncateClass = `line-clamp-${truncate}`;
  }
  
  return (
    <Component
      ref={containerQuery ? containerRef : undefined}
      className={cn(
        sizeClasses[responsiveSize],
        weightClasses[responsiveWeight],
        alignClasses[responsiveAlign],
        truncateClass,
        className
      )}
      data-breakpoint={activeBreakpoint}
    >
      {children}
    </Component>
  );
}

export default ResponsiveText;
