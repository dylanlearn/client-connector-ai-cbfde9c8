
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useGlobalErrorHandler } from '../use-global-error-handler';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }
}));

vi.mock('@/utils/monitoring/api-usage', () => ({
  recordClientError: vi.fn().mockResolvedValue(undefined)
}));

describe('useGlobalErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with null error and loading false', () => {
    const { result } = renderHook(() => useGlobalErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle error with default settings', async () => {
    const { result } = renderHook(() => useGlobalErrorHandler({
      component: 'TestComponent'
    }));

    const testError = new Error('Test error');
    
    await act(async () => {
      await result.current.handleError(testError);
    });

    expect(result.current.error).toEqual(testError);
    expect(toast.error).toHaveBeenCalledWith('Test error', expect.any(Object));
    expect(recordClientError).toHaveBeenCalledWith('Test error', testError.stack, 'TestComponent');
  });

  it('should handle error with warning severity', async () => {
    const { result } = renderHook(() => useGlobalErrorHandler());

    const testError = new Error('Warning message');
    
    await act(async () => {
      await result.current.handleError(testError, undefined, 'warning');
    });

    expect(toast.warning).toHaveBeenCalled();
  });

  it('should not show toast when toastOnError is false', async () => {
    const { result } = renderHook(() => useGlobalErrorHandler({
      toastOnError: false
    }));

    const testError = new Error('Silent error');
    
    await act(async () => {
      await result.current.handleError(testError);
    });

    expect(toast.error).not.toHaveBeenCalled();
    expect(recordClientError).toHaveBeenCalled();
  });

  it('should not record error when recordToDatabase is false', async () => {
    const { result } = renderHook(() => useGlobalErrorHandler({
      recordToDatabase: false
    }));

    const testError = new Error('Unrecorded error');
    
    await act(async () => {
      await result.current.handleError(testError);
    });

    expect(toast.error).toHaveBeenCalled();
    expect(recordClientError).not.toHaveBeenCalled();
  });

  it('should normalize string errors', async () => {
    const { result } = renderHook(() => useGlobalErrorHandler());

    await act(async () => {
      await result.current.handleError('String error');
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('String error');
  });

  it('should wrap promise with loading state', async () => {
    const { result } = renderHook(() => useGlobalErrorHandler());

    const successPromise = Promise.resolve('success');
    
    let loadingDuringPromise = false;
    
    await act(async () => {
      const promise = result.current.wrapPromise(successPromise);
      loadingDuringPromise = result.current.isLoading;
      await promise;
    });

    expect(loadingDuringPromise).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle promise rejection', async () => {
    const { result } = renderHook(() => useGlobalErrorHandler());

    const failPromise = Promise.reject(new Error('Promise failed'));
    
    await act(async () => {
      try {
        await result.current.wrapPromise(failPromise, 'Promise context');
      } catch (e) {
        // Expected rejection
      }
    });

    expect(result.current.error?.message).toBe('Promise failed');
    expect(result.current.isLoading).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Promise failed', expect.objectContaining({
      description: 'Promise context'
    }));
  });

  it('should retry failed promises according to retry count', async () => {
    const mockFn = vi.fn();
    mockFn
      .mockRejectedValueOnce(new Error('Attempt 1 failed'))
      .mockRejectedValueOnce(new Error('Attempt 2 failed'))
      .mockResolvedValueOnce('success');
      
    const { result } = renderHook(() => useGlobalErrorHandler({
      retryCount: 2
    }));
    
    let value;
    
    await act(async () => {
      value = await result.current.wrapPromise(mockFn(), 'With retries');
    });
    
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(value).toBe('success');
    expect(result.current.error).toBeNull();
  });

  it('should clear errors', async () => {
    const { result } = renderHook(() => useGlobalErrorHandler());

    await act(async () => {
      await result.current.handleError('Test error');
    });
    
    expect(result.current.error).not.toBeNull();
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('should work in silent mode without changing loading state', async () => {
    const { result } = renderHook(() => useGlobalErrorHandler());

    const successPromise = Promise.resolve('success');
    
    let loadingChanged = false;
    
    await act(async () => {
      const promise = result.current.wrapPromise(successPromise, undefined, { silent: true });
      loadingChanged = result.current.isLoading !== false;
      await promise;
    });

    expect(loadingChanged).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});
