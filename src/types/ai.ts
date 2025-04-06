
/**
 * Base AI memory interface
 */
export interface AIMemory {
  content: string;
  category: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Global memory interface
 */
export interface GlobalMemory {
  content: string;
  category: string;
  relevanceScore: number;
  frequency: number;
}
