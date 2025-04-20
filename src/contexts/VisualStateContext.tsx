
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ComponentState = 'default' | 'hover' | 'active' | 'focus' | 'disabled';

export interface VisualStateContextType {
  previewState: ComponentState;
  setPreviewState: (state: ComponentState) => void;
  transitionDuration: number;
  setTransitionDuration: (duration: number) => void;
  transitionTimingFunction: string;
  setTransitionTimingFunction: (timing: string) => void;
  transitionDelay: number;
  setTransitionDelay: (delay: number) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
}

export const VisualStateContext = createContext<VisualStateContextType>({
  previewState: 'default',
  setPreviewState: () => {},
  transitionDuration: 300,
  setTransitionDuration: () => {},
  transitionTimingFunction: 'ease',
  setTransitionTimingFunction: () => {},
  transitionDelay: 0,
  setTransitionDelay: () => {},
  isAnimating: false,
  setIsAnimating: () => {},
});

export interface VisualStateProviderProps {
  children: ReactNode;
  initialState?: ComponentState;
  initialDuration?: number;
  initialTimingFunction?: string;
  initialDelay?: number;
}

/**
 * Provider for managing component visual states across the application.
 * Handles state transitions, animations, and timing configurations.
 */
export const VisualStateProvider: React.FC<VisualStateProviderProps> = ({
  children,
  initialState = 'default',
  initialDuration = 300,
  initialTimingFunction = 'ease',
  initialDelay = 0
}) => {
  const [previewState, setPreviewState] = useState<ComponentState>(initialState);
  const [transitionDuration, setTransitionDuration] = useState(initialDuration);
  const [transitionTimingFunction, setTransitionTimingFunction] = useState(initialTimingFunction);
  const [transitionDelay, setTransitionDelay] = useState(initialDelay);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <VisualStateContext.Provider
      value={{
        previewState,
        setPreviewState,
        transitionDuration,
        setTransitionDuration,
        transitionTimingFunction,
        setTransitionTimingFunction,
        transitionDelay,
        setTransitionDelay,
        isAnimating,
        setIsAnimating
      }}
    >
      {children}
    </VisualStateContext.Provider>
  );
};

/**
 * Hook for consuming the Visual State Context.
 * Provides access to state management functions and current visual states.
 */
export const useVisualState = () => {
  const context = useContext(VisualStateContext);
  if (context === undefined) {
    throw new Error('useVisualState must be used within a VisualStateProvider');
  }
  return context;
};
