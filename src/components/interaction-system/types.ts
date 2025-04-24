
import { TransitionState } from '../visual-states/types/transition-types';

export interface InteractionDefinition {
  eventType: 'click' | 'hover' | 'focus' | 'blur';
  targetState: TransitionState;
  animation?: string;
  dataEffect?: {
    type: 'update' | 'fetch' | 'submit';
    target: string;
    payload?: any;
  };
}

export interface InteractionHandler {
  execute: (event: Event) => void;
  cleanup: () => void;
}

export interface InteractionConfig {
  definitions: InteractionDefinition[];
  handlers: Record<string, InteractionHandler>;
}
