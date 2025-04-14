
import { AIMemory, GlobalMemory } from '@/types/ai';

/**
 * Memory categories for user, project, and global memories
 */
export enum MemoryCategory {
  DesignPreference = 'DesignPreference',
  TonePreference = 'TonePreference',
  InteractionPattern = 'InteractionPattern',
  LayoutPreference = 'LayoutPreference',
  ColorPreference = 'ColorPreference',
  ProjectContext = 'ProjectContext',
  ClientFeedback = 'ClientFeedback',
  SuccessfulOutput = 'SuccessfulOutput'
}

/**
 * Options for querying memories
 */
export interface MemoryQueryOptions {
  categories?: MemoryCategory[];
  limit?: number;
  timeframe?: {
    from?: Date;
    to?: Date;
  };
  metadata?: Record<string, any>;
  relevanceThreshold?: number;
}

/**
 * User-specific memory model
 */
export interface UserMemory extends AIMemory {
  id: string;
  userId: string;
}

/**
 * Project-specific memory model
 */
export interface ProjectMemory extends AIMemory {
  id: string;
  projectId: string;
  userId: string;
}

/**
 * Global anonymous memory model 
 */
export interface GlobalMemoryType extends GlobalMemory {
  id: string;
  timestamp: Date;
}

// Re-export GlobalMemoryType as GlobalMemory for backward compatibility
export type { GlobalMemory };
