
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ClientErrorLogger, logClientError, logError } from '../client-error-logger';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn().mockResolvedValue({ error: null }),
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null })
    })
  }
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

describe('ClientErrorLogger', () => {
  let originalConsoleError: typeof console.error;
  let originalSetInterval: typeof window.setInterval;
  let originalClearInterval: typeof window.clearInterval;
  let originalAddEventListener: typeof window.addEventListener;
  
  // Create proper mock that matches setInterval's type
  const mockSetIntervalFn = vi.fn().mockReturnValue(123);
  const mockSetInterval = Object.assign(mockSetIntervalFn, { 
    __promisify__: vi.fn() 
  });
  
  const mockClearInterval = vi.fn();
  const mockAddEventListener = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Save original functions
    originalConsoleError = console.error;
    originalSetInterval = window.setInterval;
    originalClearInterval = window.clearInterval;
    originalAddEventListener = window.addEventListener;
    
    // Mock functions
    console.error = vi.fn();
    window.setInterval = mockSetInterval as unknown as typeof window.setInterval;
    window.clearInterval = mockClearInterval;
    window.addEventListener = mockAddEventListener;
    
    // Reset ClientErrorLogger internal state
    // @ts-ignore - accessing private property for testing
    ClientErrorLogger.errorQueue = [];
    // @ts-ignore - accessing private property for testing
    ClientErrorLogger.isProcessing = false;
    // @ts-ignore - accessing private property for testing
    ClientErrorLogger.flushInterval = null;
    // @ts-ignore - accessing private property for testing
    ClientErrorLogger.isInitialized = false;
  });
  
  afterEach(() => {
    // Restore original functions
    console.error = originalConsoleError;
    window.setInterval = originalSetInterval;
    window.clearInterval = originalClearInterval;
    window.addEventListener = originalAddEventListener;
  });
  
  it('initializes with setInterval and beforeunload event listener', () => {
    ClientErrorLogger.initialize();
    
    expect(mockSetIntervalFn).toHaveBeenCalledWith(expect.any(Function), 30000);
    expect(mockAddEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });
  
  it('logs error and adds to the queue', () => {
    ClientErrorLogger.initialize();
    logError(new Error('Test error'), 'TestComponent');
    
    expect(console.error).toHaveBeenCalled();
    
    // @ts-ignore - accessing private property for testing
    expect(ClientErrorLogger.errorQueue.length).toBe(1);
    // @ts-ignore - accessing private property for testing
    expect(ClientErrorLogger.errorQueue[0].message).toBe('Test error');
    // @ts-ignore - accessing private property for testing
    expect(ClientErrorLogger.errorQueue[0].componentName).toBe('TestComponent');
  });
  
  it('handles auth errors specifically', () => {
    ClientErrorLogger.logAuthError({
      error_message: 'Auth failed',
      auth_action: 'login',
      user_email: 'test@example.com'
    });
    
    expect(console.error).toHaveBeenCalled();
    
    // Confirm that it called logClientError with the correct parameters
    expect(supabase.from).toHaveBeenCalledWith('client_errors');
    expect(supabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({
        component_name: 'Authentication',
        error_message: expect.stringContaining('Auth failed')
      })
    );
  });
  
  it('cleans up resources when calling cleanup', () => {
    ClientErrorLogger.initialize();
    ClientErrorLogger.cleanup();
    
    expect(mockClearInterval).toHaveBeenCalled();
  });
  
  it('shows toast for critical errors using logClientError', () => {
    const criticalError = new Error('critical system failure');
    logError(criticalError, 'CriticalComponent', undefined, { showToast: true });
    
    // @ts-ignore - accessing private property for testing
    expect(ClientErrorLogger.errorQueue.length).toBe(1);
    expect(toast.error).toHaveBeenCalledWith(
      "An error occurred", 
      expect.objectContaining({
        description: "Our team has been notified"
      })
    );
  });
});
