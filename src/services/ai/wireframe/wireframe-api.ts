
// Export wireframe API service
import wireframeApiService from './api/wireframe-api-service';
import { wireframeGenerator } from './api/wireframe-generator';

export {
  wireframeApiService,
  wireframeGenerator,
};

// Expose the generateWireframe function directly for convenience
export const generateWireframe = wireframeGenerator.generateWireframe;

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
