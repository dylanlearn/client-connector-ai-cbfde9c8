
// Export wireframe API service
import { WireframeApiService } from './api/wireframe-api-service';
import { wireframeGenerator } from './api/wireframe-generator';

export {
  WireframeApiService,
  wireframeGenerator,
};

// Expose the generateWireframe function directly for convenience
export const generateWireframe = wireframeGenerator.generateWireframe;

// Re-export types from wireframe-types.ts
export type {
  WireframeGenerationParams,
  WireframeGenerationResult,
  AIWireframe,
  WireframeData,
  WireframeSection,
  WireframeComponent,
  CopySuggestions
} from './wireframe-types';
