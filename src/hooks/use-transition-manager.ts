
import { useState, useCallback } from 'react';
import { TransitionConfig, TransitionState, TransitionDependency } from '@/components/visual-states/types/transition-types';

export function useTransitionManager(initialTransitions: TransitionConfig[] = []) {
  const [transitions, setTransitions] = useState<TransitionConfig[]>(initialTransitions);
  const [currentState, setCurrentState] = useState<TransitionState>('initial');

  const addTransition = useCallback((transition: Omit<TransitionConfig, 'id'>) => {
    const newTransition: TransitionConfig = {
      ...transition,
      id: crypto.randomUUID(),
      active: true
    };
    setTransitions(prev => [...prev, newTransition]);
  }, []);

  const updateTransition = useCallback((id: string, updates: Partial<TransitionConfig>) => {
    setTransitions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }, []);

  const removeTransition = useCallback((id: string) => {
    setTransitions(prev => prev.filter(t => t.id !== id));
  }, []);

  const canTransition = useCallback((fromState: TransitionState, toState: TransitionState) => {
    return transitions.some(t => 
      t.active && t.dependencies.some(d => 
        d.fromState === fromState && 
        d.toState === toState
      )
    );
  }, [transitions]);

  const getTransitionStyle = useCallback((currentState: TransitionState) => {
    const activeTransitions = transitions.filter(t => t.active);
    if (!activeTransitions.length) return {};

    return {
      transition: activeTransitions
        .map(t => `all ${t.duration}ms ${t.timing}`)
        .join(', ')
    };
  }, [transitions]);

  return {
    transitions,
    currentState,
    addTransition,
    updateTransition,
    removeTransition,
    canTransition,
    getTransitionStyle,
    setCurrentState
  };
}
