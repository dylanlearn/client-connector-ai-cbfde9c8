
// Export wireframe API service
import wireframeApiService from './api/wireframe-api-service';
import { wireframeGenerator, generateWireframe, generateWireframeFromPrompt, generateWireframeVariation } from './api';

export {
  wireframeApiService,
  wireframeGenerator,
  generateWireframe,
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
