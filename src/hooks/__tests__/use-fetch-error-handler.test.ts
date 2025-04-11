
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useFetchErrorHandler } from '../error-handling/use-fetch-error-handler';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  }
}));

vi.mock('@/utils/monitoring/api-usage', () => ({
  recordClientError: vi.fn().mockResolvedValue(undefined)
}));

describe('useFetchErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with null error and loading false', () => {
    const { result } = renderHook(() => useFetchErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('handles errors with toast notification', async () => {
    const { result } = renderHook(() => useFetchErrorHandler({
      component: 'TestComponent'
    }));

    const testError = new Error('Test error message');
    
    await act(async () => {
      await result.current.handleError(testError, 'Error context');
    });

    expect(result.current.error).toEqual(testError);
    expect(toast.error).toHaveBeenCalledWith('Test error message', expect.any(Object));
    expect(recordClientError).toHaveBeenCalledWith(
      'Test error message',
      testError.stack,
      'TestComponent: Error context'
    );
  });

  it('does not show toast when toastOnError is false', async () => {
    const { result } = renderHook(() => useFetchErrorHandler({
      toastOnError: false
    }));

    const testError = new Error('Silent error');
    
    await act(async () => {
      await result.current.handleError(testError);
    });

    expect(result.current.error).toEqual(testError);
    expect(toast.error).not.toHaveBeenCalled();
    expect(recordClientError).toHaveBeenCalled();
  });

  it('handles string errors by converting to Error objects', async () => {
    const { result } = renderHook(() => useFetchErrorHandler());

    await act(async () => {
      await result.current.handleError('String error message');
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('String error message');
  });

  it('wraps fetch calls with loading state and error handling', async () => {
    const { result } = renderHook(() => useFetchErrorHandler());

    const successPromise = Promise.resolve('success');
    let value;
    
    await act(async () => {
      value = await result.current.wrapFetch(successPromise);
    });

    expect(value).toBe('success');
    expect(result.current.isLoading).toBe(false);
  });

  it('handles fetch failures appropriately', async () => {
    const { result } = renderHook(() => useFetchErrorHandler({
      component: 'TestComponent'
    }));

    const failPromise = Promise.reject(new Error('Fetch failed'));
    
    await act(async () => {
      try {
        await result.current.wrapFetch(failPromise, 'Fetch context');
      } catch (e) {
        // Expected to throw
      }
    });

    expect(result.current.error?.message).toBe('Fetch failed');
    expect(toast.error).toHaveBeenCalled();
    expect(recordClientError).toHaveBeenCalledWith(
      'Fetch failed',
      expect.any(String),
      'TestComponent: Fetch context'
    );
    expect(result.current.isLoading).toBe(false);
  });

  it('supports silent mode that does not update loading state', async () => {
    const { result } = renderHook(() => useFetchErrorHandler());

    let loadingChanged = false;
    
    await act(async () => {
      try {
        const initialLoadingState = result.current.isLoading;
        await result.current.wrapFetch(Promise.resolve('data'), undefined, { silent: true });
        loadingChanged = initialLoadingState !== result.current.isLoading;
      } catch (e) {
        // Not expected to throw
      }
    });

    expect(loadingChanged).toBe(false);
  });

  it('uses default error message when error has no message', async () => {
    const { result } = renderHook(() => useFetchErrorHandler({
      defaultErrorMessage: 'Default error message'
    }));

    await act(async () => {
      await result.current.handleError({} as Error);
    });

    expect(result.current.error?.message).toBe('Default error message');
  });
});
