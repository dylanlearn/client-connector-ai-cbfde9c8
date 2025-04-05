
import { InteractionConfig } from './types';
import { getBasicInteractionConfig } from './basicInteractions';
import { getAdvancedInteractionConfig } from './advancedInteractions';
import { getComplexInteractionConfig } from './complexInteractions';

/**
 * Main function to get interaction configuration based on interaction type
 */
export const getInteractionConfig = (
  interactionType: string,
  isActive: boolean,
  cursorPosition: { x: number, y: number }
): InteractionConfig => {
  
  // Check basic interactions (1-5)
  if (interactionType.startsWith('interaction-') && 
      parseInt(interactionType.split('-')[1]) <= 5) {
    return getBasicInteractionConfig(interactionType, isActive, cursorPosition);
  }
  
  // Check advanced interactions (7-10)
  if (interactionType === 'interaction-7' || 
      interactionType === 'interaction-8' ||
      interactionType === 'interaction-9' ||
      interactionType === 'interaction-10') {
    return getAdvancedInteractionConfig(interactionType, isActive, cursorPosition);
  }
  
  // Check complex interactions (11-13)
  if (interactionType === 'interaction-11' || 
      interactionType === 'interaction-12' ||
      interactionType === 'interaction-13') {
    return getComplexInteractionConfig(interactionType, isActive);
  }
  
  // Default empty config if no match
  return {};
};

// Re-export types
export * from './types';
