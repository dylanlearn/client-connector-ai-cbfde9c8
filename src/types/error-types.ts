
/**
 * Standardized error types for consistent error handling across the application
 */

/**
 * Base error interface with common properties for all errors
 */
export interface BaseError {
  message: string;
  code?: string;
  timestamp?: string;
  context?: Record<string, unknown>;
}

/**
 * Standard error response for all API operations
 */
export interface ErrorResponse extends BaseError {
  status?: number;
  path?: string;
  requestId?: string;
  traceId?: string;
}

/**
 * Application domain-specific error types
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHORIZATION = 'AUTHORIZATION',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT = 'RATE_LIMIT',
  INTERNAL = 'INTERNAL',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Wireframe generation specific error types
 */
export enum WireframeErrorType {
  INVALID_PARAMS = 'INVALID_PARAMS',
  GENERATION_FAILED = 'GENERATION_FAILED',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  CONTENT_VIOLATION = 'CONTENT_VIOLATION',
  STORAGE_ERROR = 'STORAGE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

/**
 * Type for structured error details to provide more context
 */
export interface ErrorDetails {
  code: string;
  field?: string;
  value?: any;
  details?: string;
}

/**
 * Enhanced application error with additional context and typing
 */
export class AppError extends Error implements BaseError {
  code: string;
  timestamp: string;
  context?: Record<string, unknown>;
  details?: ErrorDetails[];
  type: ErrorType;
  
  constructor(
    message: string, 
    type: ErrorType = ErrorType.UNKNOWN,
    code: string = 'ERR_UNKNOWN',
    context?: Record<string, unknown>,
    details?: ErrorDetails[]
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.type = type;
    this.timestamp = new Date().toISOString();
    this.context = context;
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
  
  /**
   * Converts the error to a format suitable for API responses
   */
  toResponse(): ErrorResponse {
    return {
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
      context: this.context,
    };
  }
  
  /**
   * Creates a validation error
   */
  static validation(message: string, details?: ErrorDetails[]): AppError {
    return new AppError(
      message,
      ErrorType.VALIDATION,
      'ERR_VALIDATION',
      { validationFailed: true },
      details
    );
  }
  
  /**
   * Creates a network error
   */
  static network(message: string, context?: Record<string, unknown>): AppError {
    return new AppError(
      message,
      ErrorType.NETWORK,
      'ERR_NETWORK',
      context
    );
  }
  
  /**
   * Creates a not found error
   */
  static notFound(resource: string, id?: string): AppError {
    return new AppError(
      `Resource ${resource}${id ? ` with ID ${id}` : ''} not found`,
      ErrorType.RESOURCE_NOT_FOUND,
      'ERR_NOT_FOUND',
      { resource, id }
    );
  }
}

/**
 * Specialized error for wireframe operations
 */
export class WireframeError extends AppError {
  wireframeErrorType: WireframeErrorType;
  
  constructor(
    message: string,
    wireframeErrorType: WireframeErrorType,
    context?: Record<string, unknown>
  ) {
    super(
      message,
      wireframeErrorType === WireframeErrorType.INVALID_PARAMS ? ErrorType.VALIDATION : ErrorType.INTERNAL,
      `ERR_WIREFRAME_${wireframeErrorType}`,
      context
    );
    this.name = 'WireframeError';
    this.wireframeErrorType = wireframeErrorType;
  }
  
  /**
   * Creates an error for invalid wireframe parameters
   */
  static invalidParams(message: string, fieldErrors?: Record<string, string>): WireframeError {
    return new WireframeError(
      message,
      WireframeErrorType.INVALID_PARAMS,
      { fieldErrors }
    );
  }
  
  /**
   * Creates an error for failed wireframe generation
   */
  static generationFailed(message: string, context?: Record<string, unknown>): WireframeError {
    return new WireframeError(
      message,
      WireframeErrorType.GENERATION_FAILED,
      context
    );
  }
}
