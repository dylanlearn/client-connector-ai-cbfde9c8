
/**
 * Interface for wireframe generation request
 */
export interface WireframeGenerationRequest {
  action?: string;
  userInput: string;
  styleToken?: string;
  colorScheme?: any;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  industry?: string;
  baseWireframe?: any;
  isVariation?: boolean;
  projectId?: string;
  [key: string]: any;
}

/**
 * Interface for successful wireframe generation response
 */
export interface WireframeGenerationSuccess {
  success: true;
  wireframe: any;
  model?: string;
  intentData?: any;
  blueprint?: any;
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
  generationTime?: number;
}

/**
 * Interface for failed wireframe generation response
 */
export interface WireframeGenerationError {
  success: false;
  error: string;
  errorType?: string;
  errorDetails?: string;
}

/**
 * Union type for wireframe generation response
 */
export type WireframeGenerationResponse = WireframeGenerationSuccess | WireframeGenerationError;

/**
 * Interface for wireframe feedback modification request
 */
export interface WireframeFeedbackRequest {
  action: string;
  wireframe: any;
  feedback: string;
  preserveSections?: string[];
  [key: string]: any;
}

/**
 * Interface for successful wireframe feedback modification response
 */
export interface WireframeFeedbackSuccess {
  success: true;
  modifiedWireframe: any;
  changes?: any[];
  changeDescription?: string;
  modifiedSections?: string[];
  addedSections?: any[];
}

/**
 * Interface for failed wireframe feedback modification response
 */
export interface WireframeFeedbackError {
  success: false;
  error: string;
  errorType?: string;
  errorDetails?: string;
}

/**
 * Union type for wireframe feedback modification response
 */
export type WireframeFeedbackResponse = WireframeFeedbackSuccess | WireframeFeedbackError;

/**
 * Interface for wireframe suggestion generation request
 */
export interface WireframeSuggestionRequest {
  action: string;
  wireframe: any;
  sections?: any[];
  targetSection?: string;
  [key: string]: any;
}

/**
 * Interface for successful wireframe suggestion generation response
 */
export interface WireframeSuggestionSuccess {
  success: true;
  suggestions: any[];
}

/**
 * Interface for failed wireframe suggestion generation response
 */
export interface WireframeSuggestionError {
  success: false;
  error: string;
  errorType?: string;
  errorDetails?: string;
}

/**
 * Union type for wireframe suggestion generation response
 */
export type WireframeSuggestionResponse = WireframeSuggestionSuccess | WireframeSuggestionError;
