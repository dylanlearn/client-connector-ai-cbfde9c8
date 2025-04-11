
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ClientErrorLogger, logClientError } from '../../monitoring/client-error-logger';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn().mockResolvedValue({ error: null })
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
  
  const mockSetInterval = vi.fn().mockReturnValue(123);
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
    window.setInterval = mockSetInterval;
    window.clearInterval = mockClearInterval;
    window.addEventListener = mockAddEventListener;
    
    // Reset ClientErrorLogger internal state
    // @ts-ignore - accessing private property for testing
    ClientErrorLogger.errorQueue = [];
    // @ts-ignore - accessing private property for testing
    ClientErrorLogger.isProcessing = false;
    // @ts-ignore - accessing private property for testing
    ClientErrorLogger.flushInterval = null;
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
    
    expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 30000);
    expect(mockAddEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });
  
  it('logs error and adds to the queue', () => {
    ClientErrorLogger.initialize();
    ClientErrorLogger.logError(new Error('Test error'), 'TestComponent');
    
    expect(console.error).toHaveBeenCalled();
    
    // @ts-ignore - accessing private property for testing
    expect(ClientErrorLogger.errorQueue.length).toBe(1);
    // @ts-ignore - accessing private property for testing
    expect(ClientErrorLogger.errorQueue[0].message).toBe('Test error');
    // @ts-ignore - accessing private property for testing
    expect(ClientErrorLogger.errorQueue[0].componentName).toBe('TestComponent');
  });
  
  it('flushes errors when queue reaches batch size', async () => {
    ClientErrorLogger.initialize();
    
    // Mock batch size
    // @ts-ignore - accessing private property for testing
    ClientErrorLogger.batchSize = 2;
    
    // Log 2 errors to trigger flush
    ClientErrorLogger.logError('Error 1', 'Component1');
    ClientErrorLogger.logError('Error 2', 'Component2');
    
    // Wait for async flush
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(supabase.rpc).toHaveBeenCalledWith(
      'batch_insert_client_errors',
      expect.any(Object)
    );
    
    // Queue should be empty after successful flush
    // @ts-ignore - accessing private property for testing
    expect(ClientErrorLogger.errorQueue.length).toBe(0);
  });
  
  it('handles auth errors specifically', () => {
    ClientErrorLogger.logAuthError('Auth failed', 'user123', { reason: 'token_expired' });
    
    expect(console.error).toHaveBeenCalled();
    
    // @ts-ignore - accessing private property for testing
    const queuedError = ClientErrorLogger.errorQueue[0];
    expect(queuedError.componentName).toBe('AuthenticationSystem');
    expect(queuedError.userId).toBe('user123');
    expect(queuedError.metadata).toEqual({ 
      errorType: 'auth',
      context: { reason: 'token_expired' } 
    });
  });
  
  it('cleans up resources when calling cleanup', () => {
    ClientErrorLogger.initialize();
    ClientErrorLogger.cleanup();
    
    expect(mockClearInterval).toHaveBeenCalled();
  });
  
  it('shows toast for critical errors using logClientError', () => {
    const criticalError = new Error('critical system failure');
    logClientError(criticalError, 'CriticalComponent');
    
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
