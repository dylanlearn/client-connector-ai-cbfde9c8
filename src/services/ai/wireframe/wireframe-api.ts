
// Export wireframe API service
import { WireframeApiService } from './api/wireframe-api-service';
import { generateWireframe } from './api/wireframe-generator';

export {
  WireframeApiService,
  generateWireframe,
};

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
