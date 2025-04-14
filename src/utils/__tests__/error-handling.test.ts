import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createErrorHandler, 
  safeExecute, 
  withErrorHandling, 
  safeExecuteAsync, 
  withAsyncErrorHandling,
  parseError
} from '../error-handling';
import { logError } from '../monitoring/client-error-logger';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

vi.mock('../monitoring/client-error-logger', () => ({
  logError: vi.fn()
}));

describe('Error handling utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createErrorHandler', () => {
    it('should create an error handler that logs and shows toast', () => {
      const handler = createErrorHandler('TestComponent', 'user123');
      const error = new Error('Test error');
      
      handler(error);
      
      expect(logError).toHaveBeenCalledWith(
        error,
        'TestComponent',
        'user123'
      );
      
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred",
        expect.objectContaining({
          description: "Our team has been notified"
        })
      );
    });
    
    it('should convert non-Error objects to Error', () => {
      const handler = createErrorHandler('TestComponent');
      
      handler('string error');
      
      expect(logError).toHaveBeenCalledWith(
        expect.any(String),
        'TestComponent',
        undefined
      );
    });
  });
  
  describe('safeExecute', () => {
    it('should execute function and return its result when no error occurs', () => {
      const fn = (a: number, b: number) => a + b;
      const errorHandler = vi.fn();
      
      const result = safeExecute(fn, errorHandler, 2, 3);
      
      expect(result).toBe(5);
      expect(errorHandler).not.toHaveBeenCalled();
    });
    
    it('should call error handler and return undefined when error occurs', () => {
      const fn = () => { throw new Error('Test error'); };
      const errorHandler = vi.fn();
      
      const result = safeExecute(fn, errorHandler);
      
      expect(result).toBeUndefined();
      expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
    });
  });
  
  describe('withErrorHandling', () => {
    it('should return wrapped function that handles errors', () => {
      const fn = (message: string): string => {
        if (message === 'error') throw new Error('Test error');
        return `Hello, ${message}`;
      };
      
      const wrapped = withErrorHandling(fn, 'TestComponent');
      
      expect(wrapped('world')).toBe('Hello, world');
      expect(logError).not.toHaveBeenCalled();
      
      expect(wrapped('error')).toBeUndefined();
      expect(logError).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('safeExecuteAsync', () => {
    it('should await function and return its result when no error occurs', async () => {
      const fn = async (a: number, b: number) => a + b;
      const errorHandler = vi.fn();
      
      const result = await safeExecuteAsync(fn, errorHandler, 2, 3);
      
      expect(result).toBe(5);
      expect(errorHandler).not.toHaveBeenCalled();
    });
    
    it('should call error handler and return undefined when error occurs', async () => {
      const fn = async () => { throw new Error('Test error'); };
      const errorHandler = vi.fn();
      
      const result = await safeExecuteAsync(fn, errorHandler);
      
      expect(result).toBeUndefined();
      expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
    });
  });
  
  describe('withAsyncErrorHandling', () => {
    it('should return wrapped async function that handles errors', async () => {
      const fn = async (message: string): Promise<string> => {
        if (message === 'error') throw new Error('Test error');
        return `Hello, ${message}`;
      };
      
      const wrapped = withAsyncErrorHandling(fn, 'TestComponent');
      
      expect(await wrapped('world')).toBe('Hello, world');
      expect(logError).not.toHaveBeenCalled();
      
      expect(await wrapped('error')).toBeUndefined();
      expect(logError).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('parseError', () => {
    it('should parse Error objects correctly', () => {
      const error = new Error('Test error');
      const parsed = parseError(error);
      
      expect(parsed.message).toBe('Test error');
      expect(parsed.details).toHaveProperty('name', 'Error');
      expect(parsed.details).toHaveProperty('stack');
      expect(parsed.originalError).toBe(error);
    });
    
    it('should parse string errors', () => {
      const parsed = parseError('Test error string');
      
      expect(parsed.message).toBe('Test error string');
      expect(parsed.details).toBeUndefined();
    });
  });
});
