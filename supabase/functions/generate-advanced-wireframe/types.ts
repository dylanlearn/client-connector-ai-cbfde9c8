
/**
 * Common Wireframe Types for the Edge Function
 */

/**
 * Request parameters for wireframe generation
 */
export interface WireframeGenerationRequest {
  userInput: string;
  projectId?: string;
  styleToken?: string;
  colorScheme?: string | Record<string, string>;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  industry?: string;
  includeDesignMemory?: boolean;
  baseWireframe?: any;
  isVariation?: boolean;
  variationIndex?: number;
  [key: string]: any;
}

/**
 * Response type for wireframe generation
 */
export interface WireframeGenerationResponse {
  success: boolean;
  wireframe?: any;
  intentData?: any;
  blueprint?: any;
  model?: string;
  usage?: any;
  error?: string;
  errorType?: string;
  errorDetails?: string;
}

/**
 * CORS Headers for Edge Function
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Required section types that should be present in a complete wireframe
 */
export const REQUIRED_SECTION_TYPES = [
  'navigation',
  'hero', 
  'features', 
  'testimonials', 
  'pricing', 
  'cta', 
  'footer'
];
