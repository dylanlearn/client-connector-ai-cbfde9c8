
/**
 * Interface for error responses from APIs or service calls
 */
export interface ErrorResponse {
  message: string;
  code?: string | number;
  context?: {
    stack?: string | symbol;
    [key: string]: any;
  };
  timestamp?: string;
  [key: string]: any;
}

/**
 * Interface for API error responses
 */
export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: string[] | Record<string, string[]>;
}

/**
 * Interface for validation error responses
 */
export interface ValidationErrorResponse {
  field: string;
  message: string;
  code?: string;
}

/**
 * Interface for error context
 */
export interface ErrorContext {
  source: string;
  operation: string;
  details?: any;
  timestamp: string;
}

/**
 * Enum for error types
 */
export enum ErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER_ERROR = 'server_error',
  API_ERROR = 'api_error',
  UNKNOWN = 'unknown'
}

/**
 * Enum for wireframe error types
 */
export enum WireframeErrorType {
  VALIDATION_ERROR = 'validation_error',
  GENERATION_FAILED = 'generation_failed',
  INVALID_PARAMS = 'invalid_params',
  EXPORT_FAILED = 'export_failed',
  RENDERING_ERROR = 'rendering_error',
  UNKNOWN = 'unknown'
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  type: ErrorType;
  code: string;
  context?: Record<string, any>;
  
  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code: string = 'ERR_UNKNOWN',
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.context = context;
    
    // Ensure prototype chain is properly maintained
    Object.setPrototypeOf(this, AppError.prototype);
  }
  
  /**
   * Creates an error response object from this error
   */
  toResponse(): ErrorResponse {
    return {
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
  
  /**
   * Factory method for creating validation errors
   */
  static validation(message: string, validationErrors?: Array<{ field: string; code: string; details?: string }>): AppError {
    return new AppError(
      message,
      ErrorType.VALIDATION,
      'VALIDATION_ERROR',
      { validationErrors: validationErrors || [], fieldErrors: validationErrors ? 
        Object.fromEntries(validationErrors.map(err => [err.field, err.details || err.code])) : {} 
      }
    );
  }
  
  /**
   * Factory method for creating authentication errors
   */
  static authentication(message: string = 'Authentication required'): AppError {
    return new AppError(message, ErrorType.AUTHENTICATION, 'AUTH_REQUIRED');
  }
  
  /**
   * Factory method for creating authorization errors
   */
  static authorization(message: string = 'You do not have permission to perform this action'): AppError {
    return new AppError(message, ErrorType.AUTHORIZATION, 'FORBIDDEN');
  }
  
  /**
   * Factory method for creating not found errors
   */
  static notFound(entity: string, id?: string): AppError {
    const message = id ? `${entity} with ID ${id} not found` : `${entity} not found`;
    return new AppError(message, ErrorType.NOT_FOUND, 'NOT_FOUND');
  }
  
  /**
   * Factory method for creating server errors
   */
  static server(message: string = 'Internal server error'): AppError {
    return new AppError(message, ErrorType.SERVER_ERROR, 'SERVER_ERROR');
  }
  
  /**
   * Factory method for creating API errors
   */
  static api(message: string, statusCode: number): AppError {
    return new AppError(message, ErrorType.API_ERROR, `API_${statusCode}`, { statusCode });
  }
}

/**
 * Custom error class for Wireframe-specific errors
 */
export class WireframeError extends Error {
  type: WireframeErrorType;
  context?: Record<string, any>;
  
  constructor(
    message: string,
    type: WireframeErrorType = WireframeErrorType.UNKNOWN,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'WireframeError';
    this.type = type;
    this.context = context;
    
    // Ensure prototype chain is properly maintained
    Object.setPrototypeOf(this, WireframeError.prototype);
  }
  
  /**
   * Creates a validation error for wireframe data
   */
  static validation(message: string, fieldErrors?: Record<string, string>): WireframeError {
    return new WireframeError(message, WireframeErrorType.VALIDATION_ERROR, { fieldErrors });
  }
  
  /**
   * Creates a generation error for wireframe creation
   */
  static generationFailed(message: string, details?: any): WireframeError {
    return new WireframeError(message, WireframeErrorType.GENERATION_FAILED, { details });
  }
}
