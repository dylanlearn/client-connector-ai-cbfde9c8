
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ClientErrorLogger, logError } from '../client-error-logger';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
  }
}));

describe('ClientErrorLogger', () => {
  beforeEach(() => {
    // Clean up before each test
    if (typeof ClientErrorLogger.cleanup === 'function') {
      ClientErrorLogger.cleanup();
    }
    
    // Reset mocks
    vi.resetAllMocks();
    
    // Mock window.addEventListener
    if (typeof window !== 'undefined') {
      window.addEventListener = vi.fn();
      window.removeEventListener = vi.fn();
      
      // Mock setInterval to return a number (similar to real implementation)
      const mockSetInterval = vi.fn().mockReturnValue(123);
      vi.spyOn(window, 'setInterval').mockImplementation(mockSetInterval);
      
      vi.spyOn(window, 'clearInterval').mockImplementation(() => {});
    }
    
    // Mock console methods
    console.info = vi.fn();
    console.error = vi.fn();
  });
  
  afterEach(() => {
    if (typeof ClientErrorLogger.cleanup === 'function') {
      ClientErrorLogger.cleanup();
    }
    
    vi.restoreAllMocks();
  });
  
  it('should initialize correctly', () => {
    ClientErrorLogger.initialize();
    
    expect(console.info).toHaveBeenCalledWith('ClientErrorLogger initialized');
    
    if (typeof window !== 'undefined') {
      expect(window.addEventListener).toHaveBeenCalledTimes(2);
      expect(window.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
      expect(window.setInterval).toHaveBeenCalled();
    }
  });
  
  it('should clean up correctly', () => {
    ClientErrorLogger.initialize();
    ClientErrorLogger.cleanup();
    
    expect(console.info).toHaveBeenCalledWith('ClientErrorLogger cleanup complete');
    
    if (typeof window !== 'undefined') {
      expect(window.removeEventListener).toHaveBeenCalledTimes(2);
      expect(window.removeEventListener).toHaveBeenCalledWith('error', expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
      expect(window.clearInterval).toHaveBeenCalled();
    }
  });
  
  it('should log errors correctly', () => {
    const error = new Error('Test error');
    
    // Test the exported logError function
    logError(error, 'TestComponent', 'user-123');
    
    // Since we're just adding to the queue, we can verify that console doesn't show errors
    expect(console.error).not.toHaveBeenCalled();
  });
});
