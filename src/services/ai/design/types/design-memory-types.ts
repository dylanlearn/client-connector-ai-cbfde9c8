
/**
 * Types for design memory system
 */

export interface DesignMemoryEntry {
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  tags: string[];
  source_url?: string;
  image_url?: string;
  visual_elements: {
    layout?: string;
    color_scheme?: string;
    typography?: string;
    spacing?: string;
    imagery?: string;
  };
  color_scheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  typography?: {
    headings?: string;
    body?: string;
    accent?: string;
    size_scale?: string;
  };
  layout_pattern?: {
    type?: string;
    grid?: string;
    responsive?: boolean;
    components?: string[];
  };
  relevance_score?: number;
}

export interface DesignMemoryQueryOptions {
  category?: string;
  subcategory?: string;
  tags?: string[];
  search_term?: string;
  relevance_threshold?: number;
  limit?: number;
  timeframe?: {
    from?: Date;
    to?: Date;
  };
}
