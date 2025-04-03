
// Types for design memory service
export interface DesignMemoryEntry {
  id?: string;
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  visual_elements: Record<string, any>;
  color_scheme?: Record<string, any>;
  typography?: Record<string, any>;
  layout_pattern?: Record<string, any>;
  tags: string[];
  source_url?: string;
  image_url?: string;
  relevance_score?: number;
}

export interface DesignMemoryQueryOptions {
  category?: string;
  subcategory?: string;
  tags?: string[];
  searchTerm?: string;
  limit?: number;
  relevanceThreshold?: number;
}

export interface DesignFeedback {
  user_id: string;
  design_suggestion_id: string;
  feedback_type: 'like' | 'dislike' | 'comment';
  feedback_content?: string;
  rating?: number;
  context?: Record<string, any>;
}

export interface DesignSuggestion {
  user_id: string;
  prompt: string;
  result: Record<string, any>;
  used_references?: string[];
  context?: Record<string, any>;
  rating?: number;
}

// Helper function to convert DB response to DesignMemoryEntry
export function mapToDesignMemoryEntry(dbEntry: any): DesignMemoryEntry {
  return {
    id: dbEntry.id,
    category: dbEntry.category,
    subcategory: dbEntry.subcategory,
    title: dbEntry.title,
    description: dbEntry.description,
    visual_elements: dbEntry.visual_elements,
    color_scheme: dbEntry.color_scheme,
    typography: dbEntry.typography,
    layout_pattern: dbEntry.layout_pattern,
    tags: dbEntry.tags || [],
    source_url: dbEntry.source_url,
    image_url: dbEntry.image_url,
    relevance_score: dbEntry.relevance_score
  };
}
