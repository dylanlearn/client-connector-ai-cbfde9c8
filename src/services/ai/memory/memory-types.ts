
export interface MemoryEntry {
  id: string;
  content: string;
  category: MemoryCategory;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export enum MemoryCategory {
  TonePreference = 'tone_preference',
  LayoutPreference = 'layout_preference',
  ColorPreference = 'color_preference',
  ProjectContext = 'project_context',
  ClientFeedback = 'client_feedback',
  SuccessfulOutput = 'successful_output',
  InteractionPattern = 'interaction_pattern'
}

export interface UserMemory extends MemoryEntry {
  userId: string;
}

export interface ProjectMemory extends MemoryEntry {
  projectId: string;
  userId: string;
}

export interface GlobalMemory extends MemoryEntry {
  // Anonymized data without user identifiers
  frequency: number; // How often this pattern appears
  relevanceScore: number; // How relevant/useful this memory has been
}

export interface MemoryQueryOptions {
  categories?: MemoryCategory[];
  limit?: number;
  relevanceThreshold?: number;
  timeframe?: {
    from?: Date;
    to?: Date;
  };
  metadata?: Record<string, any>;
}
