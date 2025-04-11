
export interface WireframeGenerationRequest {
  userInput?: string;
  styleToken?: string;
  colorScheme?: string | Object;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  industry?: string;
  baseWireframe?: any;
  isVariation?: boolean;
}

export interface WireframeGenerationResponse {
  success: boolean;
  wireframe?: any;
  model?: string;
  intentData?: any;
  blueprint?: any;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  generationTime?: number;
  error?: string;
  errorType?: string;
  errorDetails?: string;
}
