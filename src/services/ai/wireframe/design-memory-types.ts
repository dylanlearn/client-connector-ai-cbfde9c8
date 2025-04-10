
/**
 * Types for design memory functionality
 */

export interface DesignMemoryData {
  projectId?: string;
  wireframeId?: string;
  designTokens?: Record<string, any>;
  colorScheme?: Record<string, string>;
  typography?: Record<string, any>;
  stylePreferences?: string[];
  componentLibrary?: Record<string, any>;
  userFeedback?: string[];
  designHistory?: Array<{
    timestamp: string;
    action: string;
    details: any;
  }>;
  [key: string]: any;
}

export interface DesignMemoryResponse {
  success: boolean;
  data?: DesignMemoryData;
  error?: string;
}
