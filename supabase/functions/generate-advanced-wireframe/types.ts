
/**
 * Interface for wireframe generation request parameters
 */
export interface WireframeGenerationRequest {
  userInput: string;
  styleToken?: string;
  colorScheme?: any;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  industry?: string;
  baseWireframe?: any;
  isVariation?: boolean;
  intakeData?: any;
}

/**
 * Interface for wireframe generation response
 */
export interface WireframeGenerationResponse {
  success: boolean;
  wireframe?: any;
  model?: string;
  intentData?: any;
  blueprint?: any;
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
  error?: string;
  errorType?: string;
  errorDetails?: string;
  generationTime?: number;
}

/**
 * Interface for design suggestion input
 */
export interface SuggestionRequest {
  wireframe: any;
  sections?: any[];
  targetSection?: string;
}

/**
 * Interface for design suggestion
 */
export interface DesignSuggestion {
  title: string;
  description: string;
  preview?: any;
  justification?: string;
  sectionId?: string;
  changes?: any;
}

/**
 * Interface for design suggestion response
 */
export interface SuggestionResponse {
  success: boolean;
  suggestions?: DesignSuggestion[];
  error?: string;
  errorType?: string;
  errorDetails?: string;
}
