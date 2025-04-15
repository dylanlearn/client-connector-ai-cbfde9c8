
// Export the main service
export { wireframeService, default } from './wireframe-service';

// Export types
export * from './wireframe-types';

// Export utility functions for validation and helpers
export { isWireframeData } from './wireframe-types';

// Legacy exports for backward compatibility
export { CoreWireframeService } from './core-wireframe-service';
export { unifiedWireframeService } from './unified-wireframe-service';
export { EnhancedWireframeGenerator } from './enhanced-wireframe-generator';
