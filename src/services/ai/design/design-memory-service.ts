
import { 
  DesignEntryService,
  DesignFeedbackService,
  DesignSuggestionService
} from './memory';

import { 
  DesignMemoryEntry, 
  DesignMemoryQueryOptions 
} from './types/design-memory-types';

/**
 * Service for managing design memory entries
 */
export const DesignMemoryService = {
  /**
   * Store a new design pattern or example in the memory database
   */
  storeDesignMemory: DesignEntryService.storeDesignMemory,

  /**
   * Query the design memory database based on various criteria
   */
  queryDesignMemory: DesignEntryService.queryDesignMemory,

  /**
   * Record user feedback about design suggestions
   */
  recordFeedback: DesignFeedbackService.recordFeedback,

  /**
   * Store a design suggestion in history
   */
  storeDesignSuggestion: DesignSuggestionService.storeDesignSuggestion,

  /**
   * Rate a stored design suggestion
   */
  rateDesignSuggestion: DesignSuggestionService.rateDesignSuggestion
};

// Re-export types for use throughout the application
export type { 
  DesignMemoryEntry, 
  DesignMemoryQueryOptions 
} from './types/design-memory-types';
