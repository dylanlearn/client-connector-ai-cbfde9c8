
import { Blueprint } from "./blueprint-generator.ts";

/**
 * Request interface for wireframe generation
 */
export interface WireframeGenerationRequest {
  action: "generate-wireframe";
  userInput: string;
  styleToken?: string;
  colorScheme?: Record<string, string> | string;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  industry?: string;
  baseWireframe?: any;
  isVariation?: boolean;
  cacheKey?: string;
}

/**
 * Response interface for successful wireframe generation
 */
export interface WireframeGenerationSuccessResponse {
  success: true;
  wireframe: Blueprint;
  intentData: any;
  blueprint: Blueprint;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  generationTime: number;
}

/**
 * Response interface for failed wireframe generation
 */
export interface WireframeGenerationErrorResponse {
  success: false;
  error: string;
  errorType: string;
  errorDetails: string;
}

/**
 * Combined response type
 */
export type WireframeGenerationResponse = WireframeGenerationSuccessResponse | WireframeGenerationErrorResponse;

/**
 * Request interface for suggestion generation
 */
export interface SuggestionGenerationRequest {
  action: "generate-suggestions";
  wireframe: any;
  sections?: any[];
  targetSection?: string;
}

/**
 * Response interface for successful suggestion generation
 */
export interface SuggestionGenerationSuccessResponse {
  success: true;
  suggestions: Array<{
    title: string;
    description: string;
    previewCode: string;
    justification: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Response interface for failed suggestion generation
 */
export interface SuggestionGenerationErrorResponse {
  success: false;
  error: string;
  errorType: string;
  errorDetails: string;
}

/**
 * Combined response type for suggestions
 */
export type SuggestionGenerationResponse = SuggestionGenerationSuccessResponse | SuggestionGenerationErrorResponse;
