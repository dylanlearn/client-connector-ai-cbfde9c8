
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
