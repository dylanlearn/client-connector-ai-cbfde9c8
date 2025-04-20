
import React, { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useVisualState, ComponentState } from '@/contexts/VisualStateContext';

export interface StatefulComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  defaultStyles?: string;
  hoverStyles?: string;
  activeStyles?: string;
  focusStyles?: string;
  disabledStyles?: string;
  forceState?: ComponentState;
  showTransition?: boolean;
}

/**
 * A component wrapper that applies appropriate visual styles based on current state
 * Can be forced into a specific state or respond to the global preview state
 */
const StatefulComponent = forwardRef<HTMLDivElement, StatefulComponentProps>(
  (
    {
      children,
      className,
      defaultStyles = '',
      hoverStyles = '',
      activeStyles = '',
      focusStyles = '',
      disabledStyles = '',
      forceState,
      showTransition = true,
      ...props
    },
    ref
  ) => {
    const {
      previewState,
      transitionDuration,
      transitionTimingFunction,
      transitionDelay,
    } = useVisualState();

    // Use the forced state if provided, otherwise use the global preview state
    const currentState = forceState || previewState;

    // Determine which styles to apply based on the current state
    const stateStyles = {
      default: defaultStyles,
      hover: hoverStyles,
      active: activeStyles,
      focus: focusStyles,
      disabled: disabledStyles,
    };

    // Apply transition styles if showTransition is true
    const transitionStyles = showTransition
      ? {
          transitionProperty: 'all',
          transitionDuration: `${transitionDuration}ms`,
          transitionTimingFunction,
          transitionDelay: `${transitionDelay}ms`,
        }
      : {};

    return (
      <div
        ref={ref}
        className={cn(defaultStyles, stateStyles[currentState], className)}
        style={transitionStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StatefulComponent.displayName = 'StatefulComponent';
export default StatefulComponent;
