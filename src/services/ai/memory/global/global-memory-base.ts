
interface GlobalMemory {
  id: string;
  content: string;
  category: string;
  relevance_score: number;
  frequency: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const GlobalMemoryBase = {
  /**
   * Maps raw data from the database to a GlobalMemory object
   */
  mapToGlobalMemory: (raw: any): GlobalMemory => {
    return {
      id: raw.id || '',
      content: raw.content || '',
      category: raw.category || 'unknown',
      relevance_score: typeof raw.relevance_score === 'number' ? raw.relevance_score : 0.5,
      frequency: typeof raw.frequency === 'number' ? raw.frequency : 1,
      timestamp: raw.timestamp || new Date().toISOString(),
      metadata: raw.metadata || {}
    };
  },
  
  /**
   * Get a list of supported memory categories
   */
  getCategories: (): string[] => {
    return [
      'design_patterns',
      'user_preferences',
      'interaction_patterns',
      'content_preferences',
      'workflow_patterns'
    ];
  }
};
