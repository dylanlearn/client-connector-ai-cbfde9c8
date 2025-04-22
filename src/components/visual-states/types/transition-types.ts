
export type TransitionState = 'initial' | 'active' | 'hover' | 'focus' | 'disabled' | 'loading';

export interface TransitionDependency {
  fromState: TransitionState;
  toState: TransitionState;
  condition?: string;
  delay?: number;
}

export interface TransitionConfig {
  id: string;
  name: string;
  duration: number;
  timing: string;
  dependencies: TransitionDependency[];
  active: boolean;
}

export interface TransitionPreset {
  id: string;
  name: string;
  config: TransitionConfig;
}

export interface TransitionGroup {
  id: string;
  name: string;
  transitions: TransitionConfig[];
}
