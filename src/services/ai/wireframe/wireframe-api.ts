
// Export wireframe API service
import wireframeApiService from './api/wireframe-api-service';
import { 
  wireframeGenerator, 
  generateWireframe as baseGenerateWireframe,
  generateWireframeFromPrompt, 
  generateWireframeVariation 
} from './api';

export {
  wireframeApiService,
  wireframeGenerator,
  // Export the base generator function with a clear name
  baseGenerateWireframe,
  generateWireframeFromPrompt,
  generateWireframeVariation
};

// Re-export types from wireframe-types.ts with 'export type'
export type {
  WireframeGenerationParams,
  WireframeGenerationResult,
  AIWireframe,
  WireframeData,
  WireframeSection,
  WireframeComponent,
  CopySuggestions
} from './wireframe-types';
