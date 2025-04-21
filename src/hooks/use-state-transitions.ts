
import { useState, useCallback, useEffect } from 'react';
import { ComponentState } from '@/contexts/VisualStateContext';

export interface TransitionOptions {
  duration?: number;       // Transition duration in ms
  delay?: number;          // Transition delay in ms
  timing?: string;         // Timing function (ease, linear, etc.)
  property?: string;       // CSS property to transition (all, transform, etc.)
  initialState?: ComponentState; // Initial state for the component
  autoPlayStates?: boolean;      // Auto play through states
  autoPlayDuration?: number;     // Duration between state changes when auto playing
}

export interface TransitionValues {
  duration: number;
  delay: number;
  timing: string;
  property: string;
  cssString: string;       // Complete CSS transition string
}

export function useStateTransitions(options?: TransitionOptions) {
  const {
    duration = 300,
    delay = 0,
    timing = 'ease',
    property = 'all',
    initialState = 'default',
    autoPlayStates = false,
    autoPlayDuration = 2000
  } = options || {};
  
  // Current state and transition values
  const [currentState, setCurrentState] = useState<ComponentState>(initialState);
  const [transitionValues, setTransitionValues] = useState<TransitionValues>({
    duration,
    delay,
    timing,
    property,
    cssString: `${property} ${duration}ms ${timing} ${delay}ms`
  });
  
  // History of states for animation timeline
  const [stateHistory, setStateHistory] = useState<Array<{ state: ComponentState, timestamp: number }>>([
    { state: initialState, timestamp: Date.now() }
  ]);
  
  // Update transitions when options change
  useEffect(() => {
    setTransitionValues({
      duration,
      delay,
      timing,
      property,
      cssString: `${property} ${duration}ms ${timing} ${delay}ms`
    });
  }, [duration, delay, timing, property]);
  
  // Autoplay states
  useEffect(() => {
    if (!autoPlayStates) return;
    
    const states: ComponentState[] = ['default', 'hover', 'active', 'focus', 'disabled'];
    let currentIndex = states.indexOf(currentState);
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % states.length;
      setCurrentState(states[currentIndex]);
    }, autoPlayDuration);
    
    return () => clearInterval(interval);
  }, [autoPlayStates, autoPlayDuration, currentState]);
  
  // Update state history when state changes
  useEffect(() => {
    setStateHistory(prev => [
      ...prev, 
      { state: currentState, timestamp: Date.now() }
    ].slice(-10)); // Keep only last 10 state changes
  }, [currentState]);
  
  // Change component state
  const changeState = useCallback((state: ComponentState) => {
    setCurrentState(state);
  }, []);
  
  // Update transition settings
  const updateTransition = useCallback((updates: Partial<TransitionValues>) => {
    setTransitionValues(prev => {
      const newValues = { ...prev, ...updates };
      return {
        ...newValues,
        cssString: `${newValues.property} ${newValues.duration}ms ${newValues.timing} ${newValues.delay}ms`
      };
    });
  }, []);
  
  // Generate transition style object
  const getTransitionStyles = useCallback(() => {
    return {
      transition: transitionValues.cssString
    };
  }, [transitionValues.cssString]);
  
  // Reset history and state
  const resetStateHistory = useCallback(() => {
    setStateHistory([{ state: initialState, timestamp: Date.now() }]);
    setCurrentState(initialState);
  }, [initialState]);
  
  return {
    currentState,
    changeState,
    transitionValues,
    updateTransition,
    getTransitionStyles,
    stateHistory,
    resetStateHistory
  };
}
