
// Export all AI services for easy imports
export * from './ai-analyzer-service';
export * from './ai-generator-service';
export * from './ai-summary-service';
export * from './ai-memory-service';
export * from './ai-model-selector';

// Export nested service directories
export * from './analytics';
export * from './content';

// Import design namespace instead of re-exporting everything
// This avoids the PatternRecognitionOptions conflict
import * as design from './design';
export { design };

// Export other modules
export * from './summary';
export * from './memory';
