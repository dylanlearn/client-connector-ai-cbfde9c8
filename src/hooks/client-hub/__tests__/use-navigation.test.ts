
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useNavigation } from '../use-navigation';

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('useNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with null navigation error', () => {
    const { result } = renderHook(() => useNavigation());
    expect(result.current.navigationError).toBeNull();
  });

  it('should handle successful navigation', () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
    }));

    const { result } = renderHook(() => useNavigation());
    
    act(() => {
      result.current.navigateTo('/test-path', 'client-token', 'designer-id', 'task-id');
    });
    
    expect(result.current.navigationError).toBeNull();
  });

  it('should set error for missing path', () => {
    const { result } = renderHook(() => useNavigation());
    
    act(() => {
      result.current.navigateTo('', 'client-token', 'designer-id', 'task-id');
    });
    
    expect(result.current.navigationError).not.toBeNull();
    expect(result.current.navigationError?.message).toContain('Navigation path is required');
  });

  it('should set error for missing client token', () => {
    const { result } = renderHook(() => useNavigation());
    
    act(() => {
      result.current.navigateTo('/test-path', null, 'designer-id', 'task-id');
    });
    
    expect(result.current.navigationError).not.toBeNull();
    expect(result.current.navigationError?.message).toContain('Client token and designer ID are required');
  });

  it('should set error for missing task ID', () => {
    const { result } = renderHook(() => useNavigation());
    
    act(() => {
      result.current.navigateTo('/test-path', 'client-token', 'designer-id', '');
    });
    
    expect(result.current.navigationError).not.toBeNull();
    expect(result.current.navigationError?.message).toContain('Task ID is required');
  });
});
