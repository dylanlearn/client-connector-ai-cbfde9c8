
import { 
  WireframeData,
  WireframeSection,
  WireframeComponent,
  WireframeGenerationParams,
  WireframeGenerationResult
} from './wireframe-types';

/**
 * Interface for wireframe generation service
 */
export interface WireframeGenerationService {
  generateWireframe(params: WireframeGenerationParams): Promise<WireframeGenerationResult>;
  generateVariation?(baseWireframe: WireframeData, options?: any): Promise<WireframeGenerationResult>;
  validateWireframe?(wireframe: WireframeData): Promise<{ isValid: boolean; errors?: string[]; warnings?: string[] }>;
}

/**
 * Interface for advanced wireframe generation service
 */
export interface AdvancedWireframeGenerationService extends WireframeGenerationService {
  applyFeedback(wireframe: WireframeData, feedback: string): Promise<WireframeGenerationResult>;
  enhanceWireframe?(wireframe: WireframeData, options?: any): Promise<WireframeGenerationResult>;
}

/**
 * Interface for wireframe validation result
 */
export interface WireframeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Interface for wireframe validation service
 */
export interface WireframeValidationService {
  validateWireframe(wireframe: WireframeData): Promise<WireframeValidationResult>;
  validateSection?(section: WireframeSection): Promise<WireframeValidationResult>;
  validateComponent?(component: WireframeComponent): Promise<WireframeValidationResult>;
}

/**
 * Interface for error details
 */
export interface ErrorDetails {
  message: string;
  code?: string;
  field?: string;
  value?: any;
}

/**
 * Interface for service error
 */
export interface ServiceError {
  message: string;
  details?: ErrorDetails[];
  stack?: string;
  originalError?: unknown;
}

/**
 * Service response wrapper
 */
export interface ServiceResponse<T> {
  data?: T;
  success: boolean;
  error?: ServiceError;
  warnings?: string[];
  metadata?: Record<string, any>;
}
