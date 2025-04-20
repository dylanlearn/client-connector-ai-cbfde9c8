
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type ComponentState = 'default' | 'hover' | 'active' | 'focus' | 'disabled';

interface VisualStateContextType {
  previewState: ComponentState;
  setPreviewState: (state: ComponentState) => void;
  transitionDuration: number;
  setTransitionDuration: (duration: number) => void;
  transitionTimingFunction: string;
  setTransitionTimingFunction: (timing: string) => void;
  transitionDelay: number;
  setTransitionDelay: (delay: number) => void;
}

const VisualStateContext = createContext<VisualStateContextType | undefined>(undefined);

export const useVisualState = () => {
  const context = useContext(VisualStateContext);
  if (!context) {
    throw new Error('useVisualState must be used within a VisualStateProvider');
  }
  return context;
};

interface VisualStateProviderProps {
  children: ReactNode;
}

export const VisualStateProvider = ({ children }: VisualStateProviderProps) => {
  const [previewState, setPreviewState] = useState<ComponentState>('default');
  const [transitionDuration, setTransitionDuration] = useState<number>(300);
  const [transitionTimingFunction, setTransitionTimingFunction] = useState<string>('ease');
  const [transitionDelay, setTransitionDelay] = useState<number>(0);

  const value = {
    previewState,
    setPreviewState,
    transitionDuration,
    setTransitionDuration,
    transitionTimingFunction,
    setTransitionTimingFunction,
    transitionDelay,
    setTransitionDelay
  };

  return (
    <VisualStateContext.Provider value={value}>
      {children}
    </VisualStateContext.Provider>
  );
};
