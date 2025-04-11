
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initializeErrorHandling } from '../../monitoring/error-handling';
import { recordClientError } from '../../monitoring/api-usage';
import { getErrorHandlingConfig } from '../../monitoring/error-config';

// Mock dependencies
vi.mock('../../monitoring/api-usage', () => ({
  recordClientError: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('../../monitoring/error-config', () => ({
  getErrorHandlingConfig: vi.fn().mockResolvedValue(null)
}));

describe('error-handling', () => {
  let originalAddEventListener: typeof window.addEventListener;
  let originalFetch: typeof window.fetch;
  const mockAddEventListener = vi.fn();
  const mockFetch = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Save original functions
    originalAddEventListener = window.addEventListener;
    originalFetch = window.fetch;
    
    // Mock addEventListener
    window.addEventListener = mockAddEventListener;
    
    // Mock fetch
    window.fetch = mockFetch;
    
    // Spy on console methods
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore original functions
    window.addEventListener = originalAddEventListener;
    window.fetch = originalFetch;
    
    // Restore console methods
    vi.restoreAllMocks();
  });
  
  it('initializes error handling by setting up event listeners', () => {
    initializeErrorHandling();
    
    expect(mockAddEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('error', expect.any(Function));
  });
  
  it('overrides fetch to handle network errors', () => {
    initializeErrorHandling();
    
    expect(window.fetch).not.toBe(mockFetch);
    expect(typeof window.fetch).toBe('function');
  });
  
  it('calls getErrorHandlingConfig when handling unhandled rejection', async () => {
    initializeErrorHandling();
    
    // Extract the event handler that was registered
    const unhandledRejectionHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'unhandledrejection'
    )[1];
    
    // Simulate an unhandled rejection
    await unhandledRejectionHandler({ reason: new Error('Test rejection') });
    
    expect(getErrorHandlingConfig).toHaveBeenCalledWith('Global', 'UnhandledRejection');
    expect(recordClientError).toHaveBeenCalledWith(
      'Test rejection',
      expect.any(String)
    );
    expect(console.error).toHaveBeenCalled();
  });
  
  it('calls getErrorHandlingConfig when handling uncaught error', async () => {
    initializeErrorHandling();
    
    // Extract the error event handler
    const errorHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'error'
    )[1];
    
    // Simulate an uncaught error
    await errorHandler({ error: new Error('Test error') });
    
    expect(getErrorHandlingConfig).toHaveBeenCalledWith('Global', 'UncaughtError');
    expect(recordClientError).toHaveBeenCalledWith(
      'Test error',
      expect.any(String)
    );
    expect(console.error).toHaveBeenCalled();
  });
});
